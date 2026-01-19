/**
 * test utilities for metrics store
 * seed test data for development and testing
 * @module stores/metrics.test
 */

import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@stores/firebase';
import { dailyMetrics } from '@stores/metrics';
import { get } from 'svelte/store';

/**
 * get user id from auth
 * @returns {string|null} user id or null if not authenticated
 */
function getUserId() {
  return auth.currentUser?.uid || null;
}

/**
 * seed test data for the last 7 days
 * useful for testing stats and charts
 * @returns {Promise<void>}
 */
async function seedTestData() {
  const userId = getUserId();
  if (!userId) {
    console.error('Cannot seed test data: user not authenticated');
    return;
  }

  console.log('🌱 Seeding test data for last 7 days...');

  // test data for 7 days (realistic values with progression)
  const testData = [
    {
      deepWork: 0.5,
      wakeUp: '07:30',
      sleep: '00:30',
      nap: false
    },
    {
      deepWork: 1.5,
      wakeUp: '06:45',
      sleep: '23:45',
      nap: true
    },
    {
      deepWork: 2.0,
      wakeUp: '06:00',
      sleep: '23:00',
      nap: false
    },
    {
      deepWork: 1.0,
      wakeUp: '07:00',
      sleep: '23:30',
      nap: true
    },
    {
      deepWork: 2.5,
      wakeUp: '05:30',
      sleep: '22:30',
      nap: false
    },
    {
      deepWork: 3.0,
      wakeUp: '05:00',
      sleep: '22:00',
      nap: false
    },
    {
      deepWork: 1.5,
      wakeUp: '06:30',
      sleep: '23:15',
      nap: true
    }
  ];

  try {
    // get dates for last 7 days
    const today = new Date();
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    // save data for each day
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const data = testData[i];

      const docRef = doc(db, `users/${userId}/daily/${date}`);
      await setDoc(docRef, {
        deepWork: data.deepWork,
        deepWorkGoal: 1,
        wakeUp: data.wakeUp,
        sleep: data.sleep,
        nap: data.nap,
        wakeUpGoal: '05:30',
        timestamp: new Date(date).toISOString()
      }, { merge: true });

      console.log(`✅ Seeded data for ${date}`);
    }

    // save global project metrics (tsBarnum is global, not per day)
    const projectsDocRef = doc(db, `users/${userId}/projects/current`);
    await setDoc(projectsDocRef, {
      completed: 0,
      inProgress: 1,
      tsBarnum: 70
    });
    console.log('✅ Seeded projects data (tsBarnum: 70%)');

    console.log('🎉 Test data seeded successfully for 7 days!');
    console.log('📊 You can now check your stats page');

    // reload today's metrics
    const todayDate = new Date().toISOString().split('T')[0];
    const lastDayData = testData[testData.length - 1];
    dailyMetrics.set({
      deepWork: lastDayData.deepWork,
      deepWorkGoal: 1,
      wakeUp: lastDayData.wakeUp,
      sleep: lastDayData.sleep,
      nap: lastDayData.nap,
      wakeUpGoal: '05:30',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Failed to seed test data:', error);
    throw error;
  }
}

export { seedTestData };
