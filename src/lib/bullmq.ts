// lib/queue.ts
import { Queue } from "bullmq";
import { redis } from "./redis";
import { QueueEvents } from "bullmq";

export type WaitingListPayload = {
  id: number;
  name: string;
  size: number;
};

// Create a new BullMQ queue for the restaurant reservations
export const waitingList = new Queue("waitingList", {
  connection: redis,
});

const queueEvents = new QueueEvents("waitingList", { connection: redis });

queueEvents.on("waiting", ({ jobId }) => {
  console.log(`A job with ID ${jobId} is waiting`);
});

queueEvents.on("active", ({ jobId, prev }) => {
  console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});

queueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(`${jobId} has completed and returned ${returnvalue}`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`${jobId} has failed with reason ${failedReason}`);
});
