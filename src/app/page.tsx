"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { FormEvent, useState } from "react";

const HomePage = () => {
  const router = useRouter();

  const [name, setName] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await fetch("/api/auth/session", {
        method: "POST",
        body: JSON.stringify({
          name,
        }),
      });

      if (result) {
        router.push("/reservations");
      }
    } catch (_error) {
      // do something
    }
  };

  return (
    <div className={styles.screenContainer}>
      <h1 className={styles.screenTitle}>Welcome!</h1>
      <p className={styles.screenSubtitle}>
        Please enter your name to continue
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.inputField}
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className={styles.continueBtn}>Continue</button>
      </form>
    </div>
  );
};

export default HomePage;
