import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  DocumentData
} from 'firebase/firestore';

const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : 'An unknown error occurred';
};

export const createDocument = async (collectionName: string, data: DocumentData) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: getErrorMessage(error) };
  }
};

export const updateDocument = async (collectionName: string, docId: string, data: DocumentData) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const queryDocuments = async (
  collectionName: string,
  field: string,
  operator: any,
  value: any
) => {
  try {
    const q = query(collection(db, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { documents, error: null };
  } catch (error) {
    return { documents: null, error: getErrorMessage(error) };
  }
};