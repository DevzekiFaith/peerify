import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function fetchUserSessions(userId: string, role: 'tutor' | 'student') {
  const field = role === 'tutor' ? 'tutorId' : 'studentId';
  const sessionsQuery = query(
    collection(db, 'sessions'),
    where(field, '==', userId)
  );
  const snapshot = await getDocs(sessionsQuery);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function fetchDocuments(filters?: {
  userId?: string;
  category?: string;
  searchTerm?: string;
}) {
  let docsQuery = collection(db, 'documents');
  
  if (filters?.userId) {
    docsQuery = query(docsQuery, where('userId', '==', filters.userId));
  }
  
  const snapshot = await getDocs(docsQuery);
  let documents = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  if (filters?.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    documents = documents.filter(doc => 
      doc.title.toLowerCase().includes(term) ||
      doc.description.toLowerCase().includes(term) ||
      doc.tags.some((tag: string) => tag.toLowerCase().includes(term))
    );
  }

  if (filters?.category) {
    documents = documents.filter(doc => 
      doc.category.toLowerCase() === filters.category.toLowerCase()
    );
  }

  return documents;
}

export async function calculateEarnings(sessions: DocumentData[]) {
  return sessions
    .filter(session => session.status === 'completed')
    .reduce((sum, session) => sum + session.price, 0);
}