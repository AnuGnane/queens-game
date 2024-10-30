// src/app/hooks/useProject.ts
import { projectsData, Project } from '../data/projectData';

export const useProject = (id: number): Project | undefined => {
  return projectsData.find(project => project.id === id);
};

export const useProjects = () => {
  return projectsData;
};