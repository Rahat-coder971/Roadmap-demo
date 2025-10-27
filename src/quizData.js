// src/quizData.js

// Structure: { topicId: [ { q: 'Question?', options: ['Opt1', 'Opt2'], correct: 0 (index) }, ... ] }
export const sampleQuizData = {
  "t1": [ // HTML & CSS Basics
    { id: "q1t1", q: "What does CSS stand for?", options: ["Cascading Style Sheets", "Creative Style System", "Computer Style Sheet", "Colorful Style Sheets"], correct: 0 },
    { id: "q2t1", q: "Which HTML tag is used to define an internal style sheet?", options: ["<script>", "<css>", "<style>"], correct: 2 },
    { id: "q3t1", q: "What is the correct CSS syntax for making all <p> elements bold?", options: ["p {font-weight: bold;}", "p {text-style: bold;}", "<p style='font-weight: bold;'>"], correct: 0 }
  ],
  "t2": [ // JavaScript Basics
    { id: "q1t2", q: "Inside which HTML element do we put the JavaScript?", options: ["<scripting>", "<js>", "<javascript>", "<script>"], correct: 3 },
    { id: "q2t2", q: "How do you write 'Hello World' in an alert box?", options: ["alertBox('Hello World');", "msg('Hello World');", "alert('Hello World');", "msgBox('Hello World');"], correct: 2 }
  ],
  "t3": [ // React Core Concepts
    { id: "q1t3", q: "What is JSX?", options: ["JavaScript XML", "JavaScript Syntax Extension", "JavaScript Xylophone", "Both A and B"], correct: 3 },
    { id: "q2t3", q: "Which hook is used to manage state in a functional component?", options: ["useEffect", "useState", "useContext", "useReducer"], correct: 1 }
  ],
  "t4": [ // React Router
    { id: "q1t4", q: "Which component is used to define routes in React Router?", options: ["<Router>", "<Link>", "<Route>", "<Switch> (older versions)"], correct: 2 }
  ],
   "t5": [ // Node.js Fundamentals
    { id: "q1t5", q: "What is Node.js primarily used for?", options: ["Frontend development", "Server-side scripting", "Mobile app development", "Database management"], correct: 1 },
    { id: "q2t5", q: "What is npm?", options: ["Node Project Manager", "Node Package Manager", "New Project Manager", "Network Package Manager"], correct: 1 }
  ],
   "t6": [ // Express.js
    { id: "q1t6", q: "What is Express.js?", options: ["A frontend framework", "A database", "A Node.js web application framework", "A programming language"], correct: 2 },
    { id: "q2t6", q: "What is middleware in Express?", options: ["Functions that handle database logic", "Functions that execute during the request-response cycle", "Functions for frontend rendering", "Functions for error handling only"], correct: 1 }
  ],
  // Add more questions for other topic IDs (t5, t6, etc.)
};

const QUIZ_STORAGE_KEY = 'quizData';

export const getQuizData = () => {
    const storedData = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (storedData) {
        try {
            return JSON.parse(storedData);
        } catch(e) {
            console.error("Failed to parse quiz data, using sample.", e);
            localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(sampleQuizData));
            return sampleQuizData;
        }
    } else {
        localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(sampleQuizData));
        return sampleQuizData;
    }
};

// We don't need a save function if we're only using sample data for now.