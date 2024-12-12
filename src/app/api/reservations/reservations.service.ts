import prisma from "../../../lib/prisma";
import { getDecryptedSession } from "../auth/session/session.handler";

export const findOrCreateReservation = async (size: number) => {
  const { session } = await getDecryptedSession();

  if (!session) {
    return null;
  }

  const existingQueue = await prisma.queue.findFirst({
    where: { sessionId: session.sessionId, status: 0 },
  });

  if (existingQueue) {
    return existingQueue;
  }

  const newQueue = await prisma.queue.create({
    data: {
      name: session.userName,
      size: Number(size),
      sessionId: session.sessionId,
      status: 0,
    },
  });

  return newQueue;
};

export const findPendingReservastion = async () => {
  const { session } = await getDecryptedSession();

  if (!session) {
    return null;
  }

  const existingQueue = await prisma.queue.findFirst({
    where: { sessionId: session.sessionId, status: 0 },
  });

  return existingQueue;
};

export const findReservationById = async (id: number) => {
  const { session } = await getDecryptedSession();

  if (!session) {
    return null;
  }

  const queue = await prisma.queue.findFirst({
    where: { id, sessionId: session.sessionId },
  });

  return queue;
};

export const updateReservationStatus = async (id: number, status: number) => {
  const { session } = await getDecryptedSession();

  if (!session) {
    return null;
  }

  const result = await prisma.queue.update({
    data: { status },
    where: { id, sessionId: session.sessionId },
  });

  return result;
};
