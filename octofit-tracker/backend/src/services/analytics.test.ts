import assert from 'node:assert/strict';
import test from 'node:test';
import { cloneSeedStore } from '../data/seedData';
import {
  buildIndividualLeaderboard,
  buildWorkoutSuggestions,
  getUserTotalPoints,
} from './analytics';

test('leaderboard ranks seeded students by points', () => {
  const store = cloneSeedStore();
  const leaderboard = buildIndividualLeaderboard(store.users, store.activities);

  assert.equal(leaderboard[0].name, 'Ethan Brooks');
  assert.equal(leaderboard[0].points, getUserTotalPoints('user-ethan', store.activities));
  assert.equal(leaderboard[0].rank, 1);
});

test('low-activity students receive starter workout suggestions', () => {
  const store = cloneSeedStore();
  const lila = store.users.find((user) => user.id === 'user-lila');

  assert.ok(lila);

  const suggestions = buildWorkoutSuggestions(
    lila,
    store.activities.filter((activity) => activity.userId === 'user-lila'),
  );

  assert.equal(suggestions[0]?.title, 'Starter cardio circuit');
  assert.equal(suggestions[0]?.intensity, 'light');
});
