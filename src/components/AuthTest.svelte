<script>
  /**
   * firebase authentication test component
   * tests google sign-in and displays user info
   * @component
   * @temporary - remove after testing
   */

  import { auth, googleProvider, db } from '@stores/firebase';
  import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
  import { doc, setDoc, getDoc } from 'firebase/firestore';

  let user = $state(null);
  let error = $state(null);
  let loading = $state(false);
  let firestoreResult = $state(null);

  // listen to auth state changes
  $effect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      user = currentUser;
      console.log('auth state changed:', currentUser);
    });

    return () => unsubscribe();
  });

  // sign in with google
  async function handleSignIn() {
    loading = true;
    error = null;

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('signed in successfully:', result.user);
    } catch (err) {
      console.error('sign in error:', err);
      error = err.message;
    } finally {
      loading = false;
    }
  }

  // sign out
  async function handleSignOut() {
    loading = true;
    error = null;

    try {
      await signOut(auth);
      console.log('signed out successfully');
    } catch (err) {
      console.error('sign out error:', err);
      error = err.message;
    } finally {
      loading = false;
    }
  }

  // test firestore write & read
  async function testFirestore() {
    if (!user) {
      error = 'Please sign in first';
      return;
    }

    loading = true;
    error = null;
    firestoreResult = null;

    try {
      const testData = {
        deepWork: 2.5,
        deepWorkGoal: 3,
        wakeUp: '07:00',
        sleep: '23:00',
        nap: true,
        timestamp: new Date().toISOString()
      };

      // write to firestore
      const docRef = doc(db, `users/${user.uid}/daily/2026-01-12`);
      await setDoc(docRef, testData);
      console.log('firestore write successful:', testData);

      // read from firestore
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('firestore read successful:', data);
        firestoreResult = '✅ Firestore write & read successful! Check console for data.';
      }
    } catch (err) {
      console.error('firestore test error:', err);
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-test">
  <h2>🔥 Firebase Auth Test</h2>

  {#if loading}
    <p class="loading">Loading...</p>
  {/if}

  {#if error}
    <p class="error">Error: {error}</p>
  {/if}

  {#if user}
    <div class="user-info">
      <img src={user.photoURL} alt={user.displayName} class="avatar" />
      <h3>Welcome, {user.displayName}!</h3>
      <p class="email">{user.email}</p>

      {#if firestoreResult}
        <p class="success">{firestoreResult}</p>
      {/if}

      <div class="button-group">
        <button class="btn btn--primary" onclick={testFirestore} disabled={loading}>
          Test Firestore
        </button>
        <button class="btn btn--danger" onclick={handleSignOut} disabled={loading}>
          Sign Out
        </button>
      </div>
    </div>
  {:else}
    <div class="sign-in">
      <p>Sign in to test Firebase authentication</p>
      <button class="btn btn--primary" onclick={handleSignIn} disabled={loading}>
        Sign In with Google
      </button>
    </div>
  {/if}
</div>

<style lang="scss">
  .auth-test {
    max-width: 40rem;
    margin: var(--space-32) auto;
    padding: var(--space-24);
    background: rgba(var(--color-white-rgb), 0.05);
    border: var(--border-width-thin) solid var(--color-border);
    border-radius: var(--border-radius-large);
    text-align: center;

    h2 {
      margin-block-end: var(--space-24);
      font-size: var(--font-size-h2);
    }

    .loading {
      color: var(--color-accent);
      font-size: var(--font-size-s);
    }

    .error {
      color: var(--color-error);
      padding: var(--space-12);
      background: rgba(244, 67, 54, 0.1);
      border-radius: var(--border-radius-medium);
      font-size: var(--font-size-xs);
      margin-block-end: var(--space-16);
    }

    .success {
      color: var(--color-success);
      padding: var(--space-12);
      background: var(--color-success-bg);
      border-radius: var(--border-radius-medium);
      font-size: var(--font-size-xs);
      margin-block-end: var(--space-16);
    }

    .user-info {
      .avatar {
        width: 8rem;
        height: 8rem;
        border-radius: var(--border-radius-circle);
        margin: 0 auto var(--space-16);
        border: 2px solid var(--color-accent);
      }

      h3 {
        margin-block-end: var(--space-8);
        font-size: var(--font-size-l);
      }

      .email {
        color: rgba(var(--color-white-rgb), 0.6);
        font-size: var(--font-size-xs);
        margin-block-end: var(--space-16);
      }
    }

    .button-group {
      display: flex;
      gap: var(--space-12);
      flex-wrap: wrap;

      .btn {
        flex: 1;
        min-width: 12rem;
      }
    }

    .sign-in {
      p {
        margin-block-end: var(--space-16);
        color: rgba(var(--color-white-rgb), 0.8);
      }
    }
  }

  .btn {
    padding: var(--space-12) var(--space-24);
    border-radius: var(--border-radius-medium);
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-fast) var(--easing-default);
    border: var(--border-width-thin) solid transparent;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--primary {
      background: var(--color-accent);
      color: var(--color-text);

      &:hover:not(:disabled) {
        background: var(--color-accent);
        transform: scale(1.05);
        box-shadow: var(--shadow-medium);
      }
    }

    &--danger {
      background: transparent;
      border-color: var(--color-error);
      color: var(--color-error);

      &:hover:not(:disabled) {
        background: rgba(244, 67, 54, 0.1);
      }
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  }
</style>
