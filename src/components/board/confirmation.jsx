import { useEffect } from 'react';
import { deleteTask } from '../backend/task';
import '../../static/css/board/confirmation.css';

export const Confirmation = ({ fetchData, setDeleteTask, organizationId, task }) => {
    const confirmDeleteHandler = () => {
        deleteTask(organizationId, task.id);
        fetchData();
        setDeleteTask(null);
    };

    const cancelHandler = () => {
        document.querySelector('.confirmation').close();
        setDeleteTask(null);
    };

    useEffect(() => {
        document.querySelector('.confirmation').showModal();
    }, [])

    return (
        <dialog onSubmit={confirmDeleteHandler} onClose={cancelHandler} className="confirmation">
            <form method="dialog">
                <h3>Delete Task?</h3>
                <p>You are about to delete this task.</p>
                <div className="preview">
                    {task.name.substring(0, 100)}
                </div>

                <menu>
                    <button onClick={cancelHandler} type="button" id="cancel">Cancel</button>
                    <button type="submit" id="confirm">Yes, delete it.</button>
                </menu>
            </form>
        </dialog>
    );
};