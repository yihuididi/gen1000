import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';

export const Home = () => {
    
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
        </div>
    );
};