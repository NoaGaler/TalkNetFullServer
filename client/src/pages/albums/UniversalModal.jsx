import React, { useState, useEffect } from 'react';

const UniversalModal = ({ isOpen, onClose, onSave, title, fields, initialData }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({});
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleConfirm = () => {
        const isValid = fields.every(field => formData[field.name]?.trim());
        if (!isValid) {
            alert("Please fill in all fields");
            return;
        }
        onSave(formData);
        onClose();
    };

    return (
        <div className="modalOverlay">
            <div className="modalContent photoModal">
                <h3>{title}</h3>
                <div className="modalForm">
                    {fields.map(field => (
                        <div key={field.name} className="inputGroup">
                            <label>{field.label}</label>
                            <input 
                                type="text"
                                placeholder={field.placeholder}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <div className="modalActions">
                    <button className="saveBtn" onClick={handleConfirm}>Save</button>
                    <button className="cancelBtn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default UniversalModal;