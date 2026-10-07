import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";

import { auth } from "../firebase";

export default function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        try {
          const tokenResult =
            await getIdTokenResult(user, true);

          const admin =
            tokenResult.claims.admin === true;

          console.log("🔐 AdminRoute:", admin);

          setIsAdmin(admin);
        } catch (error) {
          console.error(
            "❌ Admin verification failed:",
            error
          );

          setIsAdmin(false);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "700",
        }}
      >
        🔐 Checking admin access...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/choose-friend" replace />;
  }

  return children;
}