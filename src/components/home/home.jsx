import { signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { Organizations } from '../organization/organizations';

export const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged(currentUser => {
            if (!currentUser) {
                navigate("/login")
            }
        });
    }, [navigate])
    
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
            <button className="btn btn-primary" onClick={logoutHandler}>Logout</button>
            <Organizations />
        </div>
    );
};