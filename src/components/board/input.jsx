import { useCallback, useEffect, useRef, useState } from 'react';
import { createNewTask, updateTaskAssignees, updateTaskDescription, updateTaskName } from '../backend/task';
import '../../static/css/board/input.css';

export const Input = ({
    fetchData,
    organization,
    setIsEdit,
    status,
    task,
    toggleInputVisibility
}) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        assignees: []
    });
    const [isInvalidTask, setIsInvalidTask] = useState(false);
    const [hasAssigneesChanged, setHasAssigneesChanged] = useState(false);
    const inputRef = useRef(null);

    const editTaskHandler = useCallback(async (name, description, assignees) => {
        let isEdited = false;
        if (name && name !== task.name) {
            await updateTaskName(organization.id, task.id, name);
            isEdited = true;
        }
        if (description !== task.description) {
            await updateTaskDescription(organization.id, task.id, description);
            isEdited = true;
        }
        if (hasAssigneesChanged) {
            await updateTaskAssignees(organization.id, task.id, assignees);
            isEdited = true;
        }
        if (isEdited) {
            fetchData();
        }
        setIsEdit(false);
    }, [task, hasAssigneesChanged, organization, fetchData, setIsEdit]);

    const createTaskHandler = useCallback(async (name, description, assignees) => {
        if (name) {
            await createNewTask(organization.id, name, description, new Date(), status, assignees, [])
            fetchData();
            toggleInputVisibility(status);
        } else if (description || assignees.length > 0) {
            setIsInvalidTask(true);
        } else {
            toggleInputVisibility(status);
        }
    }, [fetchData, organization, status, toggleInputVisibility]);

    const updateSelectedAssignees = (e) => {
        setHasAssigneesChanged(true);
        const selected = Array.from(e.target.selectedOptions).map((option) => option.value);
        setForm({ ...form, assignees: selected });
    };

    useEffect(() => {
        if (task) {
            setForm({
                name: task.name,
                description: task.description,
                assignees: task.assignees.map(a => a.id)
            });
        }
    }, [task]);

    useEffect(() => {
        const clickOutsideHandler = (e) => {
            if (!inputRef.current || inputRef.current.contains(e.target)) {
                return;
            }

            const name = form.name.trim();
            const description = form.description.trim();
            if (task) {
                editTaskHandler(name, description, form.assignees);
            } else {
                createTaskHandler(name, description, form.assignees);
            }
        };

        document.addEventListener('mousedown', clickOutsideHandler);
        
        return () => {
            document.removeEventListener('mousedown', clickOutsideHandler);
        }
    }, [task, form.name, form.description, form.assignees, editTaskHandler, createTaskHandler]);

    return (
        <div className="task-input" ref={inputRef}>
            <textarea className={`name ${isInvalidTask ? "invalid" : ""}`}
                autoFocus
                placeholder={isInvalidTask ? "Please input a task name" : "Task name"}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            >
            </textarea>

            <textarea className="description"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
            >
            </textarea>

            <label htmlFor="assignees" className="form-label">Assignees</label>
            <select
                className="form-select"
                multiple
                value={form.assignees}
                onChange={updateSelectedAssignees}
            >
                {organization.members.map(m => (
                    <option key={m.id} value={m.id}>{m.email}</option>
                ))}
            </select>
        </div>
    );
};