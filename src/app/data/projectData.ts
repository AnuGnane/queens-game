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
  department: string; // Added department field
  overview: string;
  team: TeamMember[];
  isPinned?: boolean; // Added for pinned projects
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
    department: "Technology",
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
    department: "Claims",
    overview: "Project Alpha aims to revolutionize our approach to problem X through innovative solutions.",
    team: [
      { role: "Project Manager", name: "Alpha Lead", image: "/api/placeholder/60/60" },
      { role: "Team Lead 1", name: "Innovation Lead", image: "/api/placeholder/50/50" },
      { role: "Employee 1", name: "Developer 1", image: "/api/placeholder/50/50" },
      { role: "Employee 2", name: "Developer 2", image: "/api/placeholder/50/50" },
    ],
    isPinned: true
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
    department: "Operations",
    overview: "The Beta Initiative focuses on improving our core processes to achieve better efficiency.",
    team: [
      { role: "Project Manager", name: "Beta Manager", image: "/api/placeholder/60/60" },
      { role: "Team Lead 1", name: "Process Lead", image: "/api/placeholder/50/50" },
      { role: "Employee 1", name: "Analyst 1", image: "/api/placeholder/50/50" },
      { role: "Employee 2", name: "Analyst 2", image: "/api/placeholder/50/50" },
    ]
  },
  {
    id: 4,
    name: "DataHub Expansion",
    description: "Expanding data infrastructure capabilities.",
    status: "In Progress",
    daysUntilMilestone: 20,
    startDate: "2024-01-15",
    endDate: "2024-07-30",
    tags: ["Data", "Infrastructure"],
    department: "Technology",
    overview: "Major expansion of our data infrastructure to support growing business needs.",
    team: [
      { role: "Project Manager", name: "Data Lead", image: "/api/placeholder/60/60" },
      { role: "Team Lead 1", name: "Infrastructure Lead", image: "/api/placeholder/50/50" },
      { role: "Employee 1", name: "Data Engineer", image: "/api/placeholder/50/50" },
      { role: "Employee 2", name: "System Architect", image: "/api/placeholder/50/50" },
    ],
    isPinned: true
  },
  {
    id: 5,
    name: "Risk Assessment Tool",
    description: "New tool for risk assessment and management.",
    status: "Planning",
    daysUntilMilestone: 45,
    startDate: "2024-04-01",
    endDate: "2024-10-31",
    tags: ["Risk Management", "Assessment"],
    department: "Underwriting",
    overview: "Development of a comprehensive risk assessment tool for underwriting processes.",
    team: [
      { role: "Project Manager", name: "Risk Lead", image: "/api/placeholder/60/60" },
      { role: "Team Lead 1", name: "Assessment Lead", image: "/api/placeholder/50/50" },
      { role: "Employee 1", name: "Risk Analyst", image: "/api/placeholder/50/50" },
    ]
  },
  {
    id: 6,
    name: "Finance Transformation",
    description: "Modernizing financial systems and processes.",
    status: "Active",
    daysUntilMilestone: 25,
    startDate: "2024-02-01",
    endDate: "2024-08-31",
    tags: ["Finance", "Modernization"],
    department: "Finance",
    overview: "Complete transformation of financial systems to improve efficiency and reporting.",
    team: [
      { role: "Project Manager", name: "Finance Lead", image: "/api/placeholder/60/60" },
      { role: "Team Lead 1", name: "Systems Lead", image: "/api/placeholder/50/50" },
      { role: "Employee 1", name: "Financial Analyst", image: "/api/placeholder/50/50" },
    ]
  },
  {
    id: 7,
    name: "Cyber MI",
    description: "Cyber security monitoring and intelligence platform.",
    status: "In Progress",
    daysUntilMilestone: 15,
    startDate: "2024-03-15",
    endDate: "2024-09-15",
    tags: ["Security", "Monitoring"],
    department: "Technology",
    overview: "Implementation of advanced cyber security monitoring and intelligence tools.",
    team: [
      { role: "Project Manager", name: "Security Lead", image: "/api/placeholder/60/60" },
      { role: "Team Lead 1", name: "Intelligence Lead", image: "/api/placeholder/50/50" },
      { role: "Employee 1", name: "Security Analyst", image: "/api/placeholder/50/50" },
    ],
    isPinned: true
  },
  {
    id: 8,
    name: "Claims Automation",
    description: "Automating claims processing workflows.",
    status: "Planning",
    daysUntilMilestone: 35,
    startDate: "2024-05-01",
    endDate: "2024-11-30",
    tags: ["Automation", "Claims"],
    department: "Claims",
    overview: "Implementing automated workflows for claims processing to improve efficiency.",
    team: [
      { role: "Project Manager", name: "Claims Lead", image: "/api/placeholder/60/60" },
      { role: "Team Lead 1", name: "Automation Lead", image: "/api/placeholder/50/50" },
      { role: "Employee 1", name: "Process Analyst", image: "/api/placeholder/50/50" },
    ]
  },
  {
    id: 9,
    name: "TDM",
    description: "Test Data Management System.",
    status: "Active",
    daysUntilMilestone: 10,
    startDate: "2024-02-20",
    endDate: "2024-07-31",
    tags: ["Testing", "Data Management"],
    department: "Technology",
    overview: "Development of a comprehensive test data management system.",
    team: [
      { role: "Project Manager", name: "TDM Lead", image: "/api/placeholder/60/60" },
      { role: "Team Lead 1", name: "Test Lead", image: "/api/placeholder/50/50" },
      { role: "Employee 1", name: "Test Engineer", image: "/api/placeholder/50/50" },
    ],
    isPinned: true
  }
];