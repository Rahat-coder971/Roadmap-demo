// src/App.jsx
import React, { useState, useEffect } from 'react';
import Milestone from './components/Milestone';
import CircularProgressBar from './components/CircularProgressBar';
import QuizModal from './components/QuizModal';
import {
  getRoadmap, saveRoadmap, updateTaskInRoadmap, isMilestoneComplete, getUserRole,
  setUserRole, addTaskToTopic, deleteTaskFromTopic, calculateOverallRoadmapProgress,
  updateMilestoneInRoadmap, addTopicToMilestone, deleteTopicFromMilestone,
  addResourceToTask, // *** NEW: Import resource functions ***
  updateResourceInTask,
  deleteResourceFromTask
} from './services/roadmapService';
import { sampleRoadmap } from './sampleData';
import './index.css';

function App() {
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(getUserRole());
  const [overallProgress, setOverallProgress] = useState(0);
  const [quizTopicId, setQuizTopicId] = useState(null);

  useEffect(() => { /* ... unchanged ... */ const loadedRoadmap = getRoadmap(); setRoadmap(loadedRoadmap); setCurrentRole(getUserRole()); setOverallProgress(calculateOverallRoadmapProgress(loadedRoadmap)); setIsLoading(false); }, []);

  // --- Handlers ---
  const handleTriggerQuiz = (topicId) => { setQuizTopicId(topicId); };
  const handleCloseQuiz = () => { setQuizTopicId(null); };
  const handleQuizPassed = () => { /* ... unchanged ... */ if (!quizTopicId || !roadmap) return; let milestoneId = null; let topicIndex = -1; let milestoneIndex = -1; for(let mIdx = 0; mIdx < roadmap.milestones.length; mIdx++) { const tIdx = roadmap.milestones[mIdx].topics.findIndex(t => t.id === quizTopicId); if (tIdx !== -1) { milestoneId = roadmap.milestones[mIdx].id; topicIndex = tIdx; milestoneIndex = mIdx; break; } } if (milestoneId && topicIndex !== -1) { setRoadmap(prevRoadmap => { const updatedRoadmap = JSON.parse(JSON.stringify(prevRoadmap)); updatedRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks.forEach(task => { task.completed = true; }); saveRoadmap(updatedRoadmap); setOverallProgress(calculateOverallRoadmapProgress(updatedRoadmap)); return updatedRoadmap; }); } setQuizTopicId(null); };
  const handleUpdateTask = (milestoneId, topicId, taskId, updates) => { /* ... unchanged ... */ setRoadmap(prevRoadmap => { if (!prevRoadmap) return null; const updatedRoadmap = updateTaskInRoadmap(prevRoadmap, milestoneId, topicId, taskId, updates); saveRoadmap(updatedRoadmap); setOverallProgress(calculateOverallRoadmapProgress(updatedRoadmap)); return updatedRoadmap; }); };
  const handleAddTask = (milestoneId, topicId) => { /* ... unchanged ... */ setRoadmap(prevRoadmap => { if (!prevRoadmap) return null; const updatedRoadmap = addTaskToTopic(prevRoadmap, milestoneId, topicId); saveRoadmap(updatedRoadmap); setOverallProgress(calculateOverallRoadmapProgress(updatedRoadmap)); return updatedRoadmap; }); };
  const handleDeleteTask = (milestoneId, topicId, taskId) => { /* ... unchanged ... */ setRoadmap(prevRoadmap => { if (!prevRoadmap) return null; const updatedRoadmap = deleteTaskFromTopic(prevRoadmap, milestoneId, topicId, taskId); saveRoadmap(updatedRoadmap); setOverallProgress(calculateOverallRoadmapProgress(updatedRoadmap)); return updatedRoadmap; }); };
  const handleUpdateMilestone = (milestoneId, updates) => { /* ... unchanged ... */ setRoadmap(prevRoadmap => { if (!prevRoadmap) return null; const updatedRoadmap = updateMilestoneInRoadmap(prevRoadmap, milestoneId, updates); saveRoadmap(updatedRoadmap); return updatedRoadmap; }); };
  const handleAddTopic = (milestoneId) => { /* ... unchanged ... */ setRoadmap(prevRoadmap => { if (!prevRoadmap) return null; const updatedRoadmap = addTopicToMilestone(prevRoadmap, milestoneId); saveRoadmap(updatedRoadmap); return updatedRoadmap; }); };
  const handleDeleteTopic = (milestoneId, topicId) => { /* ... unchanged ... */ setRoadmap(prevRoadmap => { if (!prevRoadmap) return null; const updatedRoadmap = deleteTopicFromMilestone(prevRoadmap, milestoneId, topicId); saveRoadmap(updatedRoadmap); setOverallProgress(calculateOverallRoadmapProgress(updatedRoadmap)); return updatedRoadmap; }); };
  const handleRoleChange = (event) => { /* ... unchanged ... */ const newRole = event.target.value; setUserRole(newRole); setCurrentRole(newRole); };
  const handleGenerateRoadmap = () => { /* ... unchanged ... */ console.log("Simulating roadmap generation..."); const sample = JSON.parse(JSON.stringify(sampleRoadmap)); setRoadmap(sample); saveRoadmap(sample); setOverallProgress(calculateOverallRoadmapProgress(sample)); alert("Roadmap reset."); }

  // --- *** NEW: Resource Handlers *** ---
   const handleAddResource = (milestoneId, topicId, taskId, title, url) => {
        setRoadmap(prevRoadmap => {
            if (!prevRoadmap) return null;
            const updatedRoadmap = addResourceToTask(prevRoadmap, milestoneId, topicId, taskId, title, url);
            saveRoadmap(updatedRoadmap);
            return updatedRoadmap;
        });
    };
    const handleUpdateResource = (milestoneId, topicId, taskId, resourceId, updates) => {
        setRoadmap(prevRoadmap => {
            if (!prevRoadmap) return null;
            const updatedRoadmap = updateResourceInTask(prevRoadmap, milestoneId, topicId, taskId, resourceId, updates);
            saveRoadmap(updatedRoadmap);
            return updatedRoadmap;
        });
    };
    const handleDeleteResource = (milestoneId, topicId, taskId, resourceId) => {
        setRoadmap(prevRoadmap => {
            if (!prevRoadmap) return null;
            const updatedRoadmap = deleteResourceFromTask(prevRoadmap, milestoneId, topicId, taskId, resourceId);
            saveRoadmap(updatedRoadmap);
            return updatedRoadmap;
        });
    };
  // --- *** END NEW *** ---


  if (isLoading) return <div className="loading">Loading Roadmap...</div>;
  if (!roadmap) return <div className="error">Could not load roadmap data.</div>;

  const currentQuizTopic = roadmap.milestones.flatMap(m => m.topics).find(t => t.id === quizTopicId);

  // Milestone Locking Logic (Unchanged)
  let firstIncompleteMilestoneFound = false;
  const milestoneStatuses = roadmap.milestones.map((milestone, index, milestones) => { /* ... unchanged ... */ const isCurrentComplete = isMilestoneComplete(milestone); let isLocked = false; let lockReason = ""; let previousMilestoneScore = null; if (index > 0) { const prevMilestone = milestones[index - 1]; const isPrevComplete = isMilestoneComplete(prevMilestone); previousMilestoneScore = prevMilestone.mentorScore; if (!isPrevComplete) { isLocked = true; lockReason = "Complete previous milestone tasks."; } else if (prevMilestone.mentorScore === null || prevMilestone.mentorScore < 70) { isLocked = true; lockReason = `Awaiting passing mentor score (>= 70) for previous milestone. Current: ${prevMilestone.mentorScore ?? 'Not set'}`; } } return { id: milestone.id, isComplete: isCurrentComplete, isLocked: isLocked, lockReason: lockReason, previousMilestoneScore: previousMilestoneScore }; });

  return (
    <div className="app-container">
      <h1>{roadmap.domain} Learning Roadmap 🗺️</h1>
      <div className="overall-progress-container card"> {/* ... content unchanged ... */} <h2>Overall Progress</h2> <div className="overall-progress-display"> <CircularProgressBar percentage={overallProgress} size={80} strokeWidth={8} circleColor="var(--border-color)" progressColor="var(--success-color)" /> </div> <span className="overall-progress-label">Overall</span> </div>
      <div className="controls card"> {/* ... content unchanged ... */} <div className="controls-left"> <div className="control-group"> <label htmlFor="domain-select">Select Domain: </label> <select id="domain-select" defaultValue={roadmap.domain}> <option value="MERN Stack">MERN Stack</option> <option value="Java Backend">Java Backend (Not Implemented)</option> <option value="Data Science">Data Science (Not Implemented)</option> </select> <button onClick={handleGenerateRoadmap}> Generate/Reset Roadmap (Demo) </button> </div> <div className="role-switcher control-group"> <label htmlFor="role-select">View As: </label> <select id="role-select" value={currentRole} onChange={handleRoleChange}> <option value="student">Student</option> <option value="mentor">Mentor</option> </select> <span>({currentRole === 'mentor' ? 'Editing Enabled' : 'View Only'})</span> </div> </div> </div>

      <div className="roadmap-timeline">
        {roadmap.milestones.map((milestone) => {
          const status = milestoneStatuses.find(s => s.id === milestone.id) || { isComplete: false, isLocked: true, lockReason: "Error", previousMilestoneScore: null };
          return (
            <Milestone
              key={milestone.id} milestone={milestone} role={currentRole}
              isMilestoneComplete={status.isComplete} isLocked={status.isLocked} lockReason={status.lockReason}
              onUpdateTask={handleUpdateTask} onAddTask={handleAddTask} onDeleteTask={handleDeleteTask}
              onUpdateMilestone={handleUpdateMilestone} onAddTopic={handleAddTopic} onDeleteTopic={handleDeleteTopic}
              onTriggerQuiz={handleTriggerQuiz}
              onAddResource={handleAddResource} // *** Pass resource handlers down ***
              onUpdateResource={handleUpdateResource}
              onDeleteResource={handleDeleteResource}
            />
          );
        })}
         <div className="milestone-marker-container end-marker"> <div className="milestone-marker">🏁</div> </div>
      </div>

      {quizTopicId && currentQuizTopic && ( <QuizModal topicId={quizTopicId} topicTitle={currentQuizTopic.title} onClose={handleCloseQuiz} onQuizPassed={handleQuizPassed} /> )}
    </div>
  );
}
export default App;