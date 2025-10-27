// src/components/Milestone.jsx
import React, { useState, useEffect } from 'react';
import Topic from './Topic';
import ProgressBar from './ProgressBar';
import { calculateProgress, isTopicComplete } from '../services/roadmapService';
import { FaCalendarCheck, FaSave } from 'react-icons/fa';

// *** UPDATED: Added isLocked, onUpdateMilestone props ***
function Milestone({ milestone, onUpdateTask, onAddTask, onDeleteTask, isMilestoneComplete, role, onTriggerQuiz, isLocked, onUpdateMilestone }) {
    const [mentorScoreValue, setMentorScoreValue] = useState(milestone.mentorScore ?? ''); // Local state for input

    // Update local state if prop changes (e.g., after saving)
    useEffect(() => {
        setMentorScoreValue(milestone.mentorScore ?? '');
    }, [milestone.mentorScore]);


    const milestoneProgress = calculateProgress(milestone.topics);

    const handleScheduleTestClick = () => { /* ... unchanged ... */
        alert(`Live Test Scheduling for "${milestone.title}" - Backend functionality to be implemented.`);
    }

    // *** NEW: Handler for saving mentor score ***
    const handleSaveScore = () => {
        if (role !== 'mentor') return;
        const score = parseInt(mentorScoreValue, 10);
        // Basic validation
        if (!isNaN(score) && score >= 0 && score <= 100) {
            onUpdateMilestone(milestone.id, { mentorScore: score });
        } else if (mentorScoreValue === '') {
             onUpdateMilestone(milestone.id, { mentorScore: null }); // Allow clearing score
        }
        else {
            alert("Please enter a valid score between 0 and 100.");
        }
    }


    return (
        // *** UPDATED: Add 'locked' class to milestone div ***
        <div className={`milestone ${isLocked ? 'locked' : ''}`}>
            <div className="milestone-marker-container">
                <div className={`milestone-marker ${isMilestoneComplete ? 'complete' : ''}`}>
                   {/* Show lock on marker if milestone is locked */}
                   {isLocked ? '🔒' : (isMilestoneComplete ? '🎉' : '📍')}
                </div>
                {/* Line completion depends on current milestone being complete */}
                <div className={`milestone-line ${isMilestoneComplete ? 'line-complete' : ''}`}></div>
            </div>

            <div className="milestone-details card">
                <div className="milestone-header">
                     <h3>{milestone.title} {isMilestoneComplete ? '(Complete!)' : ''}</h3>
                     <div className="milestone-progress">
                        <ProgressBar percentage={milestoneProgress} />
                     </div>
                </div>

                {milestone.topics.map((topic, index, topics) => {
                    // *** Determine if the *previous* topic is complete ***
                    const isPrevTopicComplete = index === 0 ? true : isTopicComplete(topics[index - 1]);
                    // *** Topic is locked if the milestone is locked OR the previous topic isn't complete ***
                    const topicLockedStatus = isLocked || !isPrevTopicComplete;

                    return (
                        <Topic
                            key={topic.id}
                            topic={topic}
                            milestoneId={milestone.id}
                            onUpdateTask={onUpdateTask}
                            onAddTask={onAddTask}
                            onDeleteTask={onDeleteTask}
                            role={role}
                            onTriggerQuiz={onTriggerQuiz}
                            isLocked={topicLockedStatus} // Pass locked status down
                        />
                    );
                })}

                {/* --- Mentor Score Input (Show if complete & mentor) --- */}
                {isMilestoneComplete && role === 'mentor' && (
                    <div className="mentor-score-input">
                        <label htmlFor={`score-${milestone.id}`}>Milestone Score (0-100): </label>
                        <input
                            type="number"
                            id={`score-${milestone.id}`}
                            min="0"
                            max="100"
                            value={mentorScoreValue}
                            onChange={(e) => setMentorScoreValue(e.target.value)}
                            onBlur={handleSaveScore} // Save on blur
                            placeholder="Enter score"
                        />
                         <button onClick={handleSaveScore} className="icon-btn save-score-btn" title="Save Score"><FaSave /></button>
                         {milestone.mentorScore !== null && <span className="saved-score">Saved: {milestone.mentorScore}</span>}
                    </div>
                )}

                {/* Show Schedule button if complete & student */}
                {isMilestoneComplete && role === 'student' && (
                    <div className="milestone-actions">
                         <button onClick={handleScheduleTestClick} className="schedule-test-btn">
                             <FaCalendarCheck /> Schedule Live Test
                         </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Milestone;