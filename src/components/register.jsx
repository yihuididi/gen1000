import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase-config';

import boy from '../static/images/profile/boy.png'
import girl from '../static/images/profile/girl.png'
import man2 from '../static/images/profile/man-2.png'
import man from '../static/images/profile/man.png'
import profile from '../static/images/profile/profile.png'
import woman from '../static/images/profile/woman.png'

const getRandomProfile = () => {
    const choices = [boy, girl, man2, man, profile, woman];
    return choices[Math.floor(choices.length * Math.random())];
};

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const registerHandler = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser
            if (user) {
                await setDoc(doc(db, 'User', user.uid), {
                    email: user.email,
                    profile: getRandomProfile()
                })
            }
            navigate('/');
        } catch (e) {
            setMessage(e.toString());
        }
    };

    return (
        <div className="container">
            <h1>Register Account</h1>

            <form className="my-2" onSubmit={registerHandler}>
                {message && 
                    <div className="alert alert-danger">
                        {message}
                    </div>
                }
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="text" className="form-control" id="email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="btn btn-primary" type="submit">Register</button>
            </form>

            <Link to="/login">Already have an account?</Link>
        </div>
    );
};