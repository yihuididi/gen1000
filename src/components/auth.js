import { auth, googleProvider } from '../firebase-config';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { useState } from 'react';

export const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signInWithEmailAndPassword = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err);
        }
    };
    
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div class="container">
            <button onClick={signInWithGoogle}>Sign In With Google</button>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="text" class="form-control" id="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button class="btn btn-primary" onClick={signInWithEmailAndPassword}>Register</button>


            <button class="btn btn-primary" onClick={logout}>Logout</button>
        </div>
    );
};