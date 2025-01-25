import { useCallback, useEffect, useRef, useState } from 'react';
import { createNewTask, updateTaskDescription, updateTaskName } from '../backend/task';
import '../../static/css/board/input.css';

export const Input = ({
    fetchData,
    organizationId,
    setIsEdit,
    status,
    task,
    toggleInputVisibility
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isInvalidTask, setIsInvalidTask] = useState(false);
    const inputRef = useRef(null);

    const editTaskHandler = useCallback(async (name, description) => {
        let isEdited = false;
        if (name && name !== task.name) {
            await updateTaskName(organizationId, task.id, name);
            isEdited = true;
        }
        if (description !== task.description) {
            await updateTaskDescription(organizationId, task.id, description);
            isEdited = true;
        }
        if (isEdited) {
            fetchData();
        }
        setIsEdit(false);
    }, [task, organizationId, fetchData, setIsEdit]);

    const createTaskHandler = useCallback(async (name, description) => {
        if (name) {
            await createNewTask(organizationId, name, description, new Date(), status, [], [])
            fetchData();
            toggleInputVisibility(status);
        } else if (description) {
            setIsInvalidTask(true);
        }
    }, [fetchData, organizationId, status, toggleInputVisibility]);

    useEffect(() => {
        if (task) {
            setName(task.name);
            setDescription(task.description);
        }
    }, [task]);

    useEffect(() => {
        const clickOutsideHandler = (e) => {
            if (!inputRef.current || inputRef.current.contains(e.target)) {
                return;
            }

            const trimmedName = name.trim();
            const trimmedDescription = description.trim();
            if (task) {
                editTaskHandler(trimmedName, trimmedDescription);
            } else {
                createTaskHandler(trimmedName, trimmedDescription);
            }
        };

        document.addEventListener('mousedown', clickOutsideHandler);
        
        return () => {
            document.removeEventListener('mousedown', clickOutsideHandler);
        }
    }, [task, name, description, editTaskHandler, createTaskHandler]);

    return (
        <div className="task-input" ref={inputRef}>
            <textarea className={`name ${isInvalidTask ? "invalid" : ""}`}
                autoFocus
                placeholder={isInvalidTask ? "Please input a task name" : "Task name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
            >
            </textarea>
            <textarea className="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            >
            </textarea>
        </div>
    );
};