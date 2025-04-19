"use client";

import React, { useActionState } from "react";
import { githubAuthentiate } from "@/actions/auth/githubLogin";
import { FaGithub } from "react-icons/fa";

const GithubButton = () => {
  const [errorMsgGithub, dispatchGithub, isPending] = useActionState(
    githubAuthentiate,
    undefined
  );
  return (
    <form action={dispatchGithub}>
      <button className="btn w-64">
        <FaGithub className="text-xl" />{" "}
        {isPending ? "Signing..." : "Sign In with Github"}
      </button>
      <p>{errorMsgGithub}</p>
    </form>
  );
};

export default GithubButton;
