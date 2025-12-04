import { useProjects } from './projectContext';
import { saveSelectedProject } from '../utils/storageHelpers';

/**
 * ProjectSelector Component
 * Dropdown component for selecting active project with localStorage persistence
 * 
 * @param {Object} props
 * @param {Object|null} props.selectedProject - Currently selected project
 * @param {Function} props.onProjectChange - Callback when project selection changes
 */
const ProjectSelector = ({ selectedProject, onProjectChange }) => {
  const { projectsList } = useProjects();

  const handleProjectChange = (e) => {
    const projectId = parseInt(e.target.value, 10);
    
    if (isNaN(projectId)) {
      onProjectChange(null);
      return;
    }

    const project = projectsList.find(p => p.id === projectId);
    
    if (project) {
      // Save to localStorage
      saveSelectedProject(projectId);
      // Notify parent component
      onProjectChange(project);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-700 mb-6">
      <div className="flex items-center gap-4">
        <label className="text-white font-bold text-lg flex items-center gap-2">
          <span className="text-2xl">👻</span>
          Select Project:
        </label>
        <select
          value={selectedProject?.id || ''}
          onChange={handleProjectChange}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer hover:border-purple-600"
        >
          <option value="">-- Choose a haunted project --</option>
          {projectsList.map(project => (
            <option key={project.id} value={project.id}>
              {project.ghost} {project.name} - {project.type}
            </option>
          ))}
        </select>
      </div>
      
      {selectedProject && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{selectedProject.ghost}</span>
            <div>
              <h3 className="text-white font-bold text-lg">{selectedProject.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{selectedProject.description}</p>
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-purple-400">Type: {selectedProject.type}</span>
                <span className="text-purple-400">Status: {selectedProject.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!selectedProject && (
        <div className="mt-4 pt-4 border-t border-gray-700 text-center">
          <p className="text-gray-500 italic">
            🔮 Select a project to begin your deployment ritual...
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;
