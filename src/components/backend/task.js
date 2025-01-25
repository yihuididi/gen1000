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
                assignees: await unpackItemRefs(data.assignees),
                prerequisites: await unpackItemRefs(data.prerequisites),
                id: snap.id
            };
        });
    } catch (err) {
        console.error(err);
    }
};

export const createNewTask = async (organizationId, name, description, deadline, status, assignees, prerequisites) => {
    if (
        typeof organizationId !== 'string' || typeof name !== 'string'
        || typeof description !== 'string' || !(deadline instanceof Date)
        || !Number.isInteger(status) || status < 0 || status > 2
        || !Array.isArray(assignees) || !assignees.every(a => typeof a === 'string')
        || !Array.isArray(prerequisites) || !prerequisites.every(p => typeof p === 'string')
    ) {
        console.error('Invalid type(s) passed to createNewTask.\n'
            + 'Expected: organizationId (string), name (string), description (string), deadline (Date), '
            + 'statys (integer between 0 and 2 inclusive), assignees (array of string), prerequisites (array of string)');
        return;
    }

    try {
        // Create Task
        const taskCollectionRef = collection(db, 'Organization', organizationId, 'Task');
        const taskRef = await addDoc(taskCollectionRef, {
            name: name,
            description: description,
            deadline: deadline,
            assignees: [],
            prerequisites: [],
            status: status
        });

        // Add each assignees and prerequisites to Task as a reference object
        assignees.forEach(async userId => {
            const ref = doc(db, 'User', userId);
            await updateDoc(taskRef, {
                assignees: arrayUnion(ref)
            });
        });
        prerequisites.forEach(async taskId => {
            const ref = doc(db, 'Organization', organizationId, 'Task', taskId);
            await updateDoc(taskRef, {
                prerequisites: arrayUnion(ref)
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

export const addTaskPrerequisites = async (organizationId, taskId, prerequisites) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string'
        || !Array.isArray(prerequisites) || !prerequisites.every(p => typeof p === 'string')) {
        console.error('Invalid type passed to addTaskPrerequisites.\n'
            + 'Expected: organizationId (string), taskId (string), prerequisites (array of string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);
        prerequisites.forEach(async prereq => {
            const ref = doc(db, 'Organization', organizationId, 'Task', prereq);
            await updateDoc(taskRef, {
                prerequisites: arrayUnion(ref)
            });
        });

        return await getTaskData(taskRef);
    } catch (err) {
        console.error(err);
    }
};

export const removeTaskPrerequisites = async (organizationId, taskId, prerequisites) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string'
        || !Array.isArray(prerequisites) || !prerequisites.every(p => typeof p === 'string')) {
        console.error('Invalid type passed to removeTaskPrerequisites.\n'
            + 'Expected: organizationId (string), taskId (string), prerequisites (array of string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);
        prerequisites.forEach(async prereq => {
            const ref = doc(db, 'Organization', organizationId, 'Task', prereq);
            await updateDoc(taskRef, {
                prerequisites: arrayRemove(ref)
            });
        });

        return await getTaskData(taskRef);
    } catch (err) {
        console.error(err);
    }
};

export const addTaskAssignees = async (organizationId, taskId, assignees) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string'
        || !Array.isArray(assignees) || !assignees.every(p => typeof p === 'string')) {
        console.error('Invalid type passed to addTaskAssignees.\n'
            + 'Expected: organizationId (string), taskId (string), assignees (array of string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);
        assignees.forEach(async userId => {
            const ref = doc(db, 'User', userId);
            await updateDoc(taskRef, {
                assignees: arrayUnion(ref)
            });
        });

        return await getTaskData(taskRef);
    } catch (err) {
        console.error(err);
    }
};

export const removeTaskAssignees = async (organizationId, taskId, assignees) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string'
        || !Array.isArray(assignees) || !assignees.every(p => typeof p === 'string')) {
        console.error('Invalid type passed to removeTaskAssignees.\n'
            + 'Expected: organizationId (string), taskId (string), assignees (array of string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);
        assignees.forEach(async userId => {
            const ref = doc(db, 'User', userId);
            await updateDoc(taskRef, {
                assignees: arrayRemove(ref)
            });
        });

        return await getTaskData(taskRef);
    } catch (err) {
        console.error(err);
    }
};

export const updateTaskAssignees = async (organizationId, taskId, assignees) => {
    if (typeof organizationId !== 'string' || typeof taskId !== 'string'
        || !Array.isArray(assignees) || !assignees.every(p => typeof p === 'string')) {
        console.error('Invalid type passed to updateTaskAssignees.\n'
            + 'Expected: organizationId (string), taskId (string), assignees (array of string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Organization', organizationId, 'Task', taskId);

        // Empty assignees array first
        await updateDoc(taskRef, {
            assignees: []
        })

        assignees.forEach(async userId => {
            const ref = doc(db, 'User', userId);
            await updateDoc(taskRef, {
                assignees: arrayUnion(ref)
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