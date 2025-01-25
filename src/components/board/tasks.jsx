import { useCallback, useEffect, useState } from 'react';
import { getTasks } from '../backend/organization';
import { updateTaskStatus } from '../backend/task';
import { Confirmation } from './confirmation';
import { Input } from './input';
import { Task } from './task';
import '../../static/css/board/tasks.css';

export const Tasks = ({ organization }) => {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState({
        todo: [],
        inProgress: [],
        completed: []
    });
    const [isInputHidden, setIsInputHidden] = useState({
        todo: true,
        inProgress: true,
        completed: true
    });

    // States for managing confirmation modal
    const [deleteTask, setDeleteTask] = useState(null);

    const fetchData = useCallback(async () => {
        const tasks = await getTasks(organization.id);
        categorizeTasks(tasks);
        setLoading(false);
    }, [organization]);

    const categorizeTasks = (tasks) => {
        const todoTasks = tasks.filter((task) => task.status === 0);
        const inProgressTasks = tasks.filter((task) => task.status === 1);
        const completedTasks = tasks.filter((task) => task.status === 2);
    
        setTasks({
            todo: todoTasks,
            inProgress: inProgressTasks,
            completed: completedTasks
        });
    };
  
    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

            await updateTaskStatus(organization.id, taskId, parseInt(status));
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
    }, [organization, loading, fetchData]);

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
                <>
                    <div className="container columns">
                        <div className="column">
                            <div className="column-title">
                                <h3 data-tasks={tasks.todo.length}>TO DO</h3>
                                <button onClick={(e) => toggleInputVisibility(0)}><i className="bi bi-plus"></i></button>
                            </div>
                            <div className="task-list" data-status={0}>
                                {tasks.todo.map(task => (
                                    <Task
                                        fetchData={fetchData}
                                        organization={organization}
                                        key={task.id}
                                        setDeleteTask={setDeleteTask}
                                        task={task}
                                    />
                                ))}
                                {!isInputHidden.todo && (
                                    <Input
                                        fetchData={fetchData}
                                        organization={organization}
                                        status={0}
                                        toggleInputVisibility={toggleInputVisibility}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="column">
                            <div className="column-title">
                                <h3 data-tasks={tasks.inProgress.length}>IN PROGRESS</h3>
                                <button onClick={(e) => toggleInputVisibility(1)}><i className="bi bi-plus"></i></button>
                            </div>
                            <div className="task-list" data-status={1}>
                                {tasks.inProgress.map(task => (
                                    <Task
                                        fetchData={fetchData}
                                        organization={organization}
                                        key={task.id}
                                        setDeleteTask={setDeleteTask}
                                        task={task}
                                    />
                                ))}
                                {!isInputHidden.inProgress && (
                                    <Input
                                        fetchData={fetchData}
                                        organization={organization}
                                        status={1}
                                        toggleInputVisibility={toggleInputVisibility}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="column">
                            <div className="column-title">
                                <h3 data-tasks={tasks.completed.length}>COMPLETED</h3>
                                <button onClick={(e) => toggleInputVisibility(2)}><i className="bi bi-plus"></i></button>
                            </div>
                            <div className="task-list" data-status={2}>
                                {tasks.completed.map(task => (
                                    <Task
                                        fetchData={fetchData}
                                        organization={organization}
                                        key={task.id}
                                        setDeleteTask={setDeleteTask}
                                        task={task}
                                    />
                                ))}
                                {!isInputHidden.completed && (
                                    <Input
                                        fetchData={fetchData}
                                        organization={organization}
                                        status={2}
                                        toggleInputVisibility={toggleInputVisibility}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {deleteTask && (
                        <Confirmation
                            fetchData={fetchData}
                            setDeleteTask={setDeleteTask}
                            organization={organization}
                            task={deleteTask}
                        />
                    )}
                </>
            )}
        </div>
    );
};