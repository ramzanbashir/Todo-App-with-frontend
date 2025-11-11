import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import TodoList from "./components/TodoList";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div
      className="main-wrapper d-flex justify-content-center align-items-center min-vh-100 w-100"
    >
      {!user ? (
        <Login />
      ) : (
        <div className="todo-card rounded-4 shadow-lg p-4">
          {/* USER HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold mb-0 user-welcome">Welcome 👋</h5>
              <small className="text-muted user-email">{user.email}</small>
            </div>

            <button
              onClick={() => signOut(auth)}
              className="logout-btn btn btn-sm d-flex align-items-center gap-1"
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>

          {/* TODO APP */}
          <TodoList user={user} />
        </div>
      )}
    </div>
  );
}

export default App;
