"use client";

import React, { useActionState } from "react";
import { googleAuthentiate } from "@/actions/auth/googleLogin";
import { FcGoogle } from "react-icons/fc";

const GoogleButton = () => {
  const [errorMsgGoogle, dispatchGoogle, isPending] = useActionState(
    googleAuthentiate,
    undefined
  );
  return (
    <form action={dispatchGoogle}>
      <button className="btn w-64">
        <FcGoogle className="text-xl" />{" "}
        {isPending ? "Signing..." : "Sign In with Google"}
      </button>
      <p>{errorMsgGoogle}</p>
    </form>
  );
};

export default GoogleButton;
