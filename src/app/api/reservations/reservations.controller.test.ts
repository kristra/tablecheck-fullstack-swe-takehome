import {
  CreateReservation,
  GetReservationBySessionId,
} from "./reservations.controller";

import {
  findOrCreateReservation,
  findPendingReservastion,
} from "./reservations.service";
import { createRequest } from "node-mocks-http";
import stringifyDate from "../../../lib/stringifyDate";
import { getDecryptedSession } from "../auth/session/session.handler";

vi.mock("../auth/session/session.handler", () => ({
  getDecryptedSession: vi.fn(),
}));

vi.mock("./reservations.service", () => ({
  findOrCreateReservation: vi.fn(),
  findPendingReservastion: vi.fn(),
}));

describe("/api/reservations", () => {
  describe("POST /api/reservations", () => {
    it("should return 400 if 'size' is missing in the request payload", async () => {
      vi.mocked(getDecryptedSession).mockResolvedValue({
        isAuth: true,
        session: {
          sessionId: "123",
          userName: "testUser",
          expiresAt: new Date(),
        },
      });

      const req = createRequest({
        method: "POST",
        body: {},
      });
      req.json = async () => req.body;

      const result = await CreateReservation(req);

      const jsonResponse = await result.json();
      expect(result.status).toBe(400);
      expect(jsonResponse).toEqual({ error: "bad request" });
    });

    it("should return 500 if findOrCreateReservation throws an error", async () => {
      vi.mocked(getDecryptedSession).mockResolvedValue({
        isAuth: true,
        session: {
          sessionId: "123",
          userName: "testUser",
          expiresAt: new Date(),
        },
      });

      vi.mocked(findOrCreateReservation).mockRejectedValue(
        new Error("Database error")
      );

      const req = createRequest({
        method: "POST",
        body: { size: 4 },
      });
      req.json = async () => req.body;

      const result = await CreateReservation(req);

      const jsonResponse = await result.json();
      expect(result.status).toBe(500);
      expect(jsonResponse).toEqual({ error: "internal server error" });
    });

    it("should return 200 and reservation ID if successful", async () => {
      const mockReservation = {
        id: 1,
        sessionId: "123",
        status: 0,
        name: "John Doe",
        size: 4,
        checkInAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(getDecryptedSession).mockResolvedValue({
        isAuth: true,
        session: {
          sessionId: "123",
          userName: "testUser",
          expiresAt: new Date(),
        },
      });

      vi.mocked(findOrCreateReservation).mockResolvedValue(mockReservation);

      const req = createRequest({
        method: "POST",
        body: { size: 4 },
      });
      req.json = async () => req.body;

      const result = await CreateReservation(req);

      const jsonResponse = await result.json();
      expect(result.status).toBe(200);
      expect(jsonResponse).toEqual({
        message: "success",
        id: mockReservation.id,
      });
    });
  });

  describe("GET /api/reservations", () => {
    it("should return reservation data if session exists", async () => {
      const mockReservation = {
        id: 1,
        sessionId: "123",
        status: 0,
        name: "testUser",
        size: 4,
        checkInAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(getDecryptedSession).mockResolvedValue({
        isAuth: true,
        session: {
          sessionId: "123",
          userName: "testUser",
          expiresAt: new Date(),
        },
      });

      vi.mocked(findPendingReservastion).mockResolvedValue(mockReservation);

      const result = await GetReservationBySessionId();

      const jsonResponse = await result.json();
      expect(result.status).toBe(200);
      expect(jsonResponse).toEqual({
        message: "success",
        data: stringifyDate(mockReservation),
      });
    });
  });
});
