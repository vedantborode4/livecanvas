"use client";

import InputBox from "@repo/ui/InputBox";
import { Button } from "@repo/ui/Button";
import { useState, ChangeEvent } from "react";
import axios from "axios";
import { backendURL } from "@/components/util";
import { SignupSchema } from "@repo/zod-schema/type";
import Link from "next/link";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit() {
    // Validate using Zod schema
    const parsed = SignupSchema.safeParse({ name, email, password });

    if (!parsed.success) {
      console.log(parsed.error.format());
      return;
    }

    try {
      const response = await axios.post(`${backendURL}/signup`, parsed.data);
      console.log(response.data.message);
      // Optionally, redirect to login page here
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.error);
      } else {
        console.log(error);
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-md p-8 shadow-xl flex flex-col gap-4">
        <h3 className="text-2xl font-bold text-center text-indigo-400 mb-2">
          Sign Up
        </h3>

        <p className="text-sm text-neutral-400 text-center mb-4">
          Create your LiveCanvas account
        </p>

        <InputBox
          placeholder="Your Name"
          title="Name"
          type="text"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        />

        <InputBox
          placeholder="Your Email"
          title="Email"
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />

        <InputBox
          placeholder="Your Password"
          title="Password"
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />

        <Button onClick={onSubmit} className="mt-2 w-full">
          Sign Up
        </Button>

        <p className="text-sm text-neutral-400 text-center mt-2">
          Already have an account?{" "}
          <Link href="/signin" className="text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
