// src/sampleData.js
export const sampleRoadmap = {
  domain: "MERN Stack",
  milestones: [
    {
      id: "m1",
      title: "Milestone 1: Frontend Fundamentals",
      mentorScore: null, // NEW: Field for mentor score
      topics: [
        {
          id: "t1",
          title: "HTML & CSS Basics",
          tasks: [
            { id: "task1", description: "Learn HTML structure and tags.", completed: false, mentorNotes: "" },
            { id: "task2", description: "Understand CSS selectors, Box Model, Flexbox.", completed: false, mentorNotes: "" },
          ],
        },
        {
          id: "t2",
          title: "JavaScript Basics",
          tasks: [
            { id: "task3", description: "Variables, Data Types, Operators.", completed: false, mentorNotes: "" },
            { id: "task4", description: "Control Flow (if/else, loops).", completed: false, mentorNotes: "" },
            { id: "task5", description: "Functions and Scope.", completed: false, mentorNotes: "" },
            { id: "task6", description: "DOM Manipulation.", completed: false, mentorNotes: "" },
          ],
        },
      ],
    },
    {
      id: "m2",
      title: "Milestone 2: React Introduction",
      mentorScore: null, // NEW: Field for mentor score
      topics: [
        {
          id: "t3",
          title: "React Core Concepts",
          tasks: [
            { id: "task7", description: "Components (Functional), JSX.", completed: false, mentorNotes: "" },
            { id: "task8", description: "State and Props.", completed: false, mentorNotes: "" },
            { id: "task9", description: "Component Lifecycle & Hooks (useState, useEffect).", completed: false, mentorNotes: "" },
          ],
        },
        {
          id: "t4",
          title: "React Router",
          tasks: [
            { id: "task10", description: "Setup routing for navigation.", completed: false, mentorNotes: "" },
          ],
        },
      ],
    },
     {
          id: "m3",
          title: "Milestone 3: Backend Basics (Node.js & Express)",
          mentorScore: null, // NEW: Field for mentor score
          topics: [
            {
              id: "t5",
              title: "Node.js Fundamentals",
              tasks: [
                { id: "task11", description: "Understand the Node.js runtime environment.", completed: false, mentorNotes: "" },
                { id: "task12", description: "CommonJS vs ES Modules.", completed: false, mentorNotes: "" },
                { id: "task13", description: "NPM (Node Package Manager).", completed: false, mentorNotes: "" },
              ],
            },
            {
              id: "t6",
              title: "Express.js",
              tasks: [
                 { id: "task14", description: "Setting up an Express server.", completed: false, mentorNotes: "" },
                 { id: "task15", description: "Routing (GET, POST, etc.).", completed: false, mentorNotes: "" },
                 { id: "task16", description: "Middleware basics.", completed: false, mentorNotes: "" },
                 { id: "task17", description: "Handling requests and responses (req, res).", completed: false, mentorNotes: "" },
              ],
            },
          ],
        },
  ],
};