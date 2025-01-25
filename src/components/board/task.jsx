import { useState } from 'react';
import '../../static/css/board/task.css';
import { Input } from './input';

export const Task = ({ fetchData, organization, setDeleteTask, task }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [isExpand, setIsExpand] = useState(false);

    const dragStartHandler = (e) => {
        e.dataTransfer.effectsAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
        requestAnimationFrame(() => e.target.classList.add('dragging'));
    };

    const dragEndHandler = (e) => {
        e.target.classList.remove('dragging');
    };

    const editHandler = (e) => {
        e.stopPropagation();
        setIsEdit(true)
    };

    const deleteHandler = (e) => {
        e.stopPropagation();
        setDeleteTask(task);
    };

    const toggleExpand = () => {
        setIsExpand(prev => !prev);
    }

    return (
        <>
            {isEdit ? (
                <Input
                    fetchData={fetchData}
                    organization={organization}
                    setIsEdit={setIsEdit}
                    task={task}
                />
            ) : (
                <div
                    draggable
                    className="task"
                    onClick={toggleExpand}
                    onDragStart={dragStartHandler}
                    onDragEnd={dragEndHandler}
                    data-id={task.id}
                >
                    <div className="name">{task.name}</div>

                    {isExpand && (
                        <div className="description">{task.description}</div>
                    )}

                    <ul className="profiles">
                        {task.assignees.map(assignee => (
                            <li key={assignee.id}><img src={assignee.profile} alt="profile"></img></li>
                        ))}
                    </ul>

                    <menu>
                        <button onClick={editHandler}><i className="bi bi-pencil-square"></i></button>
                        <button onClick={deleteHandler}><i className="bi bi-trash"></i></button>
                    </menu>
                </div>
            )}
        </>
    );
};