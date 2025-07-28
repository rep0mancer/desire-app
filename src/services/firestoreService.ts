import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const db = getFirestore();

export const desireCollection = collection(db, 'desires');

export function createDesire(data: any) {
  return addDoc(desireCollection, data);
}

export function fetchDesires() {
  return getDocs(desireCollection);
}

export function updateDesire(id: string, data: Partial<any>) {
  return updateDoc(doc(db, 'desires', id), data);
}

export function deleteDesire(id: string) {
  return deleteDoc(doc(db, 'desires', id));
}
