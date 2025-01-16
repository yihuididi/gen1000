import React from "react";

const Profile = ({ imageUrl, name, email, onProfileToggle, isProfileOpen }) => {
  return (
    <div style={styles.profileContainer}>
      <button onClick={onProfileToggle} style={styles.profileButton}>
        <img src={imageUrl} alt="Profile" style={styles.profileImage} />
        <span style={styles.profileName}>{name}</span> ▼
      </button>
      {isProfileOpen && (
        <div style={styles.profileDropdown}>
          <img src={imageUrl} alt="Profile" style={styles.profileDropdownImage} />
          <p>Name: {name}</p>
          <p>Email: {email}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  profileContainer: {
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  profileButton: {
    background: "none",
    border: "none",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  profileImage: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    marginRight: "8px",
  },
  profileName: {
    fontWeight: "bold",
    marginRight: "5px",
  },
  profileDropdown: {
    position: "absolute",
    top: "30px",
    right: "0",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    padding: "10px",
    boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
    minWidth: "200px",
  },
  profileDropdownImage: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginTop: "10px",
  },
};

export default Profile;
