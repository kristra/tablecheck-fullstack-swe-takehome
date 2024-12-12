import {
  findOrCreateReservation,
  findPendingReservastion,
  findReservationById,
  updateReservationStatus,
} from "./reservations.service";
import prisma from "../../../lib/prisma";
import { getDecryptedSession } from "../auth/session/session.handler";

// Mock the prisma client and getDecryptedSession function
vi.mock("../../../lib/prisma", () => ({
  default: {
    queue: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("../auth/session/session.handler", () => ({
  getDecryptedSession: vi.fn(),
}));

describe("Reservation Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("findOrCreateReservation", () => {
    it("should return an existing queue if a pending reservation exists", async () => {
      // Arrange
      const session = {
        sessionId: "session-id",
        userName: "John Doe",
        expiresAt: new Date(),
      };
      vi.mocked(getDecryptedSession).mockResolvedValue({
        isAuth: true,
        session,
      });

      const existingQueue = {
        id: 1,
        name: "John Doe",
        size: 4,
        status: 0,
        sessionId: "session-id",
        checkInAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.queue.findFirst).mockResolvedValue(existingQueue);

      // Act
      const result = await findOrCreateReservation(4);

      // Assert
      expect(result).toEqual(existingQueue);
      expect(prisma.queue.findFirst).toHaveBeenCalledWith({
        where: { sessionId: "session-id", status: 0 },
      });
    });

    it("should create a new queue if no pending reservation exists", async () => {
      // Arrange
      const session = {
        sessionId: "session-id",
        userName: "John Doe",
        expiresAt: new Date(),
      };
      vi.mocked(getDecryptedSession).mockResolvedValue({
        isAuth: true,
        session,
      });

      vi.mocked(prisma.queue.findFirst).mockResolvedValue(null); // No existing queue

      const newQueue = {
        id: 2,
        name: "John Doe",
        size: 4,
        status: 0,
        sessionId: "session-id",
        checkInAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.queue.create).mockResolvedValue(newQueue);

      // Act
      const result = await findOrCreateReservation(4);

      // Assert
      expect(result).toEqual(newQueue);
      expect(prisma.queue.create).toHaveBeenCalledWith({
        data: {
          name: "John Doe",
          size: 4,
          sessionId: "session-id",
          status: 0,
        },
      });
    });

    it("should return null if no session exists", async () => {
      // Arrange
      vi.mocked(getDecryptedSession).mockResolvedValue({
        isAuth: false,
        session: undefined,
      });

      // Act
      const result = await findOrCreateReservation(4);

      // Assert
      expect(result).toBeNull();
      expect(prisma.queue.findFirst).not.toHaveBeenCalled();
      expect(prisma.queue.create).not.toHaveBeenCalled();
    });
  });

  describe("findPendingReservastion", () => {
    it("should return the existing pending queue if it exists", async () => {
      // Arrange
      const session = {
        sessionId: "session-id",
        userName: "John Doe",
        expiresAt: new Date(),
      };
      vi.mocked(getDecryptedSession).mockResolvedValue({
        isAuth: true,
        session,
      });

      const existingQueue = {
        id: 1,
        name: "John Doe",
        size: 4,
        status: 0,
        sessionId: "session-id",
        checkInAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.queue.findFirst).mockResolvedValue(existingQueue);

      // Act
      const result = await findPendingReservastion();

      // Assert
      expect(result).toEqual(existingQueue);
      expect(prisma.queue.findFirst).toHaveBeenCalledWith({
        where: { sessionId: "session-id", status: 0 },
      });
    });

    it("should return null if no pending reservation exists", async () => {
      // Arrange
      const session = {
        sessionId: "session-id",
        userName: "John Doe",
        expiresAt: new Date(),
      };
      vi.mocked(getDecryptedSession).mockResolvedValue({
        isAuth: true,
        session,
      });

      vi.mocked(prisma.queue.findFirst).mockResolvedValue(null); // No existing queue

      // Act
      const result = await findPendingReservastion();

      // Assert
      expect(result).toBeNull();
    });

    it("should return null if no session exists", async () => {
      // Arrange
      vi.mocked(getDecryptedSession).mockResolvedValue({
        isAuth: false,
        session: undefined,
      });

      // Act
      const result = await findPendingReservastion();

      // Assert
      expect(result).toBeNull();
      expect(prisma.queue.findFirst).not.toHaveBeenCalled();
    });
  });

  describe("findReservationById", () => {
    it("should return the queue matching the provided id and session", async () => {
      // Arrange
      const session = {
        sessionId: "session-id",
        userName: "John Doe",
        expiresAt: new Date(),
      };
      vi.mocked(getDecryptedSession).mockResolvedValue({
        isAuth: true,
        session,
      });

      const queue = {
        id: 1,
        name: "John Doe",
        size: 4,
        status: 0,
        sessionId: "session-id",
        checkInAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.queue.findFirst).mockResolvedValue(queue);

      // Act
      const result = await findReservationById(1);

      // Assert
      expect(result).toEqual(queue);
      expect(prisma.queue.findFirst).toHaveBeenCalledWith({
        where: { id: 1, sessionId: "session-id" },
      });
    });

    it("should return null if no session exists", async () => {
      // Arrange
      vi.mocked(getDecryptedSession).mockResolvedValue({
        isAuth: false,
        session: undefined,
      });

      // Act
      const result = await findReservationById(1);

      // Assert
      expect(result).toBeNull();
      expect(prisma.queue.findFirst).not.toHaveBeenCalled();
    });
  });

  describe("updateReservationStatus", () => {
    it("should update the status of a reservation if the session is valid", async () => {
      // Arrange
      const session = {
        sessionId: "session-id",
        userName: "John Doe",
        expiresAt: new Date(),
      };
      vi.mocked(getDecryptedSession).mockResolvedValue({
        isAuth: true,
        session,
      });

      const updatedQueue = {
        id: 1,
        name: "John Doe",
        size: 4,
        status: 1,
        sessionId: "session-id",
        checkInAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(prisma.queue.update).mockResolvedValue(updatedQueue);

      // Act
      const result = await updateReservationStatus(1, 1);

      // Assert
      expect(result).toEqual(updatedQueue);
      expect(prisma.queue.update).toHaveBeenCalledWith({
        where: { id: 1, sessionId: "session-id" },
        data: { status: 1 },
      });
    });

    it("should return null if no session exists", async () => {
      // Arrange
      vi.mocked(getDecryptedSession).mockResolvedValue({
        isAuth: false,
        session: undefined,
      });

      // Act
      const result = await updateReservationStatus(1, 1);

      // Assert
      expect(result).toBeNull();
      expect(prisma.queue.update).not.toHaveBeenCalled();
    });
  });
});
