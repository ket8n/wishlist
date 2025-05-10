"use client";

import React from "react";
import { signOut } from "next-auth/react";

const Logout = () => {
  return (
    <>
      <button
        className="bg-gray-300 px-3 py-1 rounded-sm"
        onClick={() => signOut({ redirectTo: "/login" })}
      >
        Logout
      </button>
    </>
  );
};

export default Logout;
