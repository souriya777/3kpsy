/**
 * metrics store with svelte stores
 * manages daily metrics state and firebase sync
 * @module stores/metrics
 */

import { writable, get } from 'svelte/store';
import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '@stores/firebase';

/**
 * @typedef {Object} DailyMetrics
 * @property {number} deepWork - hours of deep work (0-24)
 * @property {number} deepWorkGoal - current deep work goal
 * @property {string} wakeUp - wake up time (HH:mm)
 * @property {string} sleep - sleep time (HH:mm)
 * @property {boolean} nap - had a nap today
 * @property {string} wakeUpGoal - target wake up time
 * @property {string} timestamp - ISO8601 timestamp
 */

/**
 * @typedef {Object} ProjectsMetrics
 * @property {number} completed - number of completed projects
 * @property {number} inProgress - number of projects in progress
 * @property {number} tsBarnum - ts-barnum progress (0-100) - global project value
 */

// create writable stores
const dailyMetrics = writable({
  deepWork: 0,
  deepWorkGoal: 1, // start with 1h goal
  wakeUp: '07:00',
  sleep: '23:00',
  nap: false,
  wakeUpGoal: '05:30',
  timestamp: new Date().toISOString()
});

const projectsMetrics = writable({
  completed: 0,
  inProgress: 0,
  tsBarnum: 0
});

const roadmap = writable([]);

/**
 * get current date in YYYY-MM-DD format
 * @returns {string} date string
 */
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * get user id from auth
 * @returns {string|null} user id or null if not authenticated
 */
function getUserId() {
  return auth.currentUser?.uid || null;
}

/**
 * save daily metrics to firestore
 * @param {string} date - date in YYYY-MM-DD format
 * @returns {Promise<void>}
 */
async function saveDailyMetrics(date = getCurrentDate()) {
  const userId = getUserId();
  if (!userId) {
    console.warn('Cannot save metrics: user not authenticated');
    return;
  }

  try {
    const docRef = doc(db, `users/${userId}/daily/${date}`);
    const currentMetrics = get(dailyMetrics);
    await setDoc(docRef, {
      ...currentMetrics,
      timestamp: new Date().toISOString()
    }, { merge: true });
    console.log('Daily metrics saved successfully');
  } catch (error) {
    console.error('Failed to save daily metrics:', error);
    throw error;
  }
}

/**
 * load daily metrics from firestore
 * @param {string} date - date in YYYY-MM-DD format
 * @returns {Promise<void>}
 */
async function loadDailyMetrics(date = getCurrentDate()) {
  const userId = getUserId();
  if (!userId) {
    console.warn('Cannot load metrics: user not authenticated');
    return;
  }

  try {
    const docRef = doc(db, `users/${userId}/daily/${date}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = /** @type {DailyMetrics} */ (docSnap.data());
      // update reactive state
      dailyMetrics.set(data);
      console.log('Daily metrics loaded successfully');
    } else {
      console.log('No metrics found for this date, using defaults');
    }
  } catch (error) {
    console.error('Failed to load daily metrics:', error);
    throw error;
  }
}

/**
 * save projects metrics to firestore
 * @returns {Promise<void>}
 */
async function saveProjectsMetrics() {
  const userId = getUserId();
  if (!userId) {
    console.warn('Cannot save projects: user not authenticated');
    return;
  }

  try {
    const docRef = doc(db, `users/${userId}/projects/current`);
    const currentProjects = get(projectsMetrics);
    await setDoc(docRef, currentProjects);
    console.log('Projects metrics saved successfully');
  } catch (error) {
    console.error('Failed to save projects metrics:', error);
    throw error;
  }
}

/**
 * load projects metrics from firestore
 * @returns {Promise<void>}
 */
async function loadProjectsMetrics() {
  const userId = getUserId();
  if (!userId) {
    console.warn('Cannot load projects: user not authenticated');
    return;
  }

  try {
    const docRef = doc(db, `users/${userId}/projects/current`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = /** @type {ProjectsMetrics} */ (docSnap.data());
      projectsMetrics.set(data);
      console.log('Projects metrics loaded successfully');
    }
  } catch (error) {
    console.error('Failed to load projects metrics:', error);
    throw error;
  }
}

/**
 * get last 7 days of metrics for charts
 * @returns {Promise<Array<DailyMetrics>>}
 */
async function getLast7DaysMetrics() {
  const userId = getUserId();
  if (!userId) {
    console.warn('Cannot get metrics: user not authenticated');
    return [];
  }

  try {
    const q = query(
      collection(db, `users/${userId}/daily`),
      orderBy('timestamp', 'desc'),
      limit(7)
    );

    const querySnapshot = await getDocs(q);
    const metrics = [];

    querySnapshot.forEach((doc) => {
      metrics.push({ id: doc.id, ...doc.data() });
    });

    return metrics.reverse(); // oldest to newest for charts
  } catch (error) {
    console.error('Failed to get last 7 days metrics:', error);
    return [];
  }
}

/**
 * save roadmap to firestore
 * @returns {Promise<void>}
 */
async function saveRoadmap() {
  const userId = getUserId();
  if (!userId) {
    console.warn('Cannot save roadmap: user not authenticated');
    return;
  }

  try {
    const docRef = doc(db, `users/${userId}/roadmap/tsBarnum`);
    const currentRoadmap = get(roadmap);
    await setDoc(docRef, { milestones: currentRoadmap });
    console.log('Roadmap saved successfully');
  } catch (error) {
    console.error('Failed to save roadmap:', error);
    throw error;
  }
}

/**
 * load roadmap from firestore
 * @returns {Promise<void>}
 */
async function loadRoadmap() {
  const userId = getUserId();
  if (!userId) {
    console.warn('Cannot load roadmap: user not authenticated');
    return;
  }

  try {
    const docRef = doc(db, `users/${userId}/roadmap/tsBarnum`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      roadmap.set(data.milestones || []);
      console.log('Roadmap loaded successfully');
    }
  } catch (error) {
    console.error('Failed to load roadmap:', error);
    throw error;
  }
}

// export all stores and functions
export {
  dailyMetrics,
  projectsMetrics,
  roadmap,
  saveDailyMetrics,
  loadDailyMetrics,
  saveProjectsMetrics,
  loadProjectsMetrics,
  getLast7DaysMetrics,
  saveRoadmap,
  loadRoadmap
};
