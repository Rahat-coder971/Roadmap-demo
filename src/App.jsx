// src/App.jsx
import React, { useState, useEffect } from 'react';
import Milestone from './components/Milestone';
import CircularProgressBar from './components/CircularProgressBar';
import QuizModal from './components/QuizModal';
import {
  getRoadmap,
  saveRoadmap,
  updateTaskInRoadmap,
  isMilestoneComplete, // Keep this one
  getUserRole,
  setUserRole,
  addTaskToTopic,
  deleteTaskFromTopic,
  calculateOverallRoadmapProgress,
  updateMilestoneInRoadmap // *** NEW: Import milestone update function ***
} from './services/roadmapService';
import { sampleRoadmap } from './sampleData';
import './index.css';

function App() {
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(getUserRole());
  const [overallProgress, setOverallProgress] = useState(0);
  const [quizTopicId, setQuizTopicId] = useState(null);

  useEffect(() => {
    const loadedRoadmap = getRoadmap();
    setRoadmap(loadedRoadmap);
    setCurrentRole(getUserRole());
    setOverallProgress(calculateOverallRoadmapProgress(loadedRoadmap));
    setIsLoading(false);
  }, []);

  const handleTriggerQuiz = (topicId) => { /* ... unchanged ... */
    setQuizTopicId(topicId);
  };
  const handleCloseQuiz = () => { /* ... unchanged ... */
    setQuizTopicId(null);
  };
  const handleQuizPassed = () => { /* ... unchanged ... */
    if (!quizTopicId || !roadmap) return;
    let milestoneId = null; let topicIndex = -1; let milestoneIndex = -1;
    for(let mIdx = 0; mIdx < roadmap.milestones.length; mIdx++) {
        const tIdx = roadmap.milestones[mIdx].topics.findIndex(t => t.id === quizTopicId);
        if (tIdx !== -1) { milestoneId = roadmap.milestones[mIdx].id; topicIndex = tIdx; milestoneIndex = mIdx; break; }
    }
    if (milestoneId && topicIndex !== -1) {
        setRoadmap(prevRoadmap => {
            const updatedRoadmap = JSON.parse(JSON.stringify(prevRoadmap));
            updatedRoadmap.milestones[milestoneIndex].topics[topicIndex].tasks.forEach(task => { task.completed = true; });
            saveRoadmap(updatedRoadmap);
            setOverallProgress(calculateOverallRoadmapProgress(updatedRoadmap));
            return updatedRoadmap;
        });
    }
    setQuizTopicId(null);
  };
  const handleUpdateTask = (milestoneId, topicId, taskId, updates) => { /* ... unchanged ... */
    setRoadmap(prevRoadmap => {
        if (!prevRoadmap) return null;
        const updatedRoadmap = updateTaskInRoadmap(prevRoadmap, milestoneId, topicId, taskId, updates);
        saveRoadmap(updatedRoadmap);
        setOverallProgress(calculateOverallRoadmapProgress(updatedRoadmap));
        return updatedRoadmap;
    });
  };
  const handleAddTask = (milestoneId, topicId) => { /* ... unchanged ... */
    setRoadmap(prevRoadmap => {
        if (!prevRoadmap) return null;
        const updatedRoadmap = addTaskToTopic(prevRoadmap, milestoneId, topicId);
        saveRoadmap(updatedRoadmap);
        setOverallProgress(calculateOverallRoadmapProgress(updatedRoadmap));
        return updatedRoadmap;
    });
  };
   const handleDeleteTask = (milestoneId, topicId, taskId) => { /* ... unchanged ... */
    setRoadmap(prevRoadmap => {
        if (!prevRoadmap) return null;
        const updatedRoadmap = deleteTaskFromTopic(prevRoadmap, milestoneId, topicId, taskId);
        saveRoadmap(updatedRoadmap);
        setOverallProgress(calculateOverallRoadmapProgress(updatedRoadmap));
        return updatedRoadmap;
    });
  };
  const handleRoleChange = (event) => { /* ... unchanged ... */
    const newRole = event.target.value;
    setUserRole(newRole);
    setCurrentRole(newRole);
  };
  const handleGenerateRoadmap = () => { /* ... unchanged ... */
      console.log("Simulating roadmap generation...");
      const sample = JSON.parse(JSON.stringify(sampleRoadmap));
      setRoadmap(sample);
      saveRoadmap(sample);
      setOverallProgress(calculateOverallRoadmapProgress(sample));
      alert("Roadmap reset to sample data (Backend API call simulation).");
  }

  // --- *** NEW: Handler for updating milestone data (like score) *** ---
  const handleUpdateMilestone = (milestoneId, updates) => {
    setRoadmap(prevRoadmap => {
        if (!prevRoadmap) return null;
        const updatedRoadmap = updateMilestoneInRoadmap(prevRoadmap, milestoneId, updates);
        saveRoadmap(updatedRoadmap);
        // Note: Overall progress doesn't change when only score is updated
        return updatedRoadmap;
    });
  };
  // --- *** END NEW *** ---


  if (isLoading) return <div className="loading">Loading Roadmap...</div>;
  if (!roadmap) return <div className="error">Could not load roadmap data.</div>;

  const currentQuizTopic = roadmap.milestones.flatMap(m => m.topics).find(t => t.id === quizTopicId);

  // *** Determine which milestones are locked ***
  let firstIncompleteMilestoneFound = false;
  const milestoneStatuses = roadmap.milestones.map(milestone => {
      const complete = isMilestoneComplete(milestone);
      const locked = firstIncompleteMilestoneFound; // Lock if a previous one was incomplete
      if (!complete && !firstIncompleteMilestoneFound) {
          firstIncompleteMilestoneFound = true; // Mark that we found the first incomplete one
      }
      return { id: milestone.id, isComplete: complete, isLocked: locked };
  });
  // *** End Lock Calculation ***

  return (
    <div className="app-container">
      <h1>{roadmap.domain} Learning Roadmap 🗺️</h1>

       <div className="overall-progress-container card">
           <h2>Overall Progress</h2>
           <div className="overall-progress-display">
                <CircularProgressBar percentage={overallProgress} size={80} strokeWidth={8} circleColor="var(--border-color)" progressColor="var(--success-color)" />
           </div>
           <span className="overall-progress-label">Overall</span>
       </div>

      <div className="controls card">
        <div className="controls-left">
            <div className="control-group"> {/* ... domain select ... */}
                <label htmlFor="domain-select">Select Domain: </label>
                <select id="domain-select" defaultValue={roadmap.domain}> <option value="MERN Stack">MERN Stack</option> <option value="Java Backend">Java Backend (Not Implemented)</option> <option value="Data Science">Data Science (Not Implemented)</option> </select>
                <button onClick={handleGenerateRoadmap}> Generate/Reset Roadmap (Demo) </button>
            </div>
            <div className="role-switcher control-group"> {/* ... role switcher ... */}
                 <label htmlFor="role-select">View As: </label>
                <select id="role-select" value={currentRole} onChange={handleRoleChange}> <option value="student">Student</option> <option value="mentor">Mentor</option> </select>
                <span>({currentRole === 'mentor' ? 'Editing Enabled' : 'View Only'})</span>
            </div>
        </div>
      </div>

      <div className="roadmap-timeline">
        {roadmap.milestones.map((milestone) => {
          // Find the status for this milestone
          const status = milestoneStatuses.find(s => s.id === milestone.id) || { isComplete: false, isLocked: true };
          return (
            <Milestone
              key={milestone.id}
              milestone={milestone}
              onUpdateTask={handleUpdateTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onUpdateMilestone={handleUpdateMilestone} // *** Pass milestone update handler ***
              isMilestoneComplete={status.isComplete}
              isLocked={status.isLocked} // *** Pass locked status ***
              role={currentRole}
              onTriggerQuiz={handleTriggerQuiz}
            />
          );
        })}
         <div className="milestone-marker-container end-marker">
             <div className="milestone-marker">🏁</div>
         </div>
      </div>

      {quizTopicId && currentQuizTopic && (
        <QuizModal /* ... unchanged ... */
          topicId={quizTopicId} topicTitle={currentQuizTopic.title}
          onClose={handleCloseQuiz} onQuizPassed={handleQuizPassed}
        />
      )}

    </div>
  );
}

export default App;