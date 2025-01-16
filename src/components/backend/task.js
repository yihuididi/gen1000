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

const taskCollectionRef = collection(db, 'Task');

export const createNewTask = async (name, description, deadline, assignee, prerequisite) => {
    if (
        typeof name !== 'string' || typeof description !== 'string' || !(deadline instanceof Date)
        || !Array.isArray(assignee) || !assignee.every(a => typeof a === 'string')
        || !Array.isArray(prerequisite) || !prerequisite.every(p => typeof p === 'string')
    ) {
        console.error('Invalid type(s) passed to createNewTask.\n'
            + 'Expected: name (string), description (string), deadline (Date), '
            + 'assignee (array of string), prerequisite (array of string)');
        return;
    }

    try {
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

export const updateTaskName = async (taskId, name) => {
    if (typeof name !== 'string') {
        console.error('Invalid type passed to updateTaskName.\n'
            + 'Expected: taskId (string), name (string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Task', taskId);
        await updateDoc(taskRef, {
            'name': name
        });
    } catch (err) {
        console.error(err);
    }
};

export const updateTaskDescription = async (taskId, description) => {
    if (typeof description !== 'string') {
        console.error('Invalid type passed to updateTaskDescription.\n'
            + 'Expected: taskId (string), description (string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Task', taskId);
        await updateDoc(taskRef, {
            'description': description
        });
    } catch (err) {
        console.error(err);
    }
};

export const updateTaskDeadline = async (taskId, deadline) => {
    if (!(deadline instanceof Date)) {
        console.error('Invalid type passed to updateTaskDeadline.\n'
            + 'Expected: taskId (string), deadline (Date)');
        return;
    }

    try {
        const taskRef = doc(db, 'Task', taskId);
        await updateDoc(taskRef, {
            'deadline': deadline
        });
    } catch (err) {
        console.error(err);
    }
};

export const updateTaskStatus = async (taskId, status) => {
    if (typeof description !== 'string') {
        console.error('Invalid type passed to updateTaskStatus.\n'
            + 'Expected: taskId (string), status (string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Task', taskId);
        await updateDoc(taskRef, {
            'status': status
        });
    } catch (err) {
        console.error(err);
    }
};

export const addTaskPrerequisite = async (taskId, prerequisite) => {
    if (!Array.isArray(prerequisite) || !prerequisite.every(p => typeof p === 'string')) {
        console.error('Invalid type passed to addTaskPrerequisite.\n'
            + 'Expected: taskId (string), prerequisite (array of string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Task', taskId);
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

export const removeTaskPrerequisite = async (taskId, prerequisite) => {
    if (!Array.isArray(prerequisite) || !prerequisite.every(p => typeof p === 'string')) {
        console.error('Invalid type passed to removeTaskPrerequisite.\n'
            + 'Expected: taskId (string), prerequisite (array of string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Task', taskId);
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

export const addTaskAssignee = async (taskId, assignee) => {
    if (!Array.isArray(assignee) || !assignee.every(p => typeof p === 'string')) {
        console.error('Invalid type passed to addTaskAssignee.\n'
            + 'Expected: taskId (string), assignee (array of string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Task', taskId);
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

export const removeTaskAssignee = async (taskId, assignee) => {
    if (!Array.isArray(assignee) || !assignee.every(p => typeof p === 'string')) {
        console.error('Invalid type passed to removeTaskAssignee.\n'
            + 'Expected: taskId (string), assignee (array of string)');
        return;
    }

    try {
        const taskRef = doc(db, 'Task', taskId);
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
