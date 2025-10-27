// src/sampleData.js
export const sampleRoadmap = {
  domain: "MERN Stack",
  milestones: [
    {
      id: "m1", title: "Milestone 1: Frontend Fundamentals", mentorScore: null,
      topics: [
        {
          id: "t1", title: "HTML & CSS Basics",
          tasks: [
            { id: "task1", description: "Learn HTML structure and tags.", completed: false, mentorNotes: "", resources: [] }, // Add resources array
            { id: "task2", description: "Understand CSS selectors, Box Model, Flexbox.", completed: false, mentorNotes: "", resources: [] }, // Add resources array
          ],
        },
        {
          id: "t2", title: "JavaScript Basics",
          tasks: [
            { id: "task3", description: "Variables, Data Types, Operators.", completed: false, mentorNotes: "", resources: [] }, // Add resources array
            { id: "task4", description: "Control Flow (if/else, loops).", completed: false, mentorNotes: "", resources: [] }, // Add resources array
            { id: "task5", description: "Functions and Scope.", completed: false, mentorNotes: "", resources: [] }, // Add resources array
            { id: "task6", description: "DOM Manipulation.", completed: false, mentorNotes: "", resources: [] }, // Add resources array
          ],
        },
      ],
    },
    {
      id: "m2", title: "Milestone 2: React Introduction", mentorScore: null,
      topics: [
        {
          id: "t3", title: "React Core Concepts",
          tasks: [
            { id: "task7", description: "Components (Functional), JSX.", completed: false, mentorNotes: "", resources: [] }, // Add resources array
            { id: "task8", description: "State and Props.", completed: false, mentorNotes: "", resources: [] }, // Add resources array
            { id: "task9", description: "Component Lifecycle & Hooks (useState, useEffect).", completed: false, mentorNotes: "", resources: [] }, // Add resources array
          ],
        },
        {
          id: "t4", title: "React Router",
          tasks: [
            { id: "task10", description: "Setup routing for navigation.", completed: false, mentorNotes: "", resources: [] }, // Add resources array
          ],
        },
      ],
    },
     {
          id: "m3", title: "Milestone 3: Backend Basics (Node.js & Express)", mentorScore: null,
          topics: [
            {
              id: "t5", title: "Node.js Fundamentals",
              tasks: [
                { id: "task11", description: "Understand the Node.js runtime environment.", completed: false, mentorNotes: "", resources: [] }, // Add resources array
                { id: "task12", description: "CommonJS vs ES Modules.", completed: false, mentorNotes: "", resources: [] }, // Add resources array
                { id: "task13", description: "NPM (Node Package Manager).", completed: false, mentorNotes: "", resources: [] }, // Add resources array
              ],
            },
            {
              id: "t6", title: "Express.js",
              tasks: [
                 { id: "task14", description: "Setting up an Express server.", completed: false, mentorNotes: "", resources: [] }, // Add resources array
                 { id: "task15", description: "Routing (GET, POST, etc.).", completed: false, mentorNotes: "", resources: [] }, // Add resources array
                 { id: "task16", description: "Middleware basics.", completed: false, mentorNotes: "", resources: [] }, // Add resources array
                 { id: "task17", description: "Handling requests and responses (req, res).", completed: false, mentorNotes: "", resources: [] }, // Add resources array
              ],
            },
          ],
        },
  ],
};