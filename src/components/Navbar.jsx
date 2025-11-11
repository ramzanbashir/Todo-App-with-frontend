import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar({ user }) {
  const logout = () => signOut(auth);

  return (
    <nav className="bg-blue-600 text-white flex justify-between p-4 shadow-md">
      <h1 className="text-xl font-bold">Welcome, {user?.email}</h1>
      <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
        Logout
      </button>
    </nav>
  );
}
