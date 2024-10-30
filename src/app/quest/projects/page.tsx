// src/app/quest/projects/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import ProjectPage from '../../components/ProjectPage';

export default function Project() {
  const searchParams = useSearchParams();
  const projectId = Number(searchParams.get('id')) || 1; // Default to project 1 if no ID provided

  return <ProjectPage projectId={projectId} />;
}