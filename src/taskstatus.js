import React from "react";

const TaskStatus = ({ title, tasks }) => {
  return (
    <div style={styles.column}>
      <h3>{title}</h3>
      {tasks.map((task, index) => (
        <div key={index} style={styles.taskCard}>
          <h4>{task.name}</h4>
          <p>{task.description}</p>
          <p>Deadline: {task.deadline}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  column: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    padding: "16px",
    margin: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "8px 12px",
    marginBottom: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
};

export default TaskStatus;
