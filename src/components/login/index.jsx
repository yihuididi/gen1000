import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config"; // Import your Firebase config
import '../../static/css/login/index.css';

export const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sign in the user with Firebase Authentication
            await signInWithEmailAndPassword(auth, data.email, data.password);
            // Optionally, store the user information in local storage (if needed)
            localStorage.setItem("username", auth.currentUser.email);
            auth.onAuthStateChanged(currentUser => {
                navigate("/");
            })
        } catch (error) {
            setError(error.message); // Display error message to the user
        }
    };

    return (
        <div className="login_container">
            <div className="login_form_container">
                <div className="left">
                    <form className="form_container" onSubmit={handleSubmit}>
                        <h1>Login to Gen1000</h1>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className="input"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className="input"
                        />
                        <Link to="/forgot-password" style={{ alignSelf: "flex-start" }}>
                            <p style={{ padding: "0 15px" }}>Forgot Password ?</p>
                        </Link>
                        {error && <div className="error_msg">{error}</div>}
                        <button type="submit" className="green_btn">
                            Sign In
                        </button>
                    </form>
                </div>
                <div className="right">
                    <h1>New Here?</h1>
                    <Link to="/register">
                        <button type="button" className="white_btn">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

