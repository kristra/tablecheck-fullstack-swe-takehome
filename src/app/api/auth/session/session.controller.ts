import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "./session.service";
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

type SignUpPayload = {
  name: string;
};

export const CreateOrUpdateSession = async (req: NextRequest) => {
  try {
    const { name: userName }: SignUpPayload = await req.json();

    if (!userName) {
      return NextResponse.json({ message: "error" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    let session = cookieStore.get("session")?.value;

    if (!session) {
      const sessionId = uuid();
      session = await encrypt({ sessionId, userName, expiresAt });
    }

    cookieStore.set("session", session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ message: "success" });
  } catch (error) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
};

export const DeleteSession = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session");

    return NextResponse.json({ message: "success" });
  } catch (error) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
};
