import Tag from "@/components/Tag";
import { Project } from "@/types/database";
import supabase from "@/utils/supabaseConfig";
import { ArrowUpRight01Icon, MailAtSign01Icon } from "hugeicons-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;

type Props = {
  params: {
    projectId: string;
  };
};

async function getData(projectId: string): Promise<{
  project: Project | null;
}> {
  const data: {
    project: Project | null;
  } = {
    project: null,
  };

  const { data: project, error } = await supabase
    .from("projects")
    .select()
    .eq("uid", projectId)
    .single();

  if (error) {
    throw error;
  }

  data.project = project as Project;

  return data;
}

export default async function page({ params }: Props) {
  const projectId = params.projectId;
  const { project } = await getData(projectId);

  if (!project || !project) {
    return notFound();
  }

  return (
    <main className="my-24">
      <section className="cc-container" id="description">
        <div className="flex justify-between items-end flex-wrap gap-y-8">
          <h1 className="text-[35px] small:text-[60px]] sm:text-[100px] sm:leading-[70px]">
            {project.name}
          </h1>

          <div className="flex gap-4">
            <Link
              href={project.url || "#"}
              target="_blank"
              className="cc-button-small cc-button-border"
            >
              <span>Voir le site</span>
              <ArrowUpRight01Icon size={18} />
            </Link>
            <a
              href={`mailto:papicisse24@gmail.com?subject=Demande de collaboration&body=Bonjour Cheik, j'ai vu votre projet ${project.name} et j'aimerais discuter d'une collaboration avec vous.`}
              className="cc-button-small"
            >
              <span>Je veux la même chose</span>
              <MailAtSign01Icon size={18} />
            </a>
          </div>
        </div>
        <p className="text-[#5D4300] leading-7 mt-7 py-8 border-t border-[#5D4300] normal-case">
          {project.description}
        </p>
        <ul className="flex gap-4 flex-wrap">
          {project.tools?.map((tool) => (
            <li key={tool}>
              <Tag text={tool.toUpperCase()} />
            </li>
          ))}
        </ul>
      </section>
      <section id="images" className="cc-container mt-9 flex flex-col gap-4">
        {project.images?.map((image) => (
          <picture key={image} className="w-full max-w-full h-auto">
            <img
              src={image}
              alt={project.name || ""}
              className="w-full h-auto rounded-[15px]"
            />
          </picture>
        ))}
      </section>
    </main>
  );
}
