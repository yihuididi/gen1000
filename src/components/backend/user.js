import {
    collection,
    doc
} from 'firebase/firestore';
import { db } from '../../firebase-config';
import { unpackCollectionRef, unpackItemRef, unpackItemRefs } from './general';

export const getUserOrganizations = async (user) => {
    if (typeof user !== 'string') {
        console.error('Invalid type(s) passed to getUserOrganizations.\n'
            + 'Expected: user (string)');
        return;
    }

    try {
        const organizations = await unpackCollectionRef(collection(db, 'Organization'));
        const promises = Promise.all(organizations.map(async organization => ({
                ...organization,
                members: await unpackItemRefs(organization.members)
            })));
        const resolved = await promises;
        return resolved.filter(organization => organization.members.map(member => member.id).includes(user));
    } catch (err) {
        console.error(err);
    }
};

export const getAllUsers = async () => {
    try {
        return await unpackCollectionRef(collection(db, 'User'));
    } catch (err) {
        console.error(err);
    }
};

export const getUser = async (user) => {
    if (typeof user !== 'string') {
        console.error('Invalid type(s) passed to getUser.\n'
            + 'Expected: user (string)');
        return;
    }

    try {
        return await unpackItemRef(doc(db, 'User', user));
    } catch (err) {
        console.error(err);
    }
};