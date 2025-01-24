import { useState } from 'react';
import '../../static/css/board/task.css';
import { Input } from './input';

export const Task = ({ fetchData, organizationId, setDeleteTask, task }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [name, setName] = useState(task.name);

    const dragStartHandler = (e) => {
        e.dataTransfer.effectsAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
        requestAnimationFrame(() => e.target.classList.add('dragging'));
    };

    const dragEndHandler = (e) => {
        e.target.classList.remove('dragging');
    };

    const editHandler = (e) => {
        setIsEdit(true)
    };

    const deleteHandler = () => {
        setDeleteTask(task);
    };

    return (
        <>
            {isEdit ? (
                <Input
                    fetchData={fetchData}
                    organizationId={organizationId}
                    setIsEdit={setIsEdit}
                    task={task}
                />
            ) : (
                <div
                    draggable
                    className="task"
                    onDragStart={dragStartHandler}
                    onDragEnd={dragEndHandler}
                    data-id={task.id}
                >
                    <div>{task.name}</div>
                    <menu>
                        <button onClick={editHandler}><i className="bi bi-pencil-square"></i></button>
                        <button onClick={deleteHandler}><i className="bi bi-trash"></i></button>
                    </menu>
                </div>
            )}
        </>
    );
};