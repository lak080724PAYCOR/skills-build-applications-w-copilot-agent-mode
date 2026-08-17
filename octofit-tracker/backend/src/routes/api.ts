import { Router } from 'express';
import { octofitService } from '../services/octofitService';

const router = Router();

router.get('/health', async (_request, response) => {
  response.json({ status: 'ok' });
});

router.get('/bootstrap', async (_request, response, next) => {
  try {
    response.json(await octofitService.getDashboardData());
  } catch (error) {
    next(error);
  }
});

router.post('/users', async (request, response, next) => {
  try {
    const user = await octofitService.createUser(request.body);
    response.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/activities', async (request, response, next) => {
  try {
    const activity = await octofitService.logActivity({
      ...request.body,
      durationMinutes: Number(request.body.durationMinutes),
      distanceKm: Number(request.body.distanceKm ?? 0),
    });
    response.status(201).json(activity);
  } catch (error) {
    next(error);
  }
});

router.post('/teams', async (request, response, next) => {
  try {
    const team = await octofitService.createTeam({
      ...request.body,
      teacherIds: Array.isArray(request.body.teacherIds) ? request.body.teacherIds : [],
    });
    response.status(201).json(team);
  } catch (error) {
    next(error);
  }
});

router.post('/teams/:teamId/join', async (request, response, next) => {
  try {
    const team = await octofitService.joinTeam(request.params.teamId, request.body.userId);
    response.json(team);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:userId/workout-suggestions', async (request, response, next) => {
  try {
    response.json(await octofitService.getWorkoutSuggestionsForUser(request.params.userId));
  } catch (error) {
    next(error);
  }
});

export default router;
