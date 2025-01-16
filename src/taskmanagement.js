import React, { useState } from "react";
import TaskForm from "./taskform";
import TaskStatus from "./taskstatus";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);

  const handleAddTask = (task) => {
    setTasks([...tasks, task]);
  };

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };

  const toDoTasks = tasks.filter((task) => !task.status || task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const completedTasks = tasks.filter((task) => task.status === "Completed");

  return (
    <div>
      <div style={styles.board}>
        <TaskStatus title="To Do" tasks={toDoTasks} />
        <TaskStatus title="In Progress" tasks={inProgressTasks} />
        <TaskStatus title="Completed" tasks={completedTasks} />
      </div>
      <button style={styles.addButton} onClick={toggleForm}>+</button>
      {isFormVisible && (
        <TaskForm
          onSubmit={handleAddTask}
          onClose={toggleForm}
        />
      )}
    </div>
  );
};

const styles = {
  board: {
    display: "flex",
    gap: "16px",
    padding: "16px",
  },
  addButton: {
    position: "fixed",
    bottom: "16px",
    right: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    fontSize: "24px",
    cursor: "pointer",
  },
};

export default TaskManagement;
