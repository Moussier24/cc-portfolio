import { Project } from "@/types/database";

interface SidebarProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onAddNewProject: () => void;
  selectedProject: Project | null;
  onLogout: () => void;
}

const Sidebar = ({
  projects,
  onSelectProject,
  onAddNewProject,
  selectedProject,
  onLogout,
}: SidebarProps) => {
  return (
    <aside className="w-64 bg-white rounded-2xl p-4 overflow-y-auto flex flex-col h-full">
      <div className="flex-grow">
        <h2 className="text-xl font-bold mb-4">Projets</h2>

        <button
          onClick={onAddNewProject}
          className="cc-button cc-button-small cc-button-border w-full mb-4"
        >
          Ajouter un projet
        </button>

        <ul>
          {projects.map((project) => (
            <li
              key={project.id}
              className={`mb-4 cursor-pointer p-2 rounded ${
                selectedProject?.id === project.id
                  ? "bg-yellow-100"
                  : "hover:bg-yellow-50"
              }`}
              onClick={() => onSelectProject(project)}
            >
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-sm lowercase truncate text-gray-500">
                {project.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onLogout}
        className="cc-button cc-button-small cc-button-border w-full mt-4"
      >
        Se déconnecter
      </button>
    </aside>
  );
};

export default Sidebar;
