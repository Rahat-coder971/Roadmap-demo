// src/components/Topic.jsx
import React, { useState } from 'react';
import TaskItem from './TaskItem';
import ProgressBar from './ProgressBar';
import { isTopicComplete, calculateProgress } from '../services/roadmapService';
import { FaChevronDown, FaChevronRight, FaPlusCircle, FaLock, FaTrashAlt } from 'react-icons/fa';

// *** UPDATED: Added resource handlers ***
function Topic({ topic, milestoneId, role, isLocked, onUpdateTask, onAddTask, onDeleteTask, onTriggerQuiz, onDeleteTopic, onAddResource, onUpdateResource, onDeleteResource }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const progress = calculateProgress(topic.tasks);
  const complete = isTopicComplete(topic);
  const toggleCollapse = () => { if (isLocked && !complete) return; setIsCollapsed(!isCollapsed); };
  const handleAddTask = (e) => { e.stopPropagation(); if (role === 'mentor' && !isLocked) onAddTask(milestoneId, topic.id); }
  const handleDelete = (e) => { e.stopPropagation(); if (role === 'mentor' && !isLocked && window.confirm(`Delete topic "${topic.title}"?`)) { onDeleteTopic(milestoneId, topic.id); } }

  return (
    <div className={`topic-container ${isLocked && !complete ? 'locked' : ''}`}>
      <div className="topic-header" onClick={toggleCollapse} title={isLocked && !complete ? "Complete previous topic first" : `Click to ${isCollapsed ? 'expand' : 'collapse'}`}>
        <span className="collapse-icon"> {isLocked && !complete ? <FaLock /> : (isCollapsed ? <FaChevronRight /> : <FaChevronDown />)} </span>
        <h4>{topic.title}</h4>
        {role === 'mentor' && !isLocked && ( <button onClick={handleDelete} className="icon-btn delete-topic-btn" title="Delete Topic"> <FaTrashAlt /> </button> )}
        <div className="topic-progress"> <ProgressBar percentage={progress} /> </div>
      </div>

      {!isCollapsed && (!isLocked || complete) && (
        <>
            <ul className="task-list">
            {(topic.tasks || []).map((task, index, arr) => (
                <TaskItem
                    key={task.id} task={task} milestoneId={milestoneId} topicId={topic.id} role={role}
                    isLastTask={index === arr.length - 1} isTopicComplete={complete} isTopicLocked={isLocked && !complete}
                    onUpdateTask={onUpdateTask} onDeleteTask={onDeleteTask} onTriggerQuiz={onTriggerQuiz}
                    onAddResource={onAddResource} // Pass down
                    onUpdateResource={onUpdateResource} // Pass down
                    onDeleteResource={onDeleteResource} // Pass down
                />
            ))}
            </ul>
            {role === 'mentor' && !isLocked && ( <button onClick={handleAddTask} className="add-item-btn add-task-btn"> <FaPlusCircle /> Add Task </button> )}
        </>
      )}
    </div>
  );
}
export default Topic;