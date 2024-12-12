import { NextRequest, NextResponse } from "next/server";
import {
  findOrCreateReservation,
  findPendingReservastion,
} from "./reservations.service";

type ReservationPayload = {
  size: number;
};

export const CreateReservation = async (req: NextRequest) => {
  try {
    const { size }: ReservationPayload = await req.json();

    if (!size) {
      return NextResponse.json({ error: "bad request" }, { status: 400 });
    }

    const reservation = await findOrCreateReservation(size);

    return NextResponse.json({ message: "success", id: reservation?.id });
  } catch (_err) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
};

export const GetReservationBySessionId = async () => {
  const reservation = await findPendingReservastion();

  return NextResponse.json({ message: "success", data: reservation });
};
