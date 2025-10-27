// src/services/roadmapService.js
import { sampleRoadmap } from '../sampleData';

const ROADMAP_STORAGE_KEY = 'roadmapData';
const ROLE_STORAGE_KEY = 'userRole';

const generateId = (prefix = 'item') => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

// --- Roadmap Functions (getRoadmap, saveRoadmap) ---
export const getRoadmap = () => { /* ... unchanged ... */
  const storedData = localStorage.getItem(ROADMAP_STORAGE_KEY);
  if (storedData) { try { const parsedData = JSON.parse(storedData); if (parsedData && parsedData.domain && Array.isArray(parsedData.milestones)) {
         // Ensure milestones and tasks have necessary fields
         parsedData.milestones = parsedData.milestones.map(m => ({ ...m, mentorScore: m.mentorScore ?? null, topics: (m.topics || []).map(t => ({...t, tasks: (t.tasks || []).map(task => ({ ...task, resources: task.resources || [] })) })) }));
         return parsedData;
      } else { console.warn("Stored data invalid. Resetting."); localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(sampleRoadmap)); return sampleRoadmap; } } catch (error) { console.error("Error parsing roadmap:", error); localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(sampleRoadmap)); return sampleRoadmap; } } else { localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(sampleRoadmap)); return sampleRoadmap; }
};
export const saveRoadmap = (roadmap) => { /* ... unchanged ... */
  try { localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(roadmap)); } catch (error) { console.error("Error saving roadmap:", error); alert("Could not save changes."); }
};


// --- Find Indices Helper ---
const findIndices = (roadmap, milestoneId, topicId = null, taskId = null) => { /* ... unchanged ... */
  if (!roadmap || !roadmap.milestones) return { milestoneIndex: -1 }; const milestoneIndex = roadmap.milestones.findIndex(m => m.id === milestoneId); if (milestoneIndex === -1) return { milestoneIndex: -1 }; if (topicId === null) return { milestoneIndex }; const topicIndex = roadmap.milestones[milestoneIndex].topics.findIndex(t => t.id === topicId); if (topicIndex === -1 || taskId === null) return { milestoneIndex, topicIndex }; const taskIndex = roadmap.milestones[milestoneIndex].topics[topicIndex].tasks.findIndex(task => task.id === taskId); return { milestoneIndex, topicIndex, taskIndex };
};

// --- Update Task ---
export const updateTaskInRoadmap = (roadmap, milestoneId, topicId, taskId, updates) => { /* ... unchanged ... */
  const newRoadmap = JSON.parse(JSON.stringify(roadmap)); const { milestoneIndex, topicIndex, taskIndex } = findIndices(newRoadmap, milestoneId, topicId, taskId); if (taskIndex === -1) return roadmap; newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks[taskIndex] = { ...newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks[taskIndex], ...updates, }; return newRoadmap;
};

// --- Update Milestone ---
export const updateMilestoneInRoadmap = (roadmap, milestoneId, updates) => { /* ... unchanged ... */
    const newRoadmap = JSON.parse(JSON.stringify(roadmap)); const { milestoneIndex } = findIndices(newRoadmap, milestoneId); if (milestoneIndex === -1) return roadmap; newRoadmap.milestones[milestoneIndex] = { ...newRoadmap.milestones[milestoneIndex], ...updates, }; return newRoadmap;
};

// --- Add Task ---
export const addTaskToTopic = (roadmap, milestoneId, topicId) => { /* ... unchanged, but ensure new task has resources: [] ... */
    const newRoadmap = JSON.parse(JSON.stringify(roadmap)); const { milestoneIndex, topicIndex } = findIndices(newRoadmap, milestoneId, topicId); if (topicIndex === -1) return roadmap; const newTask = { id: generateId('task'), description: "New Task - Edit Me", completed: false, mentorNotes: "", resources: [] }; if (!newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks) { newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks = []; } newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks.push(newTask); return newRoadmap;
};

// --- Delete Task ---
export const deleteTaskFromTopic = (roadmap, milestoneId, topicId, taskId) => { /* ... unchanged ... */
    const newRoadmap = JSON.parse(JSON.stringify(roadmap)); const { milestoneIndex, topicIndex } = findIndices(newRoadmap, milestoneId, topicId); if (topicIndex === -1 || !newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks) return roadmap; const taskIndex = newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks.findIndex(task => task.id === taskId); if (taskIndex === -1) return roadmap; newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks = newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks.filter(task => task.id !== taskId); return newRoadmap;
};

// --- Add Topic ---
export const addTopicToMilestone = (roadmap, milestoneId) => { /* ... unchanged ... */
    const newRoadmap = JSON.parse(JSON.stringify(roadmap)); const { milestoneIndex } = findIndices(newRoadmap, milestoneId); if (milestoneIndex === -1) return roadmap; const newTopic = { id: generateId('topic'), title: "New Topic - Edit Me", tasks: [] }; if (!newRoadmap.milestones[milestoneIndex].topics) { newRoadmap.milestones[milestoneIndex].topics = []; } newRoadmap.milestones[milestoneIndex].topics.push(newTopic); return newRoadmap;
};

// --- Delete Topic ---
export const deleteTopicFromMilestone = (roadmap, milestoneId, topicId) => { /* ... unchanged ... */
     const newRoadmap = JSON.parse(JSON.stringify(roadmap)); const { milestoneIndex, topicIndex } = findIndices(newRoadmap, milestoneId, topicId); if (topicIndex === -1) return roadmap; newRoadmap.milestones[milestoneIndex].topics = newRoadmap.milestones[milestoneIndex].topics.filter(topic => topic.id !== topicId); return newRoadmap;
};

// --- *** NEW: Resource Functions *** ---
export const addResourceToTask = (roadmap, milestoneId, topicId, taskId, resourceTitle, resourceUrl) => {
    const newRoadmap = JSON.parse(JSON.stringify(roadmap));
    const { milestoneIndex, topicIndex, taskIndex } = findIndices(newRoadmap, milestoneId, topicId, taskId);

    if (taskIndex === -1) return roadmap; // Task not found

    const newResource = {
        id: generateId('resource'),
        title: resourceTitle || "New Resource",
        url: resourceUrl || ""
    };

    // Ensure resources array exists
    if (!newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks[taskIndex].resources) {
        newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks[taskIndex].resources = [];
    }
    newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks[taskIndex].resources.push(newResource);
    return newRoadmap;
};

export const updateResourceInTask = (roadmap, milestoneId, topicId, taskId, resourceId, updates) => {
    const newRoadmap = JSON.parse(JSON.stringify(roadmap));
    const { milestoneIndex, topicIndex, taskIndex } = findIndices(newRoadmap, milestoneId, topicId, taskId);

    if (taskIndex === -1 || !newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks[taskIndex].resources) return roadmap;

    const resourceIndex = newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks[taskIndex].resources.findIndex(res => res.id === resourceId);

    if (resourceIndex === -1) return roadmap; // Resource not found

    newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks[taskIndex].resources[resourceIndex] = {
        ...newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks[taskIndex].resources[resourceIndex],
        ...updates
    };
    return newRoadmap;
};

export const deleteResourceFromTask = (roadmap, milestoneId, topicId, taskId, resourceId) => {
    const newRoadmap = JSON.parse(JSON.stringify(roadmap));
    const { milestoneIndex, topicIndex, taskIndex } = findIndices(newRoadmap, milestoneId, topicId, taskId);

    if (taskIndex === -1 || !newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks[taskIndex].resources) return roadmap;

    newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks[taskIndex].resources =
        newRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks[taskIndex].resources.filter(res => res.id !== resourceId);

    return newRoadmap;
};
// --- *** END NEW *** ---


// --- Check Completion & Progress (Unchanged) ---
export const isTopicComplete = (topic) => { /* ... */ if (!topic || !topic.tasks || topic.tasks.length === 0) return true; return topic.tasks.every(task => task.completed); };
export const isMilestoneComplete = (milestone) => { /* ... */ if (!milestone || !milestone.topics) return false; return milestone.topics.every(topic => isTopicComplete(topic)); };
export const calculateProgress = (items) => { /* ... */ let totalTasks = 0; let completedTasks = 0; if (!items || items.length === 0) return 0; if (items[0] && items[0].tasks !== undefined) { items.forEach(topic => { if (topic.tasks && topic.tasks.length > 0) { totalTasks += topic.tasks.length; completedTasks += topic.tasks.filter(task => task.completed).length; } }); } else if (items[0] && items[0].description !== undefined){ totalTasks = items.length; completedTasks = items.filter(task => task.completed).length; } return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100; };
export const calculateOverallRoadmapProgress = (roadmap) => { /* ... */ let totalTasks = 0; let completedTasks = 0; if (!roadmap || !roadmap.milestones) return 0; roadmap.milestones.forEach(milestone => { if (milestone.topics) { milestone.topics.forEach(topic => { if (topic.tasks && topic.tasks.length > 0) { totalTasks += topic.tasks.length; completedTasks += topic.tasks.filter(task => task.completed).length; } }); } }); return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100; };

// --- Role Functions (Unchanged) ---
export const getUserRole = () => { /* ... */ return localStorage.getItem(ROLE_STORAGE_KEY) || 'student'; };
export const setUserRole = (role) => { /* ... */ if (role === 'student' || role === 'mentor') { localStorage.setItem(ROLE_STORAGE_KEY, role); } else { console.error("Invalid role specified:", role); } };