import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import useResourceManager from '../../hooks/useResourceManager';
import TodoItem from './TodosItem';
import TodoModal from './TodoModal';
import './Todos.css';

const TodosPage = () => {
    const { currentUser, API_BASE } = useContext(UserContext);

    const baseUrl = `${API_BASE}/todos`;
    const fetchUrl = currentUser?.id 
    ? `${baseUrl}?userId=${String(currentUser.id)}` 
    : null;
    
    const {
        items: todos,
        loading,
        error,
        actionLoading,
        addItem,
        updateItem,
        removeItem,
        setSearch,
        setCriteria,
        setSort,
        searchTerm,
        searchCriteria,
        sortBy
    } = useResourceManager(baseUrl, fetchUrl);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: '',
        todo: null
    });

    const closeModal = () => {
        setModalConfig({ isOpen: false, type: '', todo: null });
    };

    const openModal = (type, todo = null) => {
        setModalConfig({ isOpen: true, type, todo });
    };

    const handleSave = async (title) => {
        try {
            if (modalConfig.type === 'add') {
                await addItem({
                    userId: currentUser.id,
                    title: title,
                    completed: false
                });
            } else if (modalConfig.type === 'edit') {
                await updateItem(modalConfig.todo.id, { title: title });
            }
            closeModal();
        } catch (err) {
            console.error("Save failed:", err);
        }
    };

    if (loading) return <div className="infoWrapper"><div className="spinner"></div><p>Loading tasks...</p></div>;
    if (error) return <div className="errorContainer"><p>Error: {error}</p></div>;

    return (
        <div className="todosContainer">
            <h1 className="pageTitle">My Tasks</h1>

            <div className="todosToolbar">
                <div className="searchGroup">
                    <div className="searchChips">
                        <button
                            className={`chip ${searchCriteria === 'title' ? 'active' : ''}`}
                            onClick={() => setCriteria('title')}
                        >
                            Title
                        </button>
                        <button
                            className={`chip ${searchCriteria === 'id' ? 'active' : ''}`}
                            onClick={() => setCriteria('id')}
                        >
                            ID
                        </button>
                    </div>
                    <div className="searchField">
                        <input
                            type="text"
                            className="searchInput"
                            placeholder={`Search by ${searchCriteria}...`}
                            value={searchTerm}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <span className="searchIcon">🔍</span>
                    </div>
                </div>

                <div className="actionGroup">
                    <select className="sortSelect" value={sortBy} onChange={(e) => setSort(e.target.value)}>
                        <option value="id">Sort by ID</option>
                        <option value="title">Sort by Title</option>
                        <option value="completed">Sort by Status</option>
                    </select>
                    <button className="addTodoBtn" onClick={() => openModal('add')}>+ New Task</button>
                </div>
            </div>

            <TodoModal
                isOpen={modalConfig.isOpen}
                title={modalConfig.type === 'edit' ? "Edit Task" : "Create New Task"}
                initialValue={modalConfig.type === 'edit' ? modalConfig.todo.title : ""}
                onSave={handleSave}
                onClose={closeModal}
            />

            <div className="todosList">
                {todos && todos.length > 0 ? (
                    todos.map(todo => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={(id) => updateItem(id, { completed: !todo.completed })}
                            onDelete={removeItem}
                            onEdit={() => openModal('edit', todo)}
                        />
                    ))
                ) : (
                    <p className="noResults">No tasks found.</p>
                )}
            </div>

            {actionLoading && <div className="mutationOverlay">Updating...</div>}
        </div>
    );
};

export default TodosPage;





