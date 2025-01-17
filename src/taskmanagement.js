import React, { useState } from "react";
import TaskForm from "./taskform";
import TaskStatus from "./taskstatus";
import Profile from "./profile"; // Importing Profile component

export const TaskManagement = ({ users, imageUrl, email, name }) => {
  const [tasks, setTasks] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleAddTask = (task) => {
    setTasks([...tasks, task]);
  };

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };

  const toggleProfile = () => {
    setProfileOpen(!isProfileOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const toDoTasks = tasks.filter((task) => !task.status || task.status === "To Do");
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress");
  const completedTasks = tasks.filter((task) => task.status === "Completed");

  return (
    <div style={styles.container}>
      {/* Menu */}
      <div style={styles.menuContainer}>
        <button style={styles.menuButton} onClick={toggleMenu}>☰</button>
        {isMenuOpen && (
          <div style={styles.menuDropdown}>
            <button onClick={() => alert("Navigating to Home")}>Home</button>
            <button onClick={() => alert("Navigating to Task Management")}>Task Management</button>
            <button onClick={() => alert("Navigating to Schedule Meeting")}>Schedule Meeting</button>
          </div>
        )}
      </div>

      {/* Profile */}
      <Profile 
        imageUrl={imageUrl} 
        name={name} 
        email={email} 
        onProfileToggle={toggleProfile} 
        isProfileOpen={isProfileOpen}
      />

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
          existingTasks={tasks}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    minHeight: "100vh",
    paddingTop: "50px", // Added padding for top space for profile
  },
  menuContainer: {
    position: "absolute",
    top: "10px",
    left: "10px",
  },
  menuButton: {
    fontSize: "24px",
    background: "none",
    border: "none",
    color: "#333",
    cursor: "pointer",
  },
  menuDropdown: {
    position: "absolute",
    top: "30px",
    left: "0",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    padding: "10px",
    boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
  },
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
