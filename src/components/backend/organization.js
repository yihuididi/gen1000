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
import { unpackItemRefs } from './general';

const organizationCollectionRef = collection(db, 'Organization');

const getOrganizationData = async (ref) => {
    try {
        return await getDoc(ref).then(async snap => {
            const data = snap.data()
            return {
                ...data,
                members: await unpackItemRefs(data.members),
                id: snap.id
            };
        });
    } catch (err) {
        console.error(err);
    }
};

export const createNewOrganization = async (name, members) => {
    if (typeof name != 'string' || !Array.isArray(members) || !members.every(m => typeof m === 'string')) {
        console.error('Invalid type(s) passed to createNewOrganization.\n'
            + 'Expected: name (string), members (array of string)');
        return;
    }

    try {
        // Create Organization
        const organizationRef = await addDoc(organizationCollectionRef, {
            name: name,
            members: []
        });

        // Add each member to Organization as a reference object
        members.forEach(async userId => {
            const ref = doc(db, 'User', userId);
            await updateDoc(organizationRef, {
                members: arrayUnion(ref)
            });
        });

        // Return the Organization data
        return await getOrganizationData(organizationRef);
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

        return await getOrganizationData(organizationRef);
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

        return await getOrganizationData(organizationRef);
    } catch (err) {
        console.error(err);
    }
};
