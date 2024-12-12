import { SignJWT, jwtVerify } from "jose";

type SessionPayload = {
  userName: string;
  sessionId: string;
  expiresAt: Date;
};

const secretKey = "totallysecretkey";
const encodedKey = new TextEncoder().encode(secretKey);

export const encrypt = async (payload: SessionPayload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
};

export const decrypt = async (session: string | undefined = "") => {
  try {
    const { payload } = await jwtVerify<SessionPayload>(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (e) {
    console.error(e);
  }
};
