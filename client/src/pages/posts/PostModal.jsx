import React, { useState, useEffect } from 'react';

const PostModal = ({ isOpen, title, initialData, onSave, onClose }) => {
    const [formData, setFormData] = useState({ title: "", body: "" });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: initialData?.title || "",
                body: initialData?.body || ""
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (formData.title.trim() && formData.body.trim()) {
            onSave(formData);
        } else {
            alert("Please fill in both title and content.");
        }
    };

    return (
        <div className="modalOverlay">
            <div className="modalContent postModal">
                <h3>{title}</h3>
                <input 
                    className="modalInput"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Post Title..."
                />
                <textarea 
                    className="modalTextArea"
                    value={formData.body}
                    onChange={(e) => setFormData({...formData, body: e.target.value})}
                    placeholder="What's on your mind...?"
                    rows="5"
                />
                <div className="modalActions">
                    <button className="confirmBtn" onClick={handleConfirm}>Confirm</button>
                    <button className="cancelBtn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default PostModal;