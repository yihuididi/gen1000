import { useState } from 'react';
import { createNewTask } from '../backend/task';
import '../../static/css/board/input.css';

export const Input = ({ toggleInputVisibility, fetchData, organizationId, status }) => {
    const [name, setName] = useState('');

    const createTaskHandler = async () => {
        await createNewTask(organizationId, name, '', new Date(), status, [], []);
        setName('');
        toggleInputVisibility(status);
        fetchData();
    };

    return (
        <textarea
            className="hidden task-input"
            placeholder="Task name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={createTaskHandler}>
        </textarea>
    );
};