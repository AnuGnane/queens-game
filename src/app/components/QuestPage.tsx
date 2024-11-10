// src/app/components/QuestPage.tsx
'use client';

import React, { useState } from 'react';
import {  Bell, Settings, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useProjects } from '../hooks/useProject';

const QuestPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const projects = useProjects();

  const departments = [
    { name: 'Finance', color: '#3462A8' },
    { name: 'Claims', color: '#371896' },
    { name: 'Underwriting', color: '#1C2D73' },
    { name: 'QBE Re', color: '#8788CE' },
    { name: 'Technology', color: '#29C8E4' },
    { name: 'Operations', color: '#193680' },
    { name: 'People', color: '#11175D' },
    { name: 'Acturial', color: '#334564' },
  ];

  const filterProjects = () => {
    return projects.filter(project => {
      const matchesSearch = searchTerm === '' || 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDepartment = !selectedDepartment || project.department === selectedDepartment;

      return matchesSearch && matchesDepartment;
    });
  };

  const trendingProjects = filterProjects().slice(0, 3);
  const pinnedProjects = projects.filter(project => project.isPinned);

  const handleDepartmentClick = (department: string) => {
    setSelectedDepartment(department);
  };

  const clearDepartmentFilter = () => {
    setSelectedDepartment(null);
  };

  return (
    <div className="relative min-h-screen bg-white text-black flex flex-col">
      {/* Header - Matched with ProjectPage */}
      <header className="bg-[#2320AF] text-white p-4">
        <div className="flex justify-between items-center mb-4">
          <button className="text-2xl">☰</button>
          <h1 className="text-6xl font-semibold">QUEST</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search Projects" 
                className="bg-white text-black rounded-full px-4 py-2 pr-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  ×
                </button>
              )}
            </div>
            <Settings className="text-white" />
            <Bell className="text-white" />
            <div className="relative">
              <img 
                src="/api/placeholder/40/40" 
                alt="User" 
                className="w-10 h-10 rounded-full"
              />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </div>
          </div>
        </div>
        <nav className="space-x-4">
          <Link href="/quest" className="text-white font-bold">Home</Link>
          <Link href="/quest/projects" className="text-[#B5CFFD] font-bold">Projects</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex">
          <div className="w-2/3">
            <h2 className="text-4xl font-semibold text-[#0C2066] mb-8">Welcome to Quest!</h2>
            
            {/* Projects by Department */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold text-[#0C2066]">Projects by Department</h3>
                {selectedDepartment && (
                  <button 
                    onClick={clearDepartmentFilter}
                    className="text-[#3961AA] text-sm hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {departments.map((dept, index) => (
                  <div 
                    key={index} 
                    className={`h-36 rounded flex items-center justify-center cursor-pointer transition-transform hover:scale-105 ${
                      selectedDepartment === dept.name ? 'ring-4 ring-blue-400' : ''
                    }`}
                    style={{ backgroundColor: dept.color }}
                    onClick={() => handleDepartmentClick(dept.name)}
                  >
                    <span className="text-white text-xl font-semibold text-center px-2">
                      {dept.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Projects or Trending Projects */}
            {selectedDepartment ? (
              <div>
                <h3 className="text-2xl font-semibold text-[#0C2066] mb-4">
                  {selectedDepartment} Projects
                </h3>
                <div className="space-y-4">
                  {filterProjects().map((project) => (
                    <Link key={project.id} href={`/quest/projects?id=${project.id}`}>
                      <div className="bg-gray-200 rounded-lg p-4 hover:bg-gray-300 transition-colors">
                        <h4 className="text-xl font-semibold mb-2">{project.name}</h4>
                        <p className="text-gray-600 mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span 
                              key={tag}
                              className="bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold text-[#0C2066] mb-4">Trending Projects</h3>
                <div className="space-y-3">
                  {trendingProjects.map((project) => (
                    <Link key={project.id} href={`/quest/projects?id=${project.id}`}>
                      <div className="bg-gray-200 rounded-lg p-4 hover:bg-gray-300 transition-colors">
                        <h4 className="text-xl font-semibold">{project.name}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="w-1/3 ml-8">
            <h3 className="text-2xl font-semibold text-[#0C2066] mb-4">Pinned Projects</h3>
            <div className="space-y-3">
              {pinnedProjects.map((project) => (
                <Link key={project.id} href={`/quest/projects?id=${project.id}`}>
                  <div className="bg-gray-200 rounded-lg p-4 hover:bg-gray-300 transition-colors">
                    <h4 className="text-xl font-semibold">{project.name}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="mt-8 border-t pt-4">
            <h3 className="text-2xl font-semibold text-[#0C2066] mb-4">
              Search Results ({filterProjects().length} projects found)
            </h3>
            <div className="space-y-4">
              {filterProjects().map((project) => (
                <Link key={project.id} href={`/quest/projects?id=${project.id}`}>
                  <div className="bg-gray-200 rounded-lg p-4 hover:bg-gray-300 transition-colors">
                    <h4 className="text-xl font-semibold mb-2">{project.name}</h4>
                    <p className="text-gray-600 mb-2">{project.description}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-[#3961AA]">{project.department}</span>
                      <span className="text-gray-400">•</span>
                      <div className="flex space-x-2">
                        {project.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer - Matched with ProjectPage */}
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

export default QuestPage;