import { useEffect, useState } from 'react';
import { createNewTask, updateTaskName } from '../backend/task';
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

    const blurHandler = () => {
        const trimmed = name.trim()
        if (task) {
            editTaskHandler(trimmed);
        } else {
            createTaskHandler(trimmed);
        }
    };

    const editTaskHandler = async (trimmed) => {
        if (trimmed && trimmed !== task.name) {
            await updateTaskName(organizationId, task.id, trimmed);
            fetchData();
        }
        setIsEdit(false);
    }

    const createTaskHandler = async (trimmed) => {
        if (trimmed !== '') {
            await createNewTask(organizationId, trimmed, '', new Date(), status, [], [])
            fetchData();
        }
        toggleInputVisibility(status);
    }

    useEffect(() => {
        if (task) {
            setName(task.name);
        }
        document.querySelector('textarea').focus();
    }, []);

    return (
        <textarea
            className="hidden task-input"
            placeholder="Task name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={blurHandler}>
        </textarea>
    );
};