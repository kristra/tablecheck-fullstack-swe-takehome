// lib/worker.ts
import { Worker } from "bullmq";
import { redis } from "../lib/redis";
import prisma from "../lib/prisma";
import { WaitingListPayload } from "../lib/bullmq";

const MAX_TABLE = 10;
const AVAILABLE_TABLE = "AVAILABLE_TABLE";

// Worker that processes the restaurant queue
const waitingListWorker = new Worker(
  "waitingList",
  async (job) => {
    // process 'ready' customer
    // reduce seats
    const { id, name, size }: WaitingListPayload = job.data;

    console.log(`Serving ${id} ${name} with a party of ${size}`);

    // Simulate serving a customer by waiting for 3 seconds
    const processingTime = 3000 * size;
    await new Promise((resolve) => setTimeout(resolve, processingTime));

    // send customer home, change status to 'served'
    // restore seats
    try {
      await prisma.queue.update({
        data: { status: 3 },
        where: { id },
      });
    } catch (error) {
      // do nothing
      console.log(`Reservations ${id} not found`);
    }

    // check next reservation
    console.log(`Done serving ${name}`);

    return `Served ${name}`;
  },
  {
    concurrency: 1,
    connection: redis,
    limiter: {
      max: MAX_TABLE,
      duration: 1000,
    },
  }
);

const addToWaitingList = async (name, size) => {
  let availableTable = (await redis.get("availableTable")) || MAX_TABLE;

  if (availableTable >= size) {
    console.log(`Serving ${name} with party size of ${size}`);
    await redis.set("availableTable", availableTable - size);
  }
};

// Optionally, add a scheduler to handle retries and delayed jobs
// new QueueScheduler("restaurantQueue", {
//   connection: redis,
// });

export { waitingListWorker };
