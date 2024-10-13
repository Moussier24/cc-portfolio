import { useState, useEffect, useRef } from "react";
import supabase from "@/utils/supabaseConfig";
import { Project } from "@/types/database";
import Image from "next/image";
import SortableList, { SortableItem } from "react-easy-sort";
import arrayMove from "array-move";
import { getSignedUrl } from "@/utils/supabaseHelpers";

interface ProjectFormProps {
  project: Project | null;
  onSave: () => void;
  onDelete: (projectId: number) => void;
  isLoading: boolean;
}

const ProjectForm = ({
  project,
  onSave,
  onDelete,
  isLoading,
}: ProjectFormProps) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: "",
    description: "",
    tools: [],
    roles: [],
    url: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [allImages, setAllImages] = useState<string[]>([]);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project) {
      setFormData(project);
      setAllImages(project.images || []);
    } else {
      setFormData({
        name: "",
        description: "",
        tools: [],
        roles: [],
        url: "",
      });
      setAllImages([]);
    }
    setThumbnail(null);
    setImages([]);
    setImagesPreviews([]);
    setThumbnailPreview(null);

    // Réinitialiser les champs de fichier
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    if (imagesInputRef.current) imagesInputRef.current.value = "";
  }, [project]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "tools" | "roles"
  ) => {
    const values = e.target.value.split(",").map((item) => item.trim());
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      // Créer un aperçu de la nouvelle miniature
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);

      // Créer des aperçus pour les nouvelles images
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagesPreviews(newPreviews);
      setAllImages((prev) => [...prev, ...newPreviews]);
    }
  };

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setAllImages((array) => arrayMove(array, oldIndex, newIndex));
  };

  const handleDeleteImage = (imageUrl: string) => {
    setAllImages((prevImages) => prevImages.filter((img) => img !== imageUrl));
    if (project?.images?.includes(imageUrl)) {
      setImagesToDelete((prevImagesToDelete) => [
        ...prevImagesToDelete,
        imageUrl,
      ]);
    } else {
      setImagesPreviews((prevPreviews) =>
        prevPreviews.filter((preview) => preview !== imageUrl)
      );
      setImages((prevImages) =>
        prevImages.filter((image) => URL.createObjectURL(image) !== imageUrl)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let thumbnailUrl = formData.thumbnail;
      let imageUrls = [...allImages];

      if (thumbnail) {
        const { data, error } = await supabase.storage
          .from("CC Portfolio")
          .upload(`${Date.now()}-${thumbnail.name}`, thumbnail);

        if (error) {
          console.error(
            "Erreur lors du téléchargement de la miniature:",
            error
          );
        } else {
          thumbnailUrl = await getSignedUrl("CC Portfolio", data.path);
        }
      }

      if (images.length > 0) {
        const uploadPromises = images.map((image) =>
          supabase.storage
            .from("CC Portfolio")
            .upload(`${Date.now()}-${image.name}`, image)
        );

        const results = await Promise.all(uploadPromises);
        const newImageUrls = await Promise.all(
          results
            .filter((result) => !result.error)
            .map(async (result) => {
              return await getSignedUrl("CC Portfolio", result.data!.path);
            })
        );

        imageUrls = allImages.map((img) => {
          const index = imagesPreviews.indexOf(img);
          return index !== -1 ? newImageUrls[index] : img;
        });
      }

      for (const imageUrl of imagesToDelete) {
        const path = imageUrl.split("/").pop();
        if (path) {
          await supabase.storage.from("CC Portfolio").remove([path]);
        }
      }

      const projectData = {
        ...formData,
        thumbnail: thumbnailUrl,
        images: imageUrls.filter((url) => !imagesToDelete.includes(url)),
      };

      if (project) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", project.id);

        if (error) {
          console.error("Erreur lors de la mise à jour du projet:", error);
        } else {
          onSave();
        }
      } else {
        const { error } = await supabase.from("projects").insert(projectData);

        if (error) {
          console.error("Erreur lors de la création du projet:", error);
        } else {
          onSave();
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
    } finally {
      setIsSubmitting(false);
      onSave();
    }
  };

  const handleDelete = async () => {
    if (
      project &&
      window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")
    ) {
      setIsDeleting(true);
      try {
        await onDelete(project.id);
      } catch (error) {
        console.error("Erreur lors de la suppression du projet:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1">
          Nom du projet
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          className="w-full border rounded px-2 py-1"
          rows={4}
          required
        />
      </div>
      <div>
        <label htmlFor="tools" className="block mb-1">
          Outils (séparés par des virgules)
        </label>
        <input
          type="text"
          id="tools"
          name="tools"
          value={formData.tools?.join(", ") || ""}
          onChange={(e) => handleArrayInputChange(e, "tools")}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="roles" className="block mb-1">
          Rôles (séparés par des virgules)
        </label>
        <input
          type="text"
          id="roles"
          name="roles"
          value={formData.roles?.join(", ") || ""}
          onChange={(e) => handleArrayInputChange(e, "roles")}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="url" className="block mb-1">
          URL du projet
        </label>
        <input
          type="url"
          id="url"
          name="url"
          value={formData.url || ""}
          onChange={handleInputChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label htmlFor="thumbnail" className="block mb-1">
          Miniature
        </label>
        <input
          type="file"
          id="thumbnail"
          ref={thumbnailInputRef}
          onChange={handleThumbnailChange}
          accept="image/*"
          className="w-full border rounded px-2 py-1"
        />
        {thumbnailPreview && (
          <div className="mt-2">
            <p>Nouvelle miniature :</p>
            <div className="relative aspect-square block w-32 h-32">
              <Image
                src={thumbnailPreview}
                alt="Aperçu de la nouvelle miniature"
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
            </div>
          </div>
        )}
        {formData.thumbnail && (
          <div className="mt-2">
            <p>Miniature actuelle :</p>
            <a
              href={formData.thumbnail}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square block w-32 h-32"
            >
              <Image
                src={formData.thumbnail}
                alt="Miniature du projet"
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
            </a>
          </div>
        )}
      </div>
      <div>
        <label htmlFor="images" className="block mb-1">
          Images du projet
        </label>
        <input
          type="file"
          id="images"
          ref={imagesInputRef}
          onChange={handleImagesChange}
          accept="image/*"
          multiple
          className="w-full border rounded px-2 py-1"
        />
        {allImages.length > 0 && (
          <SortableList
            onSortEnd={onSortEnd}
            className="mt-4 grid grid-cols-3 gap-4"
            draggedItemClassName="dragged"
          >
            {allImages.map((image, index) => (
              <SortableItem key={index}>
                <div className="relative aspect-square block cursor-move">
                  <Image
                    src={image || ""}
                    alt={`Aperçu ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                  >
                    X
                  </button>
                </div>
              </SortableItem>
            ))}
          </SortableList>
        )}
      </div>
      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="cc-button cc-button-small"
          disabled={isLoading || isSubmitting}
        >
          {isSubmitting
            ? "Chargement..."
            : project
            ? "Mettre à jour le projet"
            : "Créer le projet"}
        </button>
        {project && (
          <button
            type="button"
            onClick={handleDelete}
            className="cc-button cc-button-small cc-button-danger"
            disabled={isLoading || isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer le projet"}
          </button>
        )}
      </div>
    </form>
  );
};

export default ProjectForm;
