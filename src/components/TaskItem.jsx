// src/components/TaskItem.jsx
import React, { useState } from 'react';
import ResourceItem from './ResourceItem'; // *** NEW: Import ResourceItem ***
import { FaEdit, FaRegEdit, FaStickyNote, FaRegStickyNote, FaSave, FaTimes, FaTrashAlt, FaPlusCircle } from 'react-icons/fa'; // Added FaPlusCircle
import { IoCheckmarkCircle, IoLockClosed, IoAlertCircleOutline } from 'react-icons/io5';

// *** UPDATED: Added onAddResource, onUpdateResource, onDeleteResource props ***
function TaskItem({
    task, milestoneId, topicId, role, isLastTask, isTopicComplete, isTopicLocked,
    onUpdateTask, onDeleteTask, onTriggerQuiz,
    onAddResource, onUpdateResource, onDeleteResource // New resource handlers
}) {
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [editedDesc, setEditedDesc] = useState(task.description);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [editedNotes, setEditedNotes] = useState(task.mentorNotes || "");
    const [showAddResource, setShowAddResource] = useState(false); // *** NEW: State for showing add resource form ***
    const [newResourceTitle, setNewResourceTitle] = useState("");
    const [newResourceUrl, setNewResourceUrl] = useState("");

    const handleToggleComplete = () => { /* ... unchanged ... */
        if (isTopicLocked && !task.completed) { alert("Complete previous topic first."); return; }
        if (!task.completed && isLastTask && !isTopicComplete) { if (window.confirm("This is the last task for this topic. Take the quiz to unlock it?")) { onTriggerQuiz(topicId); } }
        else { onUpdateTask(milestoneId, topicId, task.id, { completed: !task.completed }); }
    };
    const handleSaveDescription = () => { /* ... unchanged ... */ if (role !== 'mentor') return; onUpdateTask(milestoneId, topicId, task.id, { description: editedDesc }); setIsEditingDesc(false); };
    const handleSaveNotes = () => { /* ... unchanged ... */ if (role !== 'mentor') return; onUpdateTask(milestoneId, topicId, task.id, { mentorNotes: editedNotes }); setIsEditingNotes(false); };
    const startEditingDescription = () => { /* ... unchanged ... */ if (role === 'mentor' && !isTopicLocked) setIsEditingDesc(true); }
    const startEditingNotes = () => { /* ... unchanged ... */ if (role === 'mentor' && !isTopicLocked) setIsEditingNotes(true); }
    const handleDelete = () => { /* ... unchanged ... */ if (role === 'mentor' && !isTopicLocked && window.confirm(`Delete task "${task.description}"?`)) { onDeleteTask(milestoneId, topicId, task.id); } }

    // --- *** NEW: Resource Handlers *** ---
    const handleAddNewResource = () => {
        if (role !== 'mentor' || isTopicLocked) return;
        if (!newResourceUrl.startsWith('http://') && !newResourceUrl.startsWith('https://')) {
             alert('Please enter a valid URL starting with http:// or https://');
             return;
        }
        onAddResource(milestoneId, topicId, task.id, newResourceTitle || `Resource ${ (task.resources || []).length + 1 }`, newResourceUrl);
        // Reset form
        setNewResourceTitle("");
        setNewResourceUrl("");
        setShowAddResource(false);
    };
    // --- *** END NEW *** ---


    let statusTitle = task.completed ? "Mark as Incomplete" : "Mark as Complete";
    if (!task.completed && isLastTask && !isTopicComplete) statusTitle = "Take Quiz to Complete Topic";
    if (isTopicLocked && !task.completed) statusTitle = "Complete previous topic first";

    return (
        <li className={`task-item ${task.completed ? 'completed' : ''} ${isTopicLocked && !task.completed ? 'locked' : ''} task-transition`}>
            {/* Task Content (Status, Description, Actions) */}
            <div className="task-content">
                <span className={`task-status-icon ${isTopicLocked && !task.completed ? 'disabled' : ''}`} onClick={handleToggleComplete} title={statusTitle}>
                    {task.completed ? <IoCheckmarkCircle className="icon-complete"/> : <IoLockClosed className="icon-incomplete"/>}
                </span>
                {isEditingDesc && role === 'mentor' ? ( <input type="text" value={editedDesc} onChange={(e) => setEditedDesc(e.target.value)} onBlur={handleSaveDescription} onKeyDown={(e) => e.key === 'Enter' && handleSaveDescription()} autoFocus className="task-edit-input" disabled={isTopicLocked}/> ) : ( <span className="task-description">{task.description}</span> )}
                <div className={`task-actions ${isTopicLocked ? 'disabled' : ''}`}>
                     {role === 'mentor' && !isEditingDesc && ( <button onClick={startEditingDescription} className="icon-btn edit-btn" title="Edit Task" disabled={isTopicLocked}><FaRegEdit /></button> )}
                     {role === 'mentor' && isEditingDesc && ( <button onClick={handleSaveDescription} className="icon-btn save-btn" title="Save Task" disabled={isTopicLocked}><FaSave /></button> )}
                     {role === 'mentor' && ( <button onClick={handleDelete} className="icon-btn delete-btn" title="Delete Task" disabled={isTopicLocked}><FaTrashAlt /></button> )}
                </div>
            </div>

            {/* Mentor Notes (Unchanged Structure) */}
            <div className={`mentor-notes ${isTopicLocked ? 'disabled' : ''}`}>
                {isEditingNotes && role === 'mentor' ? ( <> <textarea value={editedNotes} onChange={(e) => setEditedNotes(e.target.value)} placeholder="Add mentor notes..." rows={2} className="notes-edit-input" disabled={isTopicLocked}/> <button onClick={handleSaveNotes} className="icon-btn save-notes-btn" title="Save Note" disabled={isTopicLocked}><FaSave /></button> <button onClick={() => setIsEditingNotes(false)} className="icon-btn cancel-notes-btn" title="Cancel" disabled={isTopicLocked}><FaTimes /></button> </>
                ) : ( <div className="notes-display"> {task.mentorNotes && <p className="notes-text"><em><FaStickyNote className="notes-icon"/> Note:</em> {task.mentorNotes}</p>} {role === 'mentor' && ( <button onClick={startEditingNotes} className="icon-btn edit-notes-btn" title={task.mentorNotes ? 'Edit Note' : 'Add Note'} disabled={isTopicLocked}> {task.mentorNotes ? <FaRegEdit /> : <FaRegStickyNote />} {task.mentorNotes ? '' : 'Add Note'} </button> )} </div> )}
            </div>

            {/* --- *** NEW: Resource List Section *** --- */}
            <div className={`resource-section ${isTopicLocked ? 'disabled' : ''}`}>
                {(task.resources && task.resources.length > 0) && (
                    <>
                        <h5>Resources:</h5>
                        <ul className="resource-list">
                            {task.resources.map(resource => (
                                <ResourceItem
                                    key={resource.id}
                                    resource={resource}
                                    milestoneId={milestoneId}
                                    topicId={topicId}
                                    taskId={task.id}
                                    onUpdateResource={onUpdateResource}
                                    onDeleteResource={onDeleteResource}
                                    role={role}
                                    isLocked={isTopicLocked}
                                />
                            ))}
                        </ul>
                    </>
                )}

                {/* Add Resource Form/Button (Mentor Only) */}
                {role === 'mentor' && !isTopicLocked && (
                    showAddResource ? (
                        <div className="add-resource-form">
                             <h5>Add New Resource:</h5>
                            <input
                                type="text"
                                value={newResourceTitle}
                                onChange={(e) => setNewResourceTitle(e.target.value)}
                                placeholder="Link Title (Optional)"
                                className="resource-input title"
                            />
                            <input
                                type="url"
                                value={newResourceUrl}
                                onChange={(e) => setNewResourceUrl(e.target.value)}
                                placeholder="Link URL (https://...)"
                                required
                                className="resource-input url"
                            />
                             <button onClick={handleAddNewResource} className="icon-btn save-resource-btn" title="Add Resource"><FaSave /></button>
                             <button onClick={() => setShowAddResource(false)} className="icon-btn cancel-resource-btn" title="Cancel"><FaTimes /></button>
                        </div>
                    ) : (
                        <button onClick={() => setShowAddResource(true)} className="add-item-btn add-resource-btn">
                            <FaPlusCircle /> Add Resource
                        </button>
                    )
                )}
            </div>
             {/* --- *** END NEW *** --- */}


            {isTopicLocked && !task.completed && <span className="topic-locked-indicator"><IoAlertCircleOutline /> Prev. topic needed</span>}
        </li>
    );
}

export default TaskItem;