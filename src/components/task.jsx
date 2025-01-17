import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getTasks } from './backend/organization';
import { createNewTask } from './backend/task';

export const Task = () => {
    const [todo, setTodo] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [name, setName] = useState('');

    const location = useLocation();
    const organization = location.state;

    const categorizeTasks = (tasks) => {
        const todoTasks = tasks.filter((task) => task.status === 0);
        const inProgressTasks = tasks.filter((task) => task.status === 1);
        const completedTasks = tasks.filter((task) => task.status === 2);
    
        setTodo(todoTasks);
        setInProgress(inProgressTasks);
        setCompleted(completedTasks);
    };
  
    useEffect(() => {
        const fetchData = async () => {
            const tasks = await getTasks(organization);
            categorizeTasks(tasks);
        };

        fetchData();
    }, [organization]);

    const todoHandler = async (e) => {
        e.preventDefault();
        createNewTask(organization, name, 'a', new Date(), 0, [], []);
        const tasks = await getTasks(organization);
        categorizeTasks(tasks);
    };

    const inProgressHandler = async (e) => {
        e.preventDefault();
        createNewTask(organization, name, 'b', new Date(), 1, [], []);
        const tasks = await getTasks(organization);
        categorizeTasks(tasks);
    };

    const completedHandler = async (e) => {
        e.preventDefault();
        createNewTask(organization, name, 'c', new Date(), 2, [], []);
        const tasks = await getTasks(organization);
        categorizeTasks(tasks);
    };

    return (
        <div>
            <h1>Todo</h1>
            <button onClick={todoHandler}>todo</button>
            <ul>
                {todo?.map(task => (
                    <li>{task.name}</li>
                ))}
            </ul>

            <h1>In Progress</h1>
            <button onClick={inProgressHandler}>In progress</button>
            <ul>
                {inProgress?.map(task => (
                    <li>{task.name}</li>
                ))}
            </ul>

            <h1>Completed</h1>
            <button onClick={completedHandler}>Completed</button>
            <ul>
                {completed?.map(task => (
                    <li>{task.name}</li>
                ))}
            </ul>
        </div>
    );
};