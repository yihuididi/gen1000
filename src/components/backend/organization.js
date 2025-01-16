import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../../firebase-config.js';

const organizationCollectionRef = collection(db, 'Organization');

export const createNewOrganization = async (name, members) => {
    if (typeof name != 'string' || !Array.isArray(members) || !members.every(m => typeof m === 'string')) {
        console.error('Invalid type(s) passed to createNewOrganization.\n'
            + 'Expected: name (string), members (array of string)');
        return;
    }

    try {
        const organizationRef = await addDoc(organizationCollectionRef, {
            name: name,
            members: []
        });
        members.forEach(async userId => {
            const ref = doc(db, 'User', userId);
            await updateDoc(organizationRef, {
                members: arrayUnion(ref)
            });
        });
        return await getDoc(organizationRef).then(ref => ({
            ...ref.data(),
            'id': ref.id
        }))
    } catch (err) {
        console.error(err);
    }
};

export const addMembers = async (organizationId, members) => {
    if (typeof organizationId !== 'string' || !Array.isArray(members) || !members.every(m => typeof m === 'string')) {
        console.error('Invalid type passed to addMembers.\n'
            + 'Expected: organizationId (string), members (array of string)');
        return;
    }

    try {
        const organizationRef = doc(db, 'Organization', organizationId);
        members.forEach(async userId => {
            const ref = doc(db, 'User', userId);
            await updateDoc(organizationRef, {
                members: arrayUnion(ref)
            });
        });
    } catch (err) {
        console.error(err);
    }
};

export const removeMembers = async (organizationId, members) => {
    if (typeof organizationId !== 'string' || !Array.isArray(members) || !members.every(m => typeof m === 'string')) {
        console.error('Invalid type passed to removeMembers.\n'
            + 'Expected: organizationId (string), members (array of string)');
        return;
    }

    try {
        const organizationRef = doc(db, 'Organization', organizationId);
        members.forEach(async userId => {
            const ref = doc(db, 'User', userId);
            await updateDoc(organizationRef, {
                members: arrayRemove(ref)
            });
        });
    } catch (err) {
        console.error(err);
    }
};
