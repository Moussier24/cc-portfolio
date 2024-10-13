"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabaseConfig";
import { Project } from "@/types/database";
import Sidebar from "@/components/admin/Sidebar";
import ProjectForm from "@/components/admin/ProjectForm";

const AdminPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchProjects();
    }
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des projets:", error);
    } else {
      setProjects(data || []);
    }
  };

  const handleAddNewProject = () => {
    setSelectedProject(null);
  };

  const handleDeleteProject = async (projectId: number) => {
    setIsLoading(true);
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("Erreur lors de la suppression du projet:", error);
    } else {
      await fetchProjects();
      setSelectedProject(null);
    }
    setIsLoading(false);
  };

  const handleSaveProject = async () => {
    setIsLoading(true);
    await fetchProjects();
    setIsLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } else {
      router.push("/login");
    }
  };

  if (!isAuthenticated) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex min-h-screen cc-container my-12">
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
        onAddNewProject={handleAddNewProject}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-8">
        <ProjectForm
          project={selectedProject}
          onSave={handleSaveProject}
          onDelete={handleDeleteProject}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default AdminPage;
