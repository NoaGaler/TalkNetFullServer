import React, { useState, useEffect } from 'react';

const TodoModal = ({ isOpen, title, initialValue, onSave, onClose }) => {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (isOpen) {
            setInputValue(initialValue || "");
        }
    }, [isOpen, initialValue]); 

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (inputValue.trim()) {
            onSave(inputValue);
        }
    };

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <h3>{title}</h3>
                <input 
                    className="modalInput"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter task name..."
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                />
                <div className="modalActions">
                    <button className="confirmBtn" onClick={handleConfirm}>Confirm</button>
                    <button className="cancelBtn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default TodoModal;






