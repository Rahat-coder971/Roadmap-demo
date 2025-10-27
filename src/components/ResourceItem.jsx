// src/components/ResourceItem.jsx
import React, { useState } from 'react';
import { FaLink, FaEdit, FaRegEdit, FaSave, FaTrashAlt, FaTimes } from 'react-icons/fa';

function ResourceItem({ resource, milestoneId, topicId, taskId, onUpdateResource, onDeleteResource, role, isLocked }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(resource.title);
    const [editedUrl, setEditedUrl] = useState(resource.url);

    const handleSave = () => {
        if (role !== 'mentor' || isLocked) return;
        // Basic URL validation (optional)
        if (!editedUrl.startsWith('http://') && !editedUrl.startsWith('https://')) {
            alert('Please enter a valid URL starting with http:// or https://');
            return;
        }
        onUpdateResource(milestoneId, topicId, taskId, resource.id, { title: editedTitle, url: editedUrl });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (role === 'mentor' && !isLocked && window.confirm(`Delete resource "${resource.title}"?`)) {
            onDeleteResource(milestoneId, topicId, taskId, resource.id);
        }
    };

    return (
        <li className={`resource-item ${isLocked ? 'disabled' : ''}`}>
            {isEditing && role === 'mentor' ? (
                <div className="resource-edit-form">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="Link Title"
                        className="resource-input title"
                        disabled={isLocked}
                    />
                    <input
                        type="url"
                        value={editedUrl}
                        onChange={(e) => setEditedUrl(e.target.value)}
                        placeholder="Link URL (https://...)"
                        className="resource-input url"
                        disabled={isLocked}
                    />
                    <button onClick={handleSave} className="icon-btn save-resource-btn" title="Save Resource" disabled={isLocked}><FaSave /></button>
                    <button onClick={() => setIsEditing(false)} className="icon-btn cancel-resource-btn" title="Cancel" disabled={isLocked}><FaTimes /></button>
                </div>
            ) : (
                <div className="resource-display">
                    <FaLink className="resource-icon" />
                    <a href={resource.url || '#'} target="_blank" rel="noopener noreferrer" title={resource.url}>
                        {resource.title || 'Untitled Resource'}
                    </a>
                    {role === 'mentor' && !isLocked && (
                         <>
                            <button onClick={() => setIsEditing(true)} className="icon-btn edit-resource-btn" title="Edit Resource" disabled={isLocked}><FaRegEdit /></button>
                            <button onClick={handleDelete} className="icon-btn delete-resource-btn" title="Delete Resource" disabled={isLocked}><FaTrashAlt /></button>
                         </>
                    )}
                </div>
            )}
        </li>
    );
}

export default ResourceItem;