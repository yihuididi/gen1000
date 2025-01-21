import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    updateDoc
} from 'firebase/firestore';
import { db } from '../../firebase-config';
import { unpackItemRefs } from './general';

const getTaskData = async (ref) => {
    try {
        return await getDoc(ref).then(async snap => {
            const data = snap.data();
            return {
                ...data,
                assignee: await unpackItemRefs(data.assignee),
                prerequisite: await unpackItemRefs(data.prerequisite),
                id: snap.id
            };
        });
    } catch (err) {
        console.error(err);
    }
};

export const createNewTask = async (organizationId, name, description, deadline, status, assignee, prerequisite) => {
    if (
        typeof organizationId !== 'string' || typeof name !== 'string'
        || typeof description !== 'string' || !(deadline instanceof Date)
        || !Number.isInteger(status) || status < 0 || status > 2
        || !Array.isArray(assignee) || !assignee.every(a => typeof a === 'string')
        || !Array.isArray(prerequisite) || !prerequisite.every(p => typeof p === 'string')
    ) {
        console.error('Invalid type(s) passed to createNewTask.\n'
            + 'Expected: organizationId (string), name (string), description (string), deadline (Date), '
            + 'statys (integer between 0 and 2 inclusive), assignee (array of string), prerequisite (array of string)');
        return;
    }

    try {
        // Create Task
        const taskCollectionRef = collection(db, 'Organization', organizationId, 'Task');
        const taskRef = await addDoc(taskCollectionRef, {
            name: name,
            description: description,
            deadline: deadline,
            assignee: [],
            prerequisite: [],
            status: status
        });

        // Add each assignee and prerequisite to Task as a reference object
        assignee.forEach(async userId => {
            const ref = doc(db, 'User', userId);
            await updateDoc(taskRef, {
                assignee: arrayUnion(ref)
            });
        });
        prerequisite.forEach(async taskId => {
            const ref = doc(db, 'Organization', organizationId, 'Task', taskId);
            await updateDoc(taskRef, {
                prerequisite: arrayUnion(ref)
            });
        });

        // Return the Task data
        return await getTaskData(taskRef);
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
            name: name
        });

        return await getTaskData(taskRef);
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
            description: description
        });

        return await getTaskData(taskRef);
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
            deadline: deadline
        });

        return await getTaskData(taskRef);
    } catch (err) {
        console.error(err);
    }
};

export const updateTaskStatus = async (organizationId, taskId, status) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string'
        || !Number.isInteger(status) || status < 0 || status > 2) {
        console.error('Invalid type passed to updateTaskStatus.\n'
            + 'Expected: organizationId (string), taskId (string), status (integer between 0 and 2 inclusive)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);
        await updateDoc(taskRef, {
            status: status
        });

        return await getTaskData(taskRef);
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
            const ref = doc(db, 'Organization', organizationId, 'Task', prereq);
            await updateDoc(taskRef, {
                prerequisite: arrayUnion(ref)
            });
        });

        return await getTaskData(taskRef);
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
            const ref = doc(db, 'Organization', organizationId, 'Task', prereq);
            await updateDoc(taskRef, {
                prerequisite: arrayRemove(ref)
            });
        });

        return await getTaskData(taskRef);
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
            const ref = doc(db, 'User', userId);
            await updateDoc(taskRef, {
                assignee: arrayUnion(ref)
            });
        });

        return await getTaskData(taskRef);
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
            const ref = doc(db, 'User', userId);
            await updateDoc(taskRef, {
                assignee: arrayRemove(ref)
            });
        });

        return await getTaskData(taskRef);
    } catch (err) {
        console.error(err);
    }
};

export const deleteTask = async (organizationId, taskId) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string') {
        console.error('Invalid type passed to deleteTask.\n'
            + 'Expected: organizationId (string), taskId (string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);
        await deleteDoc(taskRef);
    } catch (err) {
        console.error(err);
    }
};