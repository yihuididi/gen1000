import '../../static/css/board/task.css';

export const Task = ({ setDeleteTask, task }) => {
    const dragStartHandler = (e) => {
        e.dataTransfer.effectsAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
        requestAnimationFrame(() => e.target.classList.add('dragging'));
    };

    const dragEndHandler = (e) => {
        e.target.classList.remove('dragging');
    };

    const editHandler = () => {

    };

    const deleteHandler = () => {
        setDeleteTask(task);
    };

    return (
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
    );
};