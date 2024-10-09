// src/app/components/QuestPage.tsx
'use client';

import React, { useState } from 'react';
import { Search, Filter, Heart, Settings, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const QuestPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const trendingProjects = [
    { id: 1, name: "Sample Project", description: "This is a sample project to showcase the QUEST system.", tags: ["Sample", "Showcase"] },
    { id: 2, name: "Project Alpha", description: "An innovative approach to solving X problem.", tags: ["Innovation", "Problem Solving"] },
    { id: 3, name: "Beta Initiative", description: "Streamlining processes for better efficiency.", tags: ["Efficiency", "Process Improvement"] },
  ];

  const allTags = ["Sample", "Showcase", "Innovation", "Problem Solving", "Efficiency", "Process Improvement"];

  const filteredProjects = trendingProjects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedTags.length === 0 || selectedTags.some(tag => project.tags.includes(tag)))
  );

  return (
    <div className="relative w-full min-h-screen bg-white text-black">
      {/* QUEST-specific header */}
      <header className="bg-[#2320AF] text-white p-4">
        <div className="flex justify-between items-center mb-4">
          <button className="text-2xl">☰</button>
          <h1 className="text-6xl font-semibold">QUEST</h1>
          <div className="flex items-center space-x-4">
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
          <Link href="/quest" className="text-white font-bold">Home</Link>
          <Link href="/quest/projects" className="text-[#B5CFFD] font-bold">Projects</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <h2 className="text-4xl font-semibold text-[#0C2066] mb-6">Welcome to QUEST</h2>
        
        {/* Search and Filter */}
        <div className="mb-6 flex space-x-4">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search projects" 
              className="w-full bg-white border border-gray-300 rounded-full px-4 py-2 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8"
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                setSelectedTags(selectedOptions);
              }}
              multiple
            >
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Trending Projects */}
        <h3 className="text-2xl font-semibold text-[#0C2066] mb-4">Trending Projects</h3>
        <div className="space-y-4">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-gray-100 rounded-lg p-4">
              <Link href={project.id === 1 ? "/quest/projects" : "/quest/projects"}>
                <h4 className="text-xl font-semibold mb-2">{project.name}</h4>
              </Link>
              <p className="mb-2">{project.description}</p>
              <div className="flex space-x-2">
                {project.tags.map(tag => (
                  <span key={tag} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* QUEST-specific footer */}
      <footer className="absolute bottom-4 left-4 flex items-center">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 36c-8.837 0-16-7.163-16-16S11.163 4 20 4s16 7.163 16 16-7.163 16-16 16z" fill="#00A9E0"/>
          <path d="M20 8c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm0 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" fill="#00A9E0"/>
        </svg>
        <span className="ml-2 text-2xl font-bold">QBE</span>
      </footer>

      {/* Chat button */}
      <button className="fixed bottom-4 right-4 bg-[#2320AF] text-white p-2 rounded-full">
        <MessageSquare size={24} />
      </button>
    </div>
  );
};

export default QuestPage;