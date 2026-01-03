"use client";

import Link from "next/link";
import InputBox from "@repo/ui/InputBox";
import { Button } from "@repo/ui/Button";
import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "@/components/util";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit() {
    try {
      const response = await axios.post(`${backendURL}/signin`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      console.log(response.data.message); // lowercase to match common API response
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message);
      } else {
        console.log(error);
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md p-8 shadow-xl flex flex-col gap-4">
        <h3 className="text-2xl font-bold text-center text-indigo-400 mb-2">
          Sign In
        </h3>

        <p className="text-sm text-neutral-400 text-center mb-4">
          Welcome back to LiveCanvas
        </p>

        <InputBox
          placeholder="your email"
          title="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputBox
          placeholder="your password"
          title="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={onSubmit} className="mt-2 w-full">
          Sign In
        </Button>

        <p className="text-sm text-neutral-400 text-center mb-4">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-indigo-400 hover:underline">
            Sign up
        </Link>
        </p>
      </div>
    </div>
  );
}
