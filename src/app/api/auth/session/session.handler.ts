// session.handler.ts
import { cookies } from "next/headers";
import { decrypt } from "./session.service";

export const getDecryptedSession = async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);

  return { isAuth: !!session?.sessionId, session };
};
