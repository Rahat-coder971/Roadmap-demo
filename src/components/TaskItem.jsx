// src/components/TaskItem.jsx
import React, { useState } from 'react';
import { FaEdit, FaRegEdit, FaStickyNote, FaRegStickyNote, FaSave, FaTimes, FaTrashAlt } from 'react-icons/fa';
import { IoCheckmarkCircle, IoLockClosed, IoAlertCircleOutline } from 'react-icons/io5'; // Added Alert icon

// *** UPDATED: Added isTopicLocked prop ***
function TaskItem({ task, milestoneId, topicId, onUpdateTask, onDeleteTask, role, isLastTask, isTopicComplete, onTriggerQuiz, isTopicLocked }) {
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editedDesc, setEditedDesc] = useState(task.description);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(task.mentorNotes || "");

  const handleToggleComplete = () => {
    // *** UPDATED: Check if topic is locked first ***
    if (isTopicLocked && !task.completed) {
        alert("Please complete the previous topic first.");
        return;
    }

    // Check if trying to complete the *last task* of an *incomplete topic*
    if (!task.completed && isLastTask && !isTopicComplete) {
        // *** NEW: Add confirmation before quiz ***
        if (window.confirm("This is the last task for this topic. Take the quiz to unlock it?")) {
            onTriggerQuiz(topicId); // Trigger the quiz
        }
        // Don't mark complete here, quiz result will handle it
    } else {
        // Otherwise, just toggle completion as normal
        onUpdateTask(milestoneId, topicId, task.id, { completed: !task.completed });
    }
  };

  const handleSaveDescription = () => { /* ... unchanged ... */
    if (role !== 'mentor') return;
    onUpdateTask(milestoneId, topicId, task.id, { description: editedDesc });
    setIsEditingDesc(false);
  };
  const handleSaveNotes = () => { /* ... unchanged ... */
    if (role !== 'mentor') return;
    onUpdateTask(milestoneId, topicId, task.id, { mentorNotes: editedNotes });
    setIsEditingNotes(false);
  };
  const startEditingDescription = () => { /* ... unchanged ... */
    if (role === 'mentor') setIsEditingDesc(true);
  }
  const startEditingNotes = () => { /* ... unchanged ... */
    if (role === 'mentor') setIsEditingNotes(true);
  }
  const handleDelete = () => { /* ... unchanged ... */
      if (role === 'mentor' && window.confirm(`Are you sure you want to delete this task: "${task.description}"?`)) {
          onDeleteTask(milestoneId, topicId, task.id);
      }
  }

  // Determine title for the status icon
  let statusTitle = task.completed ? "Mark as Incomplete" : "Mark as Complete";
  if (!task.completed && isLastTask && !isTopicComplete) {
      statusTitle = "Take Quiz to Complete Topic";
  }
  if (isTopicLocked && !task.completed) {
      statusTitle = "Complete previous topic first";
  }


  return (
    // *** UPDATED: Add 'locked' class if topic is locked ***
    <li className={`task-item ${task.completed ? 'completed' : ''} ${isTopicLocked && !task.completed ? 'locked' : ''} task-transition`}>
      <div className="task-content">
        <span
          className={`task-status-icon ${isTopicLocked && !task.completed ? 'disabled' : ''}`}
          onClick={handleToggleComplete}
          title={statusTitle}
        >
          {task.completed ? <IoCheckmarkCircle className="icon-complete"/> : <IoLockClosed className="icon-incomplete"/>}
        </span>

        {isEditingDesc && role === 'mentor' ? (
          <input /* ... unchanged ... */
            type="text" value={editedDesc} onChange={(e) => setEditedDesc(e.target.value)}
            onBlur={handleSaveDescription} onKeyDown={(e) => e.key === 'Enter' && handleSaveDescription()}
            autoFocus className="task-edit-input"
          />
        ) : (
          <span className="task-description">{task.description}</span>
        )}

        {/* Action Buttons Container - Disable if topic is locked */}
        <div className={`task-actions ${isTopicLocked ? 'disabled' : ''}`}>
            {role === 'mentor' && !isEditingDesc && (
              <button onClick={startEditingDescription} className="icon-btn edit-btn" title="Edit Task" disabled={isTopicLocked}><FaRegEdit /></button>
            )}
             {role === 'mentor' && isEditingDesc && (
              <button onClick={handleSaveDescription} className="icon-btn save-btn" title="Save Task" disabled={isTopicLocked}><FaSave /></button>
            )}
            {role === 'mentor' && (
                 <button onClick={handleDelete} className="icon-btn delete-btn" title="Delete Task" disabled={isTopicLocked}><FaTrashAlt /></button>
            )}
        </div>
      </div>

       {/* Mentor Notes Section - Disable editing if topic is locked */}
       <div className={`mentor-notes ${isTopicLocked ? 'disabled' : ''}`}>
          {isEditingNotes && role === 'mentor' ? (
             <>
             <textarea value={editedNotes} onChange={(e) => setEditedNotes(e.target.value)} placeholder="Add mentor notes..." rows={2} className="notes-edit-input" disabled={isTopicLocked}/>
             <button onClick={handleSaveNotes} className="icon-btn save-notes-btn" title="Save Note" disabled={isTopicLocked}><FaSave /></button>
             <button onClick={() => setIsEditingNotes(false)} className="icon-btn cancel-notes-btn" title="Cancel" disabled={isTopicLocked}><FaTimes /></button>
            </>
          ) : (
            <div className="notes-display">
              {task.mentorNotes && <p className="notes-text"><em><FaStickyNote className="notes-icon"/> Note:</em> {task.mentorNotes}</p>}
               {role === 'mentor' && (
                 <button onClick={startEditingNotes} className="icon-btn edit-notes-btn" title={task.mentorNotes ? 'Edit Note' : 'Add Note'} disabled={isTopicLocked}>
                    {task.mentorNotes ? <FaRegEdit /> : <FaRegStickyNote />} {task.mentorNotes ? '' : 'Add Note'}
                 </button>
               )}
            </div>
          )}
        </div>
        {/* Optional: Add a small lock indicator if topic is locked */}
        {isTopicLocked && !task.completed && <span className="topic-locked-indicator"><IoAlertCircleOutline /> Prev. topic needed</span>}
    </li>
  );
}

export default TaskItem;