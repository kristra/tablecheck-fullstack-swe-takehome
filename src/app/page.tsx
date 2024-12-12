import styles from "./page.module.css";

const HomePage = () => {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Welcome!</h1>
        <form id="reservationForm">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="partySize">Party Size:</label>
            <input type="number" id="partySize" name="partySize" required />
          </div>
          <button type="submit">Submit</button>
        </form>
      </main>
      <footer className={styles.footer}>footer</footer>
    </div>
  );
};

export default HomePage;
