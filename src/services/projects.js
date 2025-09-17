// Temporary compatibility layer for projects service
// TODO: Migrate to Clean Architecture

import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

const projectsCol = collection(db, 'projects');

export const createProject = async (projectData) => {
  const nowFields = {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const data = {
    title: projectData.title,
    description: projectData.description ?? '',
    priority: projectData.priority ?? '중',
    progress: Number(projectData.progress ?? 0),
    deadline: projectData.deadline ?? null,
    ownerId: projectData.ownerId,
    position: projectData.position ?? null,
    subtasks: projectData.subtasks ?? [],
    ...nowFields
  };

  const ref = await addDoc(projectsCol, data);
  return { id: ref.id, ...data };
};

export const updateProject = async (projectId, updates) => {
  const docRef = doc(db, 'projects', projectId);
  await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() });
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const deleteProject = async (projectId) => {
  await deleteDoc(doc(db, 'projects', projectId));
};

export const getUserProjects = async (userId) => {
  const snap = await getDocs(projectsCol);
  const projects = [];
  const positions = {};

  snap.docs.forEach(d => {
    const data = d.data();
    if (!userId || data.ownerId === userId) {
      projects.push({ id: d.id, ...data });
      if (data.position) positions[d.id] = data.position;
    }
  });

  return { projects, positions };
};

export const getProject = async (projectId) => {
  const snap = await getDoc(doc(db, 'projects', projectId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateProjectPosition = async (projectId, position) => {
  await updateDoc(doc(db, 'projects', projectId), {
    position: { x: position.x, y: position.y, radius: position.radius },
    updatedAt: serverTimestamp()
  });
};

export const updateMultipleProjectPositions = async (positions) => {
  const ops = Object.entries(positions).map(([projectId, position]) =>
    updateProjectPosition(projectId, position)
  );
  await Promise.all(ops);
};

export const subscribeToUserProjects = (userId, callback) => {
  return onSnapshot(projectsCol, (querySnapshot) => {
    const projects = [];
    const positions = {};
    querySnapshot.forEach((d) => {
      const data = d.data();
      if (!userId || data.ownerId === userId) {
        projects.push({ id: d.id, ...data });
        if (data.position) positions[d.id] = data.position;
      }
    });
    callback({ projects, positions });
  }, (error) => {
    console.error('프로젝트 실시간 구독 중 오류:', error);
    callback({ projects: [], positions: {} });
  });
};