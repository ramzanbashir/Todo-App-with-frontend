import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Swal from "sweetalert2";

function Signup({ setShowSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await auth.signOut(); // ✅ prevent auto-login
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "Please log in to continue.",
      });
      setShowSignup(false); // back to login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md w-80">
      <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 w-full rounded hover:bg-green-600"
        >
          Sign Up
        </button>
      </form>
      <p className="text-sm text-center mt-3">
        Already have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => setShowSignup(false)}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default Signup;
