// src/app/components/ProjectPage.tsx
'use client';

import React from 'react';
import { Heart, Settings, Edit, MessageSquare, Search } from 'lucide-react';
import Link from 'next/link';
import { useProject } from '../hooks/useProject';

interface ProjectPageProps {
  projectId: number;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ projectId }) => {
  const project = useProject(projectId);

  if (!project) {
    return <div>Project not found</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="relative min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="bg-[#2320AF] text-white p-4">
        <div className="flex justify-between items-center mb-4">
          <button className="text-2xl">☰</button>
          <h1 className="text-6xl font-semibold">QUEST</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by tag" 
                className="bg-white text-black rounded-full px-4 py-2 pr-8"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                ×
              </button>
            </div>
            <Heart className="text-white" />
            <Settings className="text-white" />
            <div className="relative">
              <img src="/api/placeholder/40/40" alt="User" className="w-10 h-10 rounded-full" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </div>
          </div>
        </div>
        <nav className="space-x-4">
          <Link href="/quest" className="text-[#B5CFFD] font-bold">Home</Link>
          <Link href="/quest/projects" className="text-white font-bold">Projects</Link>
        </nav>
      </header>

      {/* Main Content */}

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex">
          {/* Left Column with Title and Overview Combined */}
          <div className="w-2/3">
            {/* Combined Title and Overview Container */}
            <div className="flex flex-col">
              <h2 className="text-4xl font-semibold text-[#0C2066] leading-none">
                {project.name}
              </h2>
              <div className="bg-gray-200 rounded-lg p-4 mt-2">
                <h3 className="text-2xl font-semibold mb-2">Overview</h3>
                <p>{project.overview}</p>
              </div>
            </div>

            {/* Project Team Section */}
            <div className="mt-4">
              <h3 className="text-2xl font-semibold text-[#0C2066] mb-2">Project Team</h3>
              <p className="flex items-center mb-4">
                {project.name} Forum <Edit className="ml-2" size={16} />
              </p>
              <div className="relative h-80">
                {/* Project Manager */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gray-200 rounded-lg flex flex-col items-center justify-center">
                  <img src={project.team[0].image} alt={project.team[0].name} className="w-15 h-15 rounded-full mb-2" />
                  <span className="text-xs text-center">{project.team[0].role}</span>
                </div>
                {/* Connecting Lines */}
                <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gray-400"></div>
                <div className="absolute top-48 left-1/4 right-1/4 h-0.5 bg-gray-400"></div>
                {/* Team Members */}
                <div className="absolute top-52 left-0 right-0 flex justify-between">
                  {project.team.slice(1).map((member, index) => (
                    <div key={index} className="w-24 h-24 bg-gray-200 rounded-lg flex flex-col items-center justify-center">
                      <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full mb-1" />
                      <span className="text-xs text-center">{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-1/3 ml-8">
            {/* Status Section */}
            <div>
              <h2 className="text-4xl font-semibold text-[#0C2066] mb-2">Status</h2>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-16 h-16 border-2 border-red-500 rounded-lg flex items-center justify-center text-2xl font-bold">
                  {project.daysUntilMilestone}
                </div>
                <p className="text-sm">Days until<br />next milestone</p>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Start Date:</span>
                  <span>{formatDate(project.startDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">End Date:</span>
                  <span>{formatDate(project.endDate)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end mt-4">
              <Heart className="mr-2" />
              <span>add to favourites</span>
            </div>

            <div className="space-y-2 my-6">
              {['xxxxx', 'xxxxx', 'xxxxx'].map((status, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xl">{status}</span>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Project Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <div key={index} className="bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-base flex items-center">
                    {tag}
                    <button className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 flex justify-between items-center bg-white">
        <div className="flex items-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 36c-8.837 0-16-7.163-16-16S11.163 4 20 4s16 7.163 16 16-7.163 16-16 16z" fill="#00A9E0"/>
            <path d="M20 8c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm0 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" fill="#00A9E0"/>
          </svg>
          <span className="ml-2 text-2xl font-bold">QBE</span>
        </div>
        <button className="bg-[#2320AF] text-white p-2 rounded-full">
          <MessageSquare size={24} />
        </button>
      </footer>
    </div>
  );
};

export default ProjectPage;