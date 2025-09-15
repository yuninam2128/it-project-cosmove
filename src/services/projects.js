// Temporary compatibility layer for projects service
// TODO: Migrate to Clean Architecture

export const createProject = async (projectData) => {
  console.log('createProject called with:', projectData);
  // Temporary implementation
  return { id: Date.now().toString(), ...projectData };
};

export const updateProject = async (projectId, updates) => {
  console.log('updateProject called with:', projectId, updates);
  // Temporary implementation
  return { id: projectId, ...updates };
};

export const deleteProject = async (projectId) => {
  console.log('deleteProject called with:', projectId);
  // Temporary implementation
};

export const getUserProjects = async (userId) => {
  console.log('getUserProjects called with:', userId);
  // Temporary implementation
  return {
    projects: [],
    positions: {}
  };
};

export const getProject = async (projectId) => {
  console.log('getProject called with:', projectId);
  // Temporary implementation
  return null;
};

export const updateProjectPosition = async (projectId, position) => {
  console.log('updateProjectPosition called with:', projectId, position);
  // Temporary implementation
};

export const updateMultipleProjectPositions = async (positions) => {
  console.log('updateMultipleProjectPositions called with:', positions);
  // Temporary implementation
};

export const subscribeToUserProjects = (userId, callback) => {
  console.log('subscribeToUserProjects called with:', userId);
  // Temporary implementation - return empty unsubscribe function
  return () => {};
};