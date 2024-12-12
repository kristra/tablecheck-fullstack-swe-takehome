import { encrypt, decrypt } from "./session.service";
import { SignJWT, jwtVerify } from "jose";

vi.mock("jose", () => ({
  SignJWT: vi.fn(() => ({
    setProtectedHeader: vi.fn().mockReturnThis(),
    setIssuedAt: vi.fn().mockReturnThis(),
    setExpirationTime: vi.fn().mockReturnThis(),
    sign: vi.fn().mockResolvedValue("signed-jwt"),
  })),
  jwtVerify: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("Session Service", () => {
  describe("encrypt", () => {
    it("should encrypt the session payload and return a JWT", async () => {
      const sessionPayload = {
        userName: "John Doe",
        sessionId: "session-id",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      const result = await encrypt(sessionPayload);

      expect(result).toBe("signed-jwt");
      expect(SignJWT).toHaveBeenCalled();
      const signJWTInstance = SignJWT.mock.results[0].value; // Get the mocked instance
      expect(signJWTInstance.setProtectedHeader).toHaveBeenCalledWith({
        alg: "HS256",
      });
      expect(signJWTInstance.setExpirationTime).toHaveBeenCalledWith("7d");
      expect(signJWTInstance.sign).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe("decrypt", () => {
    it("should successfully decrypt a valid JWT", async () => {
      const validJwt = "valid-jwt";
      const expectedPayload = {
        userName: "John Doe",
        sessionId: "session-id",
        expiresAt: new Date(),
      };
      vi.mocked(jwtVerify).mockResolvedValue({ payload: expectedPayload });

      const result = await decrypt(validJwt);

      expect(result).toEqual(expectedPayload);
      expect(jwtVerify).toHaveBeenCalledWith(validJwt, expect.anything(), {
        algorithms: ["HS256"],
      });
    });

    it("should return undefined for an invalid JWT", async () => {
      const invalidJwt = "invalid-jwt";
      vi.mocked(jwtVerify).mockRejectedValue(new Error("Invalid JWT"));

      const result = await decrypt(invalidJwt);

      expect(result).toBeUndefined();
      expect(jwtVerify).toHaveBeenCalledWith(invalidJwt, expect.anything(), {
        algorithms: ["HS256"],
      });
    });
  });
});
