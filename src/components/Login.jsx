
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  // Handle Login or Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        // ✅ Create new user (Sign Up)
        await createUserWithEmailAndPassword(auth, email, password);

        // ✅ Sign out immediately after signup to prevent auto-login
        await auth.signOut();

        Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: "Please log in to continue.",
        });

        // Back to login screen
        setIsSignup(false);
        setEmail("");
        setPassword("");
      } else {
        // ✅ Login user
        await signInWithEmailAndPassword(auth, email, password);
        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: "Welcome back!",
        }).then(() => {
          // Redirect to Todo app
          window.location.href = "/todo";
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text: err.message,
      });
    }
  };

  return (
    <div className="card shadow-lg p-4 rounded-4" style={{ width: "22rem" }}>
      <h3 className="fw-bold text-center text-primary mb-3">
        {isSignup ? "Sign Up" : "Login"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>

      <p
        className="mt-3 text-center text-secondary"
        style={{ cursor: "pointer" }}
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup
          ? "Already have an account? Login"
          : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
}

export default Login;
