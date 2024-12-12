import { createRequest } from "node-mocks-http";
import { CreateOrUpdateSession, DeleteSession } from "./session.controller";
import { encrypt } from "./session.service";
import { cookies } from "next/headers";

vi.mock("./session.service", () => ({
  encrypt: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("/api/session", () => {
  describe("POST /api/session", () => {
    it("should return 400 if 'userName' is missing", async () => {
      const req = createRequest({
        method: "POST",
        body: {},
      });
      req.json = async () => req.body;

      const result = await CreateOrUpdateSession(req);

      const jsonResponse = await result.json();
      expect(result.status).toBe(400);
      expect(jsonResponse).toEqual({ message: "error" });
    });

    it("should create a new session and set the session cookie if session does not exist", async () => {
      const mockCookies = {
        get: vi.fn().mockResolvedValue(undefined),
        set: vi.fn(),
        delete: vi.fn(),
        has: vi.fn().mockResolvedValue(false),
        size: 0,
        getAll: vi.fn().mockResolvedValue([]),
        [Symbol.iterator]: function* () {},
      };
      vi.mocked(cookies).mockResolvedValue(mockCookies);

      const req = createRequest({
        method: "POST",
        body: { name: "John Doe" },
      });
      req.json = async () => req.body;

      vi.mocked(encrypt).mockResolvedValue("encrypted-session");

      const result = await CreateOrUpdateSession(req);

      const jsonResponse = await result.json();
      expect(result.status).toBe(200);
      expect(jsonResponse).toEqual({ message: "success" });
      expect(mockCookies.set).toHaveBeenCalledWith(
        "session",
        "encrypted-session",
        expect.any(Object)
      );
    });

    it("should return 500 if an error occurs while creating a session", async () => {
      const mockCookies = {
        get: vi.fn().mockResolvedValue(undefined),
        set: vi.fn(),
        delete: vi.fn(),
        has: vi.fn().mockResolvedValue(false),
        size: 0,
        getAll: vi.fn().mockResolvedValue([]),
        [Symbol.iterator]: function* () {},
      };
      vi.mocked(cookies).mockResolvedValue(mockCookies);

      vi.mocked(encrypt).mockRejectedValue(new Error("Encryption error"));

      const req = createRequest({
        method: "POST",
        body: { name: "John Doe" },
      });
      req.json = async () => req.body;

      const result = await CreateOrUpdateSession(req);

      const jsonResponse = await result.json();
      expect(result.status).toBe(500);
      expect(jsonResponse).toEqual({ error: "internal server error" });
    });
  });

  describe("DELETE /api/session", () => {
    it("should delete the session cookie successfully", async () => {
      const mockCookies = {
        get: vi.fn().mockResolvedValue(undefined),
        set: vi.fn(),
        delete: vi.fn(),
        has: vi.fn().mockResolvedValue(false),
        size: 0,
        getAll: vi.fn().mockResolvedValue([]),
        [Symbol.iterator]: function* () {},
      };
      vi.mocked(cookies).mockResolvedValue(mockCookies);

      const result = await DeleteSession();

      const jsonResponse = await result.json();
      expect(result.status).toBe(200);
      expect(jsonResponse).toEqual({ message: "success" });
      expect(mockCookies.delete).toHaveBeenCalledWith("session");
    });

    it("should return 500 if an error occurs while deleting the session", async () => {
      vi.mocked(cookies).mockRejectedValue(new Error("Delete error"));

      const result = await DeleteSession();

      const jsonResponse = await result.json();
      expect(result.status).toBe(500);
      expect(jsonResponse).toEqual({ error: "internal server error" });
    });
  });
});
