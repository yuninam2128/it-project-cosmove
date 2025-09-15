import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { DIContainer } from '../../infrastructure/container/DIContainer';
import { CreateProjectDTO, UpdateProjectDTO } from '../../application/dto/ProjectDTO';

const ProjectExample = () => {
  const projectApplicationService = DIContainer.getProjectApplicationService();
  const {
    projects,
    positions,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject
  } = useProjects(projectApplicationService);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    deadline: ''
  });

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const createProjectDTO = CreateProjectDTO.fromRequest(formData);
      await createProject(createProjectDTO);
      setFormData({ title: '', description: '', priority: 'medium', deadline: '' });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleUpdateProject = async (projectId, updates) => {
    try {
      const updateProjectDTO = UpdateProjectDTO.fromRequest(updates);
      await updateProject(projectId, updateProjectDTO);
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Projects</h2>
      
      {/* Create Project Form */}
      <form onSubmit={handleCreateProject}>
        <input
          type="text"
          placeholder="Project Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
        <select
          value={formData.priority}
          onChange={(e) => setFormData({...formData, priority: e.target.value})}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData({...formData, deadline: e.target.value})}
        />
        <button type="submit">Create Project</button>
      </form>

      {/* Projects List */}
      <div>
        {projects.map(project => (
          <div key={project.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>Priority: {project.priority}</p>
            <p>Progress: {project.progress}%</p>
            {project.deadline && <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>}
            
            <button onClick={() => handleUpdateProject(project.id, { progress: project.progress + 10 })}>
              Increase Progress
            </button>
            <button onClick={() => handleDeleteProject(project.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectExample;