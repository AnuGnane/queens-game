// src/app/data/projectData.ts
export interface TeamMember {
    role: string;
    name: string;
    image: string;
  }
  
  export interface Project {
    id: number;
    name: string;
    description: string;
    status: string;
    daysUntilMilestone: number;
    startDate: string;
    endDate: string;
    tags: string[];
    overview: string;
    team: TeamMember[];
  }
  
  export const projectsData: Project[] = [
    {
      id: 1,
      name: "Sample Project",
      description: "This is a sample project to showcase the QUEST system.",
      status: "In Progress",
      daysUntilMilestone: 15,
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      tags: ["Sample", "Showcase"],
      overview: "This is a sample project overview. It demonstrates the key features and objectives of the project.",
      team: [
        { role: "Project Manager", name: "Project Manager", image: "/api/placeholder/60/60" },
        { role: "Team Lead 1", name: "Team Lead 1", image: "/api/placeholder/50/50" },
        { role: "Team Lead 2", name: "Team Lead 2", image: "/api/placeholder/50/50" },
        { role: "Employee 1", name: "Employee 1", image: "/api/placeholder/50/50" },
        { role: "Employee 2", name: "Employee 2", image: "/api/placeholder/50/50" },
      ]
    },
    {
      id: 2,
      name: "Project Alpha",
      description: "An innovative approach to solving X problem.",
      status: "Planning",
      daysUntilMilestone: 30,
      startDate: "2024-02-15",
      endDate: "2024-08-15",
      tags: ["Innovation", "Problem Solving"],
      overview: "Project Alpha aims to revolutionize our approach to problem X through innovative solutions.",
      team: [
        { role: "Project Manager", name: "Alpha Lead", image: "/api/placeholder/60/60" },
        { role: "Team Lead 1", name: "Innovation Lead", image: "/api/placeholder/50/50" },
        { role: "Employee 1", name: "Developer 1", image: "/api/placeholder/50/50" },
        { role: "Employee 2", name: "Developer 2", image: "/api/placeholder/50/50" },
      ]
    },
    {
      id: 3,
      name: "Beta Initiative",
      description: "Streamlining processes for better efficiency.",
      status: "Active",
      daysUntilMilestone: 7,
      startDate: "2024-03-01",
      endDate: "2024-09-30",
      tags: ["Efficiency", "Process Improvement"],
      overview: "The Beta Initiative focuses on improving our core processes to achieve better efficiency.",
      team: [
        { role: "Project Manager", name: "Beta Manager", image: "/api/placeholder/60/60" },
        { role: "Team Lead 1", name: "Process Lead", image: "/api/placeholder/50/50" },
        { role: "Employee 1", name: "Analyst 1", image: "/api/placeholder/50/50" },
        { role: "Employee 2", name: "Analyst 2", image: "/api/placeholder/50/50" },
      ]
    }
  ];