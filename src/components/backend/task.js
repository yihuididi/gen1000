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

export const createNewTask = async (organizationId, name, description, deadline, assignee, prerequisite) => {
    if (
        typeof organizationId !== 'string' || typeof name !== 'string'
        || typeof description !== 'string' || !(deadline instanceof Date)
        || !Array.isArray(assignee) || !assignee.every(a => typeof a === 'string')
        || !Array.isArray(prerequisite) || !prerequisite.every(p => typeof p === 'string')
    ) {
        console.error('Invalid type(s) passed to createNewTask.\n'
            + 'Expected: organizationId (string), name (string), description (string), deadline (Date), '
            + 'assignee (array of string), prerequisite (array of string)');
        return;
    }

    try {
        const taskCollectionRef = collection(db, 'Organization', organizationId, 'Task');
        const taskRef = await addDoc(taskCollectionRef, {
            name: name,
            description: description,
            deadline: deadline,
            assignee: assignee,
            prerequisite: prerequisite
        });
        return await getDoc(taskRef).then(ref => ({
            ...ref.data(),
            'id': ref.id
        }));
    } catch (err) {
        console.error(err);
    }
};

export const updateTaskName = async (organizationId, taskId, name) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string'
        || typeof name !== 'string') {
        console.error('Invalid type passed to updateTaskName.\n'
            + 'Expected: organizationId (string), taskId (string), name (string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);
        await updateDoc(taskRef, {
            'name': name
        });
    } catch (err) {
        console.error(err);
    }
};

export const updateTaskDescription = async (organizationId, taskId, description) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string'
        || typeof description !== 'string') {
        console.error('Invalid type passed to updateTaskDescription.\n'
            + 'Expected: organizationId (string), taskId (string), description (string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);
        await updateDoc(taskRef, {
            'description': description
        });
    } catch (err) {
        console.error(err);
    }
};

export const updateTaskDeadline = async (organizationId, taskId, deadline) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string'
        || !(deadline instanceof Date)) {
        console.error('Invalid type passed to updateTaskDeadline.\n'
            + 'Expected: organizationId (string), taskId (string), deadline (Date)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);
        await updateDoc(taskRef, {
            'deadline': deadline
        });
    } catch (err) {
        console.error(err);
    }
};

export const updateTaskStatus = async (organizationId, taskId, status) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string'
        || typeof description !== 'string') {
        console.error('Invalid type passed to updateTaskStatus.\n'
            + 'Expected: organizationId (string), taskId (string), status (string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);
        await updateDoc(taskRef, {
            'status': status
        });
    } catch (err) {
        console.error(err);
    }
};

export const addTaskPrerequisite = async (organizationId, taskId, prerequisite) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string'
        || !Array.isArray(prerequisite) || !prerequisite.every(p => typeof p === 'string')) {
        console.error('Invalid type passed to addTaskPrerequisite.\n'
            + 'Expected: organizationId (string), taskId (string), prerequisite (array of string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);
        prerequisite.forEach(async prereq => {
            const ref = doc(db, 'Task', prereq);
            await updateDoc(taskRef, {
                prerequisite: arrayUnion(ref)
            });
        });
    } catch (err) {
        console.error(err);
    }
};

export const removeTaskPrerequisite = async (organizationId, taskId, prerequisite) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string'
        || !Array.isArray(prerequisite) || !prerequisite.every(p => typeof p === 'string')) {
        console.error('Invalid type passed to removeTaskPrerequisite.\n'
            + 'Expected: organizationId (string), taskId (string), prerequisite (array of string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);
        prerequisite.forEach(async prereq => {
            const ref = doc(db, 'Task', prereq);
            await updateDoc(taskRef, {
                prerequisite: arrayRemove(ref)
            });
        });
    } catch (err) {
        console.error(err);
    }
};

export const addTaskAssignee = async (organizationId, taskId, assignee) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string'
        || !Array.isArray(assignee) || !assignee.every(p => typeof p === 'string')) {
        console.error('Invalid type passed to addTaskAssignee.\n'
            + 'Expected: organizationId (string), taskId (string), assignee (array of string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);
        assignee.forEach(async userId => {
            const ref = doc(db, 'Task', userId);
            await updateDoc(taskRef, {
                assignee: arrayUnion(ref)
            });
        });
    } catch (err) {
        console.error(err);
    }
};

export const removeTaskAssignee = async (organizationId, taskId, assignee) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string'
        || !Array.isArray(assignee) || !assignee.every(p => typeof p === 'string')) {
        console.error('Invalid type passed to removeTaskAssignee.\n'
            + 'Expected: organizationId (string), taskId (string), assignee (array of string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);
        assignee.forEach(async userId => {
            const ref = doc(db, 'Task', userId);
            await updateDoc(taskRef, {
                assignee: arrayRemove(ref)
            });
        });
    } catch (err) {
        console.error(err);
    }
};
