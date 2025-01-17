import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getTasks } from './backend/organization';
import { createNewTask } from './backend/task';
    
    const [todo, setTodo] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [taskname, setTaskName] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState(null)
    const [status, setStatus] = useState(0)
    const [prerequisite, setPrerequisite] = useState([])
    const [assignee, setAssignee] = useState([])


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

    const createTask = async (e) => {
        e.preventDefault();
        createNewTask(organization, taskname, description, deadline, status, assignee, prerequisite);
        const tasks = await getTasks(organization);
        categorizeTasks(tasks);
    };

    return (
        <div className="task-management-system">
            <div className="task-creation-form">
                <h2>Create a Task</h2>
                <form onSubmit={todoHandler}>
                    <div className="form-group">
                        <label htmlFor="assigneeName">Assignee Name</label>
                        <input
                            type="text"
                            id="assigneeName"
                            value={name}
                            onChange={(e) => setAssignee(e.target.value)}
                            placeholder="Enter assignee's name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="taskName">Task Name</label>
                        <input
                            type="text"
                            id="taskName"
                            value={name}
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder="Enter task name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            placeholder="Enter task description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="deadline">Deadline</label>
                        <input
                            type="date"
                            id="deadline"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                onChange={(e) => setPrerequisite(e.target.checked)} // This needs proper state handling
                            />
                            Has prerequisite?
                        </label>
                    </div>
                    <button type="submit" className="btn btn-dark">
                        Create Task
                    </button>
                </form>
            </div>
    
            <div className="task-list">
                <h2>Task List</h2>
                {todo.length === 0 && inProgress.length === 0 && completed.length === 0 ? (
                    <p>No tasks created yet.</p>
                ) : (
                    <ul>
                        {[...todo, ...inProgress, ...completed].map((task) => (
                            <li key={task.id} className={`task-item ${task.status === 2 ? 'completed' : ''}`}>
                                <div>
                                    <strong>{task.name}</strong> <br />
                                    Assigned to: {task.assigneeName} <br />
                                    Description: {task.description} <br />
                                    Deadline: {task.deadline} <br />
                                    Status: {task.status === 2 ? 'Completed' : task.status === 1 ? 'In Progress' : 'To Do'}
                                </div>
                                <div className="task-actions">
                                    <button onClick={() => toggleCompletion(task.id)} className="btn">
                                        {task.status === 2 ? 'Mark as Pending' : 'Mark as Completed'}
                                    </button>
                                    {task.hasPrerequisite && !task.prerequisiteMet && (
                                        <button onClick={() => markPrerequisiteMet(task.id)} className="btn">
                                            Mark Prerequisite Met
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
export default TaskManagementSystem;  
