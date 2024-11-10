// src/app/quest/projects/page.tsx
import ProjectPage from '../../components/ProjectPage';

// Generate static paths for all possible project IDs
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' }
  ];
}

export default function Project({ params }: { params?: { id?: string } }) {
  const projectId = params?.id ? Number(params.id) : 1;
  return <ProjectPage projectId={projectId} />;
}