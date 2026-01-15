/**
 * authentication store with svelte stores
 * manages user auth state and sign in/out
 * @module stores/auth
 */

import { writable } from 'svelte/store';
import { auth, googleProvider } from '@stores/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

// create writable stores
const user = writable(null);
const loading = writable(true);
const error = writable(null);

// listen to auth state changes
const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  user.set(currentUser);
  loading.set(false);
}, (err) => {
  console.error('auth state error:', err);
  error.set(err.message);
  loading.set(false);
});

/**
 * sign in with google
 * @returns {Promise<void>}
 */
async function signInWithGoogle() {
  loading.set(true);
  error.set(null);

  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error('sign in error:', err);
    error.set(err.message);
    throw err;
  } finally {
    loading.set(false);
  }
}

/**
 * sign out current user
 * @returns {Promise<void>}
 */
async function signOutUser() {
  loading.set(true);
  error.set(null);

  try {
    await signOut(auth);
  } catch (err) {
    console.error('sign out error:', err);
    error.set(err.message);
    throw err;
  } finally {
    loading.set(false);
  }
}

/**
 * cleanup auth listener
 */
function cleanupAuth() {
  unsubscribe();
}

// export all stores and functions
export { user, loading, error, signInWithGoogle, signOutUser, cleanupAuth };
