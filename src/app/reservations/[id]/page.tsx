"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const ReservationDetailPage = () => {
  const router = useRouter();
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckIn = () => {
    // Simulate check-in process, and maybe store a status
    setIsCheckedIn(true);
    alert("You have successfully checked in!");
    router.push("/"); // Redirect back to the welcome screen or home page
  };

  return (
    <div className={styles.screenContainer}>
      <h1 className={styles.screenTitle}>Check-in</h1>
      <p className={styles.screenSubtitle}>Click below to check-in</p>
      <button onClick={handleCheckIn} className={styles.checkinBtn}>
        {isCheckedIn ? "Checked In" : "Check In"}
      </button>
    </div>
  );
};

export default ReservationDetailPage;
