import supabase from "./supabaseConfig";

export async function getSignedUrl(
  bucket: string,
  path: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 365); // URL valide pendant 1 an

  if (error) {
    console.error("Erreur lors de la création de l'URL signée:", error);
    return "";
  }

  return data.signedUrl;
}
