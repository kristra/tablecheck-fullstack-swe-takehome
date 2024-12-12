import { NextRequest, NextResponse } from "next/server";

import {
  findReservationById,
  updateReservationStatus,
} from "../reservations.service";

export const GetReservationById = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = Number(params.id);

    const reservation = await findReservationById(id);

    return NextResponse.json({
      message: "success",
      reservation,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
};

export const CheckInReservation = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = Number(params.id);

    const result = await updateReservationStatus(id, 2);

    return NextResponse.json({ message: "success", id: result?.id });
  } catch (error) {
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
};
