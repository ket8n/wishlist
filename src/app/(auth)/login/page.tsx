import GithubButton from "@/components/auth/GithubButton";
import GoogleButton from "@/components/auth/GoogleButton";
import React from "react";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <div className="card-body h-80 items-center text-center flex justify-around">
          <h2 className="card-title">Welcome to WishList</h2>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">Sign in to continue</p>
            <GoogleButton />
            <GithubButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
