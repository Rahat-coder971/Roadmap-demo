// src/components/Topic.jsx
import React, { useState } from 'react';
import TaskItem from './TaskItem';
import ProgressBar from './ProgressBar';
import { isTopicComplete, calculateProgress } from '../services/roadmapService'; // Import topic completion check
import { FaChevronDown, FaChevronRight, FaPlusCircle, FaLock } from 'react-icons/fa'; // Added FaLock

// *** UPDATED: Added isLocked prop ***
function Topic({ topic, milestoneId, onUpdateTask, onAddTask, onDeleteTask, role, onTriggerQuiz, isLocked }) {
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed

  const progress = calculateProgress(topic.tasks);
  const complete = isTopicComplete(topic); // Use helper

  const toggleCollapse = () => {
    // Prevent toggling if the topic is locked (unless it's already complete)
    if (isLocked && !complete) return;
    setIsCollapsed(!isCollapsed);
  };

  const handleAddTask = (e) => { /* ... unchanged ... */
      e.stopPropagation();
      if (role === 'mentor') onAddTask(milestoneId, topic.id);
  }

  return (
    // *** UPDATED: Add 'locked' class ***
    <div className={`topic-container ${isLocked && !complete ? 'locked' : ''}`}>
      <div className="topic-header" onClick={toggleCollapse} title={isLocked && !complete ? "Complete previous topic first" : `Click to ${isCollapsed ? 'expand' : 'collapse'}`}>
        <span className="collapse-icon">
          {/* Show lock instead of chevron if locked */}
          {isLocked && !complete ? <FaLock /> : (isCollapsed ? <FaChevronRight /> : <FaChevronDown />)}
        </span>
        <h4>{topic.title}</h4>
        <div className="topic-progress">
             <ProgressBar percentage={progress} />
        </div>
      </div>

      {/* Conditionally render task list based on collapse state AND locked status */}
      {!isCollapsed && (!isLocked || complete) && ( // Only show if not collapsed AND (not locked OR already complete)
        <>
            <ul className="task-list">
            {(topic.tasks || []).map((task, index, arr) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    milestoneId={milestoneId}
                    topicId={topic.id}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                    role={role}
                    isLastTask={index === arr.length - 1}
                    isTopicComplete={complete}
                    onTriggerQuiz={onTriggerQuiz}
                    isTopicLocked={isLocked && !complete} // Pass locked status to task
                />
            ))}
            </ul>
            {role === 'mentor' && (
                <button onClick={handleAddTask} className="add-item-btn add-task-btn">
                    <FaPlusCircle /> Add Task
                </button>
            )}
        </>
      )}
    </div>
  );
}

export default Topic;