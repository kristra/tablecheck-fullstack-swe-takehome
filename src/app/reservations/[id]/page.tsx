"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const ReservationDetailPage = ({ params }) => {
  const router = useRouter();

  const id = params.id;

  const handleCheckIn = async () => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "PUT",
      });

      const result = await response.json();

      if (result) {
        router.push(`/reservations/${result.id}`);
      }
    } catch (_error) {
      // do something
    }
  };

  return (
    <div className={styles.screenContainer}>
      <h1 className={styles.screenTitle}>Check-in</h1>
      <p className={styles.screenSubtitle}>Click below to check-in</p>
      <button onClick={handleCheckIn} className={styles.checkinBtn}>
        {/* {isCheckedIn ? "Checked In" : "Check In"} */}
        Check In
      </button>
    </div>
  );
};

export default ReservationDetailPage;
