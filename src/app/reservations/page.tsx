import { redirect } from "next/navigation";
import styles from "./page.module.css";

const ReservationPage = async () => {
  const response = await fetch("http://localhost:3000/api/reservations", {
    cache: "no-store",
    method: "GET",
  });
  const result = await response.json();
  const reservation = result.data;

  if (!result || !reservation) {
    redirect("/reservations/new");
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Thak you for waiting!</h1>
      </main>
      <footer className={styles.footer}>{/* <SignOutButton /> */}</footer>
    </div>
  );
};

export default ReservationPage;
