"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { FormEvent, useState } from "react";

const ReservationPage = () => {
  const router = useRouter();
  const [size, setSize] = useState(1);

  const createReservation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        body: JSON.stringify({
          size,
        }),
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
      <h1 className={styles.screenTitle}>Hi, </h1>
      <p className={styles.screenSubtitle}>
        How many people are in your party?
      </p>
      <form onSubmit={createReservation}>
        <input
          type="number"
          className={styles.inputField}
          placeholder="Party Size"
          value={size}
          min={1}
          max={10}
          onChange={(e) => setSize(Number(e.target.value))}
        />
        <button className={styles.continueBtn}>Continue</button>
      </form>
    </div>
  );
};

export default ReservationPage;
