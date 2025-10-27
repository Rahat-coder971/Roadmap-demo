// src/services/roadmapService.js
import { sampleRoadmap } from '../sampleData';

const ROADMAP_STORAGE_KEY = 'roadmapData';
const ROLE_STORAGE_KEY = 'userRole';

const generateId = (prefix = 'item') => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

// --- Roadmap Functions ---
export const getRoadmap = () => { /* ... unchanged ... */
  const storedData = localStorage.getItem(ROADMAP_STORAGE_KEY);
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      if (parsedData && parsedData.domain && Array.isArray(parsedData.milestones)) {
         // Ensure milestones have the mentorScore field
         parsedData.milestones = parsedData.milestones.map(m => ({
             ...m,
             mentorScore: m.mentorScore === undefined ? null : m.mentorScore
         }));
         return parsedData;
      } else {
        console.warn("Stored data is not a valid roadmap structure. Resetting to sample.");
        localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(sampleRoadmap));
        return sampleRoadmap;
      }
    } catch (error) {
      console.error("Error parsing roadmap from local storage:", error);
      localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(sampleRoadmap));
      return sampleRoadmap;
    }
  } else {
    localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(sampleRoadmap));
    return sampleRoadmap;
  }
};

export const saveRoadmap = (roadmap) => { /* ... unchanged ... */
  try {
    localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(roadmap));
  } catch (error) {
    console.error("Error saving roadmap to local storage:", error);
    alert("Could not save changes to local storage. Data might be too large or storage is full.");
  }
};

// --- Find Indices Helper (modified slightly) ---
const findIndices = (roadmap, milestoneId, topicId = null, taskId = null) => {
  if (!roadmap || !roadmap.milestones) return { milestoneIndex: -1 };
  const milestoneIndex = roadmap.milestones.findIndex(m => m.id === milestoneId);
  if (milestoneIndex === -1) return { milestoneIndex: -1 }; // Milestone check only needed sometimes
  if (topicId === null) return { milestoneIndex }; // Return just milestone index if no topicId provided

  const topicIndex = roadmap.milestones[milestoneIndex].topics.findIndex(t => t.id === topicId);
  if (topicIndex === -1 || taskId === null) return { milestoneIndex, topicIndex }; // Return milestone & topic index

  const taskIndex = roadmap.milestones[milestoneIndex].topics[topicIndex].tasks.findIndex(task => task.id === taskId);
  return { milestoneIndex, topicIndex, taskIndex }; // Return all indices
};


// --- Update Task ---
export const updateTaskInRoadmap = (roadmap, milestoneId, topicId, taskId, updates) => { /* ... unchanged ... */
  const newRoadmap = JSON.parse(JSON.stringify(roadmap));
  const { milestoneIndex, topicIndex, taskIndex } = findIndices(newRoadmap, milestoneId, topicId, taskId);
  if (taskIndex === -1) return roadmap;
  newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks[taskIndex] = {
    ...newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks[taskIndex],
    ...updates,
  };
  return newRoadmap;
};

// --- *** NEW: Update Milestone (for score) *** ---
export const updateMilestoneInRoadmap = (roadmap, milestoneId, updates) => {
    const newRoadmap = JSON.parse(JSON.stringify(roadmap));
    const { milestoneIndex } = findIndices(newRoadmap, milestoneId);

    if (milestoneIndex === -1) return roadmap; // Milestone not found

    newRoadmap.milestones[milestoneIndex] = {
      ...newRoadmap.milestones[milestoneIndex],
      ...updates, // e.g., { mentorScore: 85 }
    };
    return newRoadmap;
};
// --- *** END NEW *** ---

// --- Add Task ---
export const addTaskToTopic = (roadmap, milestoneId, topicId) => { /* ... unchanged ... */
    const newRoadmap = JSON.parse(JSON.stringify(roadmap));
    const { milestoneIndex, topicIndex } = findIndices(newRoadmap, milestoneId, topicId);
    if (topicIndex === -1) return roadmap;
    const newTask = { id: generateId('task'), description: "New Task - Edit Me", completed: false, mentorNotes: "" };
    if (!newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks) {
        newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks = [];
    }
    newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks.push(newTask);
    return newRoadmap;
};

// --- Delete Task ---
export const deleteTaskFromTopic = (roadmap, milestoneId, topicId, taskId) => { /* ... unchanged ... */
    const newRoadmap = JSON.parse(JSON.stringify(roadmap));
    const { milestoneIndex, topicIndex } = findIndices(newRoadmap, milestoneId, topicId);
     if (topicIndex === -1 || !newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks) return roadmap;
     const taskIndex = newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks.findIndex(task => task.id === taskId);
     if (taskIndex === -1) return roadmap;
     newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks =
        newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks.filter(task => task.id !== taskId);
     return newRoadmap;
};

// --- Check Topic Completion (NEW HELPER) ---
export const isTopicComplete = (topic) => {
    if (!topic || !topic.tasks || topic.tasks.length === 0) return true; // Empty topic is considered complete
    return topic.tasks.every(task => task.completed);
};


// --- Check Milestone Completion ---
export const isMilestoneComplete = (milestone) => { /* ... unchanged ... */
  if (!milestone || !milestone.topics) return false;
  return milestone.topics.every(topic =>
    isTopicComplete(topic) // Use helper here
  );
};

// --- Calculate Progress ---
export const calculateProgress = (items) => { /* ... unchanged ... */
    let totalTasks = 0;
    let completedTasks = 0;
    if (!items || items.length === 0) return 0;
    if (items[0] && items[0].tasks !== undefined) { // Topics
        items.forEach(topic => {
            if (topic.tasks && topic.tasks.length > 0) {
                totalTasks += topic.tasks.length;
                completedTasks += topic.tasks.filter(task => task.completed).length;
            }
        });
    } else if (items[0] && items[0].description !== undefined){ // Tasks
        totalTasks = items.length;
        completedTasks = items.filter(task => task.completed).length;
    }
    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
};

// --- Calculate Overall Roadmap Progress ---
export const calculateOverallRoadmapProgress = (roadmap) => { /* ... unchanged ... */
    let totalTasks = 0;
    let completedTasks = 0;
    if (!roadmap || !roadmap.milestones) return 0;
    roadmap.milestones.forEach(milestone => {
        if (milestone.topics) {
            milestone.topics.forEach(topic => {
                if (topic.tasks && topic.tasks.length > 0) {
                    totalTasks += topic.tasks.length;
                    completedTasks += topic.tasks.filter(task => task.completed).length;
                }
            });
        }
    });
    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
};

// --- Role Functions ---
export const getUserRole = () => { /* ... unchanged ... */
  return localStorage.getItem(ROLE_STORAGE_KEY) || 'student';
};
export const setUserRole = (role) => { /* ... unchanged ... */
  if (role === 'student' || role === 'mentor') {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  } else { console.error("Invalid role specified:", role); }
};