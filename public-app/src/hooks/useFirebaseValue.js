// src/hooks/useFirebaseValue.js
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

/**
 * Hook to subscribe to a Firebase Realtime Database path.
 * Returns the current value and a loading flag.
 * Automatically falls back to /envisence/nodes if /envisence/live/sensors returns null.
 */
export const useFirebaseValue = (path) => {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dataRef = ref(db, path);
    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val === null && path === '/envisence/live/sensors') {
          const nodesRef = ref(db, '/envisence/nodes');
          onValue(
            nodesRef,
            (nodesSnap) => {
              const nodesData = nodesSnap.val();
              if (nodesData && typeof nodesData === 'object') {
                const firstNodeKey = Object.keys(nodesData)[0];
                if (firstNodeKey && nodesData[firstNodeKey]?.sensors) {
                  setValue(nodesData[firstNodeKey].sensors);
                  setLoading(false);
                  return;
                }
              }
              setValue(null);
              setLoading(false);
            },
            { onlyOnce: true }
          );
        } else {
          setValue(val);
          setLoading(false);
        }
      },
      (error) => {
        console.error('Firebase read error:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [path]);

  return { value, loading };
};
