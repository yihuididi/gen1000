import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../config/firebase';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    const googleSignInHandler = async (e) => {
        e.preventDefault();
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h1>Sign In</h1>

            <button className="btn btn-primary" onClick={googleSignInHandler}>Sign in with Google</button>

            <form className="my-2" onSubmit={loginHandler}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="text" className="form-control" id="email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="btn btn-primary" type="submit">Login</button>
            </form>

            <Link to="/register">Register for an account.</Link>
        </div>
    );
};