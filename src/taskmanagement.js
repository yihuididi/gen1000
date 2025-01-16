import React, { useState } from "react";

const TaskForm = ({ onSubmit, onClose, existingTasks }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("To Do");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");

  const [prerequisiteExists, setPrerequisiteExists] = useState(false);
  const [selectedPrerequisite, setSelectedPrerequisite] = useState(null);

  // New prerequisite task fields
  const [prerequisiteName, setPrerequisiteName] = useState("");
  const [prerequisiteDescription, setPrerequisiteDescription] = useState("");
  const [prerequisiteStatus, setPrerequisiteStatus] = useState("To Do");
  const [prerequisiteDeadline, setPrerequisiteDeadline] = useState("");
  const [prerequisiteAssignee, setPrerequisiteAssignee] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = {
      taskName,
      taskDescription,
      taskStatus,
      taskDeadline,
      taskAssignee,
      prerequisite: prerequisiteExists ? selectedPrerequisite : {
        taskName: prerequisiteName,
        taskDescription: prerequisiteDescription,
        taskStatus: prerequisiteStatus,
        taskDeadline: prerequisiteDeadline,
        taskAssignee: prerequisiteAssignee,
      },
    };
    onSubmit(task);
    onClose(); // Close the form after submission
  };

  const handlePrerequisiteChange = (e) => {
    setPrerequisiteExists(e.target.value === "yes");
  };

  const handlePrerequisiteSelection = (e) => {
    setSelectedPrerequisite(e.target.value);
  };

  return (
    <div style={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <div style={styles.formField}>
          <label>Task Name:</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>
        <div style={styles.formField}>
          <label>Description:</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
          />
        </div>
        <div style={styles.formField}>
          <label>Status:</label>
          <select
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            required
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div style={styles.formField}>
          <label>Deadline:</label>
          <input
            type="date"
            value={taskDeadline}
            onChange={(e) => setTaskDeadline(e.target.value)}
            required
          />
        </div>
        <div style={styles.formField}>
          <label>Assignee:</label>
          <select
            value={taskAssignee}
            onChange={(e) => setTaskAssignee(e.target.value)}
            required
          >
            {/* Populate the dropdown with available users */}
            <option value="User1">User 1</option>
            <option value="User2">User 2</option>
            <option value="User3">User 3</option>
          </select>
        </div>

        {/* Prerequisite section */}
        <div style={styles.formField}>
          <label>Does this task have a prerequisite?</label>
          <select value={prerequisiteExists ? "yes" : "no"} onChange={handlePrerequisiteChange}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {prerequisiteExists && (
          <div style={styles.formField}>
            <label>Select Prerequisite Task:</label>
            <select value={selectedPrerequisite || ""} onChange={handlePrerequisiteSelection} required>
              <option value="">--Select a Task--</option>
              {existingTasks.map((task, index) => (
                <option key={index} value={task.taskName}>
                  {task.taskName}
                </option>
              ))}
            </select>
          </div>
        )}

        {!prerequisiteExists && (
          <div>
            <h4>Prerequisite Task (Create a new task):</h4>
            <div style={styles.formField}>
              <label>Prerequisite Task Name:</label>
              <input
                type="text"
                value={prerequisiteName}
                onChange={(e) => setPrerequisiteName(e.target.value)}
                required
              />
            </div>
            <div style={styles.formField}>
              <label>Prerequisite Task Description:</label>
              <textarea
                value={prerequisiteDescription}
                onChange={(e) => setPrerequisiteDescription(e.target.value)}
                required
              />
            </div>
            <div style={styles.formField}>
              <label>Prerequisite Task Status:</label>
              <select
                value={prerequisiteStatus}
                onChange={(e) => setPrerequisiteStatus(e.target.value)}
                required
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div style={styles.formField}>
              <label>Prerequisite Task Deadline:</label>
              <input
                type="date"
                value={prerequisiteDeadline}
                onChange={(e) => setPrerequisiteDeadline(e.target.value)}
                required
              />
            </div>
            <div style={styles.formField}>
              <label>Prerequisite Task Assignee:</label>
              <select
                value={prerequisiteAssignee}
                onChange={(e) => setPrerequisiteAssignee(e.target.value)}
                required
              >
                {/* Populate the dropdown with available users */}
                <option value="User1">User 1</option>
                <option value="User2">User 2</option>
                <option value="User3">User 3</option>
              </select>
            </div>
          </div>
        )}

        <div style={styles.formActions}>
          <button type="submit" style={styles.submitButton}>Submit</button>
          <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  formContainer: {
    width: "400px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
  },
  formField: {
    marginBottom: "12px",
  },
  formActions: {
    display: "flex",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#4caf50", // Light blue
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "25px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  cancelButton: {
    backgroundColor: "#f44336", // Red
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "25px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
};

export default TaskForm;
