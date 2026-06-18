import { Queue } from 'bullmq';
import { redis } from './redis';

export const aiQueue = new Queue('ai-generation', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: true,
    removeOnFail: false, // keep failed jobs for inspection
  },
});

export const webhookQueue = new Queue('webhook-processing', {
  connection: redis,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: true,
  },
});

export async function enqueueAIGeneration(goal: string, userId: string) {
  const job = await aiQueue.add('generate', { goal, userId });
  return job.id;
}

export async function enqueueWebhookEvent(event: any) {
  const job = await webhookQueue.add('process', { event });
  return job.id;
}