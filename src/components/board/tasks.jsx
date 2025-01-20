import { useEffect, useState } from 'react';
import { getTasks } from '../backend/organization';
import { updateTaskStatus } from '../backend/task';
import { Input } from './input';
import { Task } from './task';
import '../../static/css/board/tasks.css';

export const Tasks = ({ organizationId }) => {
    const [loading, setLoading] = useState(true);
    const [todo, setTodo] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [isInputHidden, setIsInputHidden] = useState({
        todo: true,
        inProgress: true,
        completed: true
    });

    const fetchData = async () => {
        const tasks = await getTasks(organizationId);
        categorizeTasks(tasks);
        setLoading(false);
    };

    const categorizeTasks = (tasks) => {
        const todoTasks = tasks.filter((task) => task.status === 0);
        const inProgressTasks = tasks.filter((task) => task.status === 1);
        const completedTasks = tasks.filter((task) => task.status === 2);
    
        setTodo(todoTasks);
        setInProgress(inProgressTasks);
        setCompleted(completedTasks);
    };
  
    useEffect(() => {
        fetchData();
    }, [organizationId]);

    useEffect(() => {
        const dragoverHandler = (e) => {
            e.preventDefault(); // allow drop

            const draggedTask = document.querySelector('.dragging');
            const target = e.target.closest('.task-list');

            if (!target || target === draggedTask) return;

            target.appendChild(draggedTask);
        };

        const dropHandler = async (e) => {
            e.preventDefault();
            setLoading(true);

            const taskId = document.querySelector('.dragging').getAttribute('data-id');
            const status = e.target.closest('.task-list').getAttribute('data-status');

            await updateTaskStatus(organizationId, taskId, parseInt(status));
            await fetchData();
            setLoading(false);
        };

        const tasks = document.querySelectorAll('.task-list');
        tasks.forEach(task => {
            task.addEventListener('dragover', dragoverHandler);
            task.addEventListener('drop', dropHandler);
        });

        return () => {
            tasks.forEach(task => {
                task.removeEventListener('dragover', dragoverHandler);
                task.removeEventListener('drop', dropHandler);
            })
        }
    }, [organizationId, loading, todo, inProgress, completed]);

    const toggleInputVisibility = (status) => {
        switch (status) {
            case 0:
                setIsInputHidden(prev => ({
                    todo: !prev.todo,
                    inProgress: true,
                    completed: true
                }));
                break;
            case 1:
                setIsInputHidden(prev => ({
                    todo: true,
                    inProgress: !prev.inProgress,
                    completed: true
                }));
                break;
            case 2:
                setIsInputHidden(prev => ({
                    todo: true,
                    inProgress: true,
                    completed: !prev.completed
                }));
                break;
            default:
        }
    };

    return (
        <div className="tasks">
            {loading ? (
                "Loading..."
            ) : (
                <div className="container columns">
                    <div className="column">
                        <div className="column-title">
                            <h3>TO DO</h3>
                            <button onClick={(e) => toggleInputVisibility(0)}><i className="bi bi-plus"></i></button>
                        </div>
                        <div className="task-list" data-status={0}>
                            {todo.map(task => (
                                <Task key={task.id} task={task} />
                            ))}
                            {!isInputHidden.todo && (
                                <Input
                                    toggleInputVisibility={toggleInputVisibility}
                                    fetchData={fetchData}
                                    organizationId={organizationId}
                                    status={0}
                                />
                            )}
                        </div>
                    </div>

                    <div className="column">
                        <div className="column-title">
                            <h3>IN PROGRESS</h3>
                            <button onClick={(e) => toggleInputVisibility(1)}><i className="bi bi-plus"></i></button>
                        </div>
                        <div className="task-list" data-status={1}>
                            {inProgress.map(task => (
                                <Task key={task.id} task={task} />
                            ))}
                            {!isInputHidden.inProgress && (
                                <Input
                                    toggleInputVisibility={toggleInputVisibility}
                                    fetchData={fetchData}
                                    organizationId={organizationId}
                                    status={1}
                                />
                            )}
                        </div>
                    </div>

                    <div className="column">
                        <div className="column-title">
                            <h3>COMPLETED</h3>
                            <button onClick={(e) => toggleInputVisibility(2)}><i className="bi bi-plus"></i></button>
                        </div>
                        <div className="task-list" data-status={2}>
                            {completed.map(task => (
                                <Task key={task.id} task={task} />
                            ))}
                            {!isInputHidden.completed && (
                                <Input
                                    toggleInputVisibility={toggleInputVisibility}
                                    fetchData={fetchData}
                                    organizationId={organizationId}
                                    status={2}
                                />
                            )}
                        </div>
                    </div>

                    <dialog className="confirm-modal">
                        <form method="dialog">
                            <h3>Delete Task?</h3>
                            <p>You are about to delete this task.</p>
                            <div className="preview"></div>

                            <menu>
                                <button type="button" id="cancel">Cancel</button>
                                <button type="submit" id="confirm">Yes, delete it.</button>
                            </menu>
                        </form>
                    </dialog>
                </div>
            )}
        </div>
    );
};