// src/components/Milestone.jsx
import React, { useState, useEffect } from 'react';
import Topic from './Topic';
import ProgressBar from './ProgressBar';
import { calculateProgress, isTopicComplete } from '../services/roadmapService';
import { FaCalendarCheck, FaSave, FaInfoCircle, FaPlusCircle } from 'react-icons/fa';

// *** UPDATED: Added resource handlers ***
function Milestone({
    milestone, role, isLocked, isMilestoneComplete, lockReason,
    onUpdateTask, onAddTask, onDeleteTask, onUpdateMilestone, onAddTopic, onDeleteTopic, onTriggerQuiz,
    onAddResource, onUpdateResource, onDeleteResource // New resource handlers
}) {
    const [mentorScoreValue, setMentorScoreValue] = useState(milestone.mentorScore ?? '');
    useEffect(() => { setMentorScoreValue(milestone.mentorScore ?? ''); }, [milestone.mentorScore]);
    const milestoneProgress = calculateProgress(milestone.topics);
    const handleScheduleTestClick = () => { alert(`Live Test Scheduling for "${milestone.title}" - Backend functionality to be implemented.`); }
    const handleSaveScore = () => { if (role !== 'mentor') return; const score = parseInt(mentorScoreValue, 10); if (!isNaN(score) && score >= 0 && score <= 100) { onUpdateMilestone(milestone.id, { mentorScore: score }); } else if (mentorScoreValue === '') { onUpdateMilestone(milestone.id, { mentorScore: null }); } else { alert("Please enter valid score 0-100."); } }
    const handleAddTopicClick = () => { if (role === 'mentor' && !isLocked) onAddTopic(milestone.id); }

    return (
        <div className={`milestone ${isLocked ? 'locked' : ''}`}>
            <div className="milestone-marker-container"> <div className={`milestone-marker ${isMilestoneComplete ? 'complete' : ''}`}> {isLocked ? '🔒' : (isMilestoneComplete ? '🎉' : '📍')} </div> <div className={`milestone-line ${isMilestoneComplete ? 'line-complete' : ''}`}></div> </div>
            <div className="milestone-details card">
                {isLocked && ( <div className="locked-overlay"> <FaInfoCircle /> {lockReason} </div> )}
                <div className="milestone-header"> <h3>{milestone.title} {isMilestoneComplete ? '(Complete!)' : ''}</h3> <div className="milestone-progress"> <ProgressBar percentage={milestoneProgress} /> </div> </div>

                {(milestone.topics || []).map((topic, index, topics) => {
                    const isPrevTopicComplete = index === 0 ? true : isTopicComplete(topics[index - 1]);
                    const topicLockedStatus = isLocked || !isPrevTopicComplete;
                    return (
                        <Topic
                            key={topic.id} topic={topic} milestoneId={milestone.id} role={role} isLocked={topicLockedStatus}
                            onUpdateTask={onUpdateTask} onAddTask={onAddTask} onDeleteTask={onDeleteTask}
                            onTriggerQuiz={onTriggerQuiz} onDeleteTopic={onDeleteTopic}
                            onAddResource={onAddResource} // Pass down
                            onUpdateResource={onUpdateResource} // Pass down
                            onDeleteResource={onDeleteResource} // Pass down
                        />
                    );
                })}

                {role === 'mentor' && !isLocked && ( <button onClick={handleAddTopicClick} className="add-item-btn add-topic-btn"> <FaPlusCircle /> Add Topic </button> )}
                {isMilestoneComplete && role === 'mentor' && ( <div className="mentor-score-input"> <label htmlFor={`score-${milestone.id}`}>Milestone Score (0-100): </label> <input type="number" id={`score-${milestone.id}`} min="0" max="100" value={mentorScoreValue} onChange={(e) => setMentorScoreValue(e.target.value)} onBlur={handleSaveScore} placeholder="Enter score" /> <button onClick={handleSaveScore} className="icon-btn save-score-btn" title="Save Score"><FaSave /></button> {milestone.mentorScore !== null && <span className="saved-score">Saved: {milestone.mentorScore}</span>} </div> )}
                {isMilestoneComplete && role === 'student' && ( <div className="milestone-actions"> <button onClick={handleScheduleTestClick} className="schedule-test-btn"> <FaCalendarCheck /> Schedule Live Test </button> </div> )}
            </div>
        </div>
    );
}
export default Milestone;