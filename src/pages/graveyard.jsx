import React, { useState, useEffect } from 'react';
import Tombstone from '../components/tombstone';
import GhostPopup from '../components/ghostpopup';
import { useProjects } from '../components/projectContext';
import { generateCommitsForProjects } from '../utils/commitGenerator';

const Graveyard = () => {
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allCommits, setAllCommits] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null); // null means "All Projects"
  const [filteredCommits, setFilteredCommits] = useState([]);
  
  const { projectsList } = useProjects();

  // Generate commits on mount
  useEffect(() => {
    if (projectsList && projectsList.length > 0) {
      const commits = generateCommitsForProjects(projectsList);
      setAllCommits(commits);
    }
  }, [projectsList]);

  // Filter commits based on selected project and search term
  useEffect(() => {
    let commits = allCommits;

    // Filter by selected project
    if (selectedProject !== null) {
      commits = commits.filter(commit => commit.projectId === selectedProject);
    }

    // Filter by search term (message, author, or project name)
    if (searchTerm) {
      commits = commits.filter(commit =>
        commit.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commit.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commit.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCommits(commits);
  }, [allCommits, selectedProject, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 relative">
      {/* Cemetery Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-900 to-black"></div>
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1506197603050-40fe985193e8?ixlib=rb-4.0.3')] bg-cover"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "'Creepster', cursive" }}>
            ⚰️ TIME CEMETERY ⚰️
          </h1>
          <p className="text-xl text-purple-400 italic" style={{ fontFamily: "'Eater', cursive" }}>
            Where Commits Rest in Peace... Or Do They?
          </p>
        </header>

        {/* Project Selector and Search Bar */}
        <div className="max-w-md mx-auto mb-8 space-y-4">
          {/* Project Selector Dropdown */}
          <select
            value={selectedProject === null ? '' : selectedProject}
            onChange={(e) => setSelectedProject(e.target.value === '' ? null : parseInt(e.target.value))}
            className="w-full bg-black/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white focus:border-purple-600 focus:outline-none backdrop-blur-sm cursor-pointer"
            style={{ fontFamily: "'Eater', cursive" }}
          >
            <option value="">👻 All Projects</option>
            {projectsList.map(project => (
              <option key={project.id} value={project.id}>
                {project.ghost} {project.name}
              </option>
            ))}
          </select>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search through the graves..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border-2 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-purple-600 focus:outline-none backdrop-blur-sm"
          />
        </div>

        {/* Tombstone Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommits.map((commit, index) => (
            <Tombstone
              key={commit.hash}
              commit={commit}
              onClick={() => setSelectedCommit(commit)}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredCommits.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💀</div>
            <p className="text-xl text-gray-400">No spirits found in these graves...</p>
          </div>
        )}
      </div>

      {/* Ghost Popup */}
      {selectedCommit && (
        <GhostPopup
          commit={selectedCommit}
          onClose={() => setSelectedCommit(null)}
        />
      )}
    </div>
  );
};

export default Graveyard;