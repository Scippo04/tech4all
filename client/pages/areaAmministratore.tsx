import React, { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import styles from "../src/css/AreaUtente.module.css";
import Link from "next/link";
import ApiControllerFacade from "@/controller/ApiControllerFacade";

const AreaAmministratore: React.FC = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    id: 0,
    nome: "",
    cognome: "",
    email: "",
    quiz_superati: "",
  });
  const [activeTab, setActiveTab] = useState("Anagrafica");
  const [utenti, setUtenti] = useState<any[]>([]); // Stato per gli utenti
  const [isLoading, setIsLoading] = useState(false); // Stato per il caricamento
  const [error, setError] = useState<string | null>(null); // Stato per errori

  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id,
        nome: user.nome || "",
        cognome: user.cognome || "",
        email: user.email || "",
        quiz_superati: user.quiz_superati || "0",
      });
    }
  }, [user]);

  // Funzione per ottenere la lista degli utenti dal backend
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiControllerFacade.getUsers();
      console.log("Risposta dal server:", data); // Verifica la struttura della risposta
      setUtenti(data);
    } catch (error) {
      console.error("Errore durante il recupero degli utenti:", error);
      setError("Errore durante il recupero degli utenti.");
      setUtenti([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Recupera gli utenti solo quando la tab "Gestisci Utenti" è attiva
  useEffect(() => {
    if (activeTab === "Gestisci Utenti") {
      fetchUsers();
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "Anagrafica":
        return (
          <>
            <div className={styles.profileInfo}>
              <div className={styles.profileRow}>
                <span>Nome:</span>
                <span>{userData.nome}</span>
              </div>
              <div className={styles.profileRow}>
                <span>Cognome:</span>
                <span>{userData.cognome}</span>
              </div>
              <div className={styles.profileRow}>
                <span>Email:</span>
                <span>{userData.email}</span>
              </div>
              <div className={styles.profileRow}>
                <span>Quiz Superati:</span>
                <span>{userData.quiz_superati}</span>
              </div>
            </div>
          </>
        );
      case "Gestisci Utenti":
        return (
          <div className={styles.usersContainer}>
            <h2>Gestisci Utenti</h2>
            {isLoading ? (
              <p>Caricamento in corso...</p>
            ) : error ? (
              <p className={styles.errorMessage}>{error}</p>
            ) : utenti.length === 0 ? (
              <p>Nessun utente trovato.</p>
            ) : (
              <ul className={styles.userList}>
                {utenti.map((utente) => (
                  <li key={utente.id} className={styles.userItem}>
                    <div>
                      <strong>Nome e Cognome:</strong> {utente.nome}{" "}
                      {utente.cognome}
                    </div>
                    <div>
                      <strong>Email:</strong> {utente.email}
                    </div>
                    <div>
                      <strong>Ruolo:</strong>{" "}
                      {utente.ruolo ? "Admin" : "Utente"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "Anagrafica" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Anagrafica")}
        >
          Anagrafica
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "Gestisci Utenti" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("Gestisci Utenti")}
        >
          Gestisci Utenti
        </button>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.profileContainer}>
          {activeTab === "Anagrafica" && (
            <div className={styles.avatarPlaceholder}>
              <img src="/Media/areaUtente.png" alt="Avatar" />
            </div>
          )}
          {renderContent()}
        </div>
        <div className={styles.homeButtonContainer}>
          <Link href="/homepage">
            <button className={styles.homeButton}>Torna alla home</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AreaAmministratore;
