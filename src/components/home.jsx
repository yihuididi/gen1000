import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase-config';

export const Home = () => {
    const [user, setUser] = useState(null);

    // Set user if user is logged in
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setUser(user);
        });
    }, []);

    const logoutHandler = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h1>Homepage</h1>
            {user ? (
                <button className="btn btn-primary" onClick={logoutHandler}>Logout</button>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <br/>
                    <Link to="/register">Register</Link>
                </>
            )}
        </div>
    );
};