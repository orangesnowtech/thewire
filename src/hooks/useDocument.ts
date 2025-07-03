import { useState, useEffect } from 'react';
import { doc, onSnapshot, DocumentReference, DocumentData } from 'firebase/firestore';

interface UseDocumentResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useDocument<T = DocumentData>(
  docRef: DocumentReference
): UseDocumentResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docRef) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        setLoading(false);
        setError(null);
        
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as T);
        } else {
          setData(null);
        }
      },
      (err) => {
        setLoading(false);
        setError(err);
        console.error('Error fetching document:', err);
      }
    );

    return () => unsubscribe();
  }, [docRef]);

  return { data, loading, error };
}
