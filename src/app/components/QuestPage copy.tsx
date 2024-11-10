// src/app/components/QuestPage.tsx
'use client';

import React, { useState } from 'react';
import { Search, Filter, Heart, Settings, MessageSquare, X } from 'lucide-react';
import Link from 'next/link';
import { useProjects } from '../hooks/useProject';

const QuestPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const projects = useProjects();

  // Get unique tags from all projects
  const allTags = Array.from(new Set(projects.flatMap(project => project.tags)));

  // Improved search function with fuzzy matching
  const filterProjects = () => {
    return projects.filter(project => {
      // Case insensitive search term
      const search = searchTerm.toLowerCase().trim();
      
      // If no search term and no tags selected, show all projects
      if (search === '' && selectedTags.length === 0) return true;

      // Search in project name (less strict)
      const nameMatch = project.name.toLowerCase().includes(search);
      
      // Search in project description
      const descriptionMatch = project.description.toLowerCase().includes(search);
      
      // Search in project tags
      const tagMatch = project.tags.some(tag => 
        tag.toLowerCase().includes(search)
      );

      // Check if project matches selected tags
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.every(tag => project.tags.includes(tag));

      // Return true if any of the search criteria match AND tag filter matches
      return (nameMatch || descriptionMatch || tagMatch) && matchesTags;
    });
  };

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        // Remove tag if already selected
        return prev.filter(t => t !== tag);
      } else {
        // Add tag if not selected
        return [...prev, tag];
      }
    });
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  const filteredProjects = filterProjects();

  return (
    <div className="relative w-full min-h-screen bg-white text-black">
      {/* Header */}
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
        <div className="mb-6 flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="flex space-x-4">
            <div className="relative flex-grow">
              <input 
                type="text" 
                placeholder="Search projects by name, description, or tags" 
                className="w-full bg-white border border-gray-300 rounded-full px-4 py-2 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="text-gray-400 mr-2" size={20} />
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
                }`}
              >
                {tag}
              </button>
            ))}
            {(selectedTags.length > 0 || searchTerm) && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Trending Projects */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-[#0C2066]">Trending Projects</h3>
          <span className="text-gray-600">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
          </span>
        </div>
        
        <div className="space-y-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <div key={project.id} className="bg-gray-100 rounded-lg p-4">
                <Link href={`/quest/projects?id=${project.id}`}>
                  <h4 className="text-xl font-semibold mb-2">{project.name}</h4>
                </Link>
                <p className="mb-2">{project.description}</p>
                <div className="flex space-x-2">
                  {project.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-300"
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No projects found matching your search criteria
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 left-4 flex items-center">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 36c-8.837 0-16-7.163-16-16S11.163 4 20 4s16 7.163 16 16-7.163 16-16 16z" fill="#00A9E0"/>
          <path d="M20 8c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm0 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" fill="#00A9E0"/>
        </svg>
        <span className="ml-2 text-2xl font-bold">QBE</span>
      </footer>

      <button className="fixed bottom-4 right-4 bg-[#2320AF] text-white p-2 rounded-full">
        <MessageSquare size={24} />
      </button>
    </div>
  );
};

export default QuestPage;