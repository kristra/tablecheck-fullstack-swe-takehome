import { getDecryptedSession } from "./session.handler";
import { cookies } from "next/headers";
import { decrypt } from "./session.service";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));
vi.mock("./session.service", () => ({
  decrypt: vi.fn(),
}));

describe("Session Handler", () => {
  describe("getDecryptedSession", () => {
    it("should return session data if a valid session is present in cookies", async () => {
      const sessionCookie = "valid-jwt";
      const sessionPayload = {
        userName: "John Doe",
        sessionId: "session-id",
        expiresAt: new Date(),
      };

      const mockCookies = {
        get: vi.fn().mockReturnValue({ value: sessionCookie }),
      };
      vi.mocked(cookies).mockReturnValue(mockCookies);

      vi.mocked(decrypt).mockResolvedValue(sessionPayload);

      const result = await getDecryptedSession();

      expect(result.isAuth).toBe(true);
      expect(result.session).toEqual(sessionPayload);
      expect(cookies).toHaveBeenCalled();
      expect(decrypt).toHaveBeenCalledWith(sessionCookie);
    });

    it("should return isAuth as false if no session is present in cookies", async () => {
      const mockCookies = {
        get: vi.fn().mockReturnValue(undefined),
      };
      vi.mocked(cookies).mockReturnValue(mockCookies);
      vi.mocked(decrypt).mockResolvedValue(undefined);

      const result = await getDecryptedSession();

      expect(result.isAuth).toBe(false);
      expect(result.session).toBeUndefined();
      expect(cookies).toHaveBeenCalled();
    });

    it("should return isAuth as false if the session is invalid", async () => {
      const invalidSessionCookie = "invalid-jwt";
      const mockCookies = {
        get: vi.fn().mockReturnValue({ value: invalidSessionCookie }),
      };
      vi.mocked(cookies).mockReturnValue(mockCookies);

      vi.mocked(decrypt).mockResolvedValue(undefined);

      const result = await getDecryptedSession();

      expect(result.isAuth).toBe(false);
      expect(result.session).toBeUndefined();
      expect(cookies).toHaveBeenCalled();
      expect(decrypt).toHaveBeenCalledWith(invalidSessionCookie);
    });
  });
});
