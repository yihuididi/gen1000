import '../../static/css/board/task.css';

export const Task = ({ task }) => {
    const dragStartHandler = (e) => {
        e.dataTransfer.effectsAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
        requestAnimationFrame(() => e.target.classList.add('dragging'));
    };

    const dragEndHandler = (e) => {
        e.target.classList.remove('dragging');
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
                <button><i className="bi bi-pencil-square"></i></button>
                <button><i className="bi bi-trash"></i></button>
            </menu>
        </div>
    );
};