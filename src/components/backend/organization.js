import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../../firebase-config';
import { unpackCollectionRef, unpackItemRefs } from './general';

import forest from '../../static/images/wallpaper/forest.jpeg';
import lake from '../../static/images/wallpaper/lake.jpeg';
import lake2 from '../../static/images/wallpaper/lake2.jpeg';
import mountain from '../../static/images/wallpaper/mountain.jpeg';
import mountain2 from '../../static/images/wallpaper/mountain2.jpeg';
import sunrise from '../../static/images/wallpaper/sunrise.jpeg';

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

export const getTasks = async (organizationId) => {
    if (typeof organizationId != 'string') {
        console.error('Invalid type(s) passed to getTasks.\n'
            + 'Expected: organizationId (string)');
        return;
    }

    try {
        const taskCollectionRef = collection(db, 'Organization', organizationId, 'Task');
        return await unpackCollectionRef(taskCollectionRef);
    } catch (err) {
        console.error(err);
    }
}

const getRandomWallpaper = () => {
    const choices = [forest, lake, lake2, mountain, mountain2, sunrise];
    return choices[Math.floor(choices.length * Math.random())];
}

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
            members: [],
            wallpaper: getRandomWallpaper()
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
