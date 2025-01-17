import { getDoc, getDocs } from 'firebase/firestore';

export const unpackItemRef = async (itemRef) => {
    try {
        const snap = await getDoc(itemRef);
        return snap.exists() ? { ...snap.data(), id: itemRef.id } : null;
    } catch (err) {
        console.error(err);
    }
};

export const unpackItemRefs = async (itemRefs) => {
    try {
        const promises = itemRefs.map(itemRef => unpackItemRef(itemRef));
        const resolved = await Promise.all(promises);
        return resolved.filter(r => r !== null);
    } catch (err) {
        console.error(err);
    }
};

export const unpackCollectionRef = async (collectionRef) => {
    try {
        const snaps = await getDocs(collectionRef);
        return snaps.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
    } catch (err) {
        console.error(err);
    }
};