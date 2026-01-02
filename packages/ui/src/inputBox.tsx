"use client";

import React from "react";

interface InputBoxProps {
  placeholder: string;
  title: string;
  type: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputBox({ placeholder, title, type, value, onChange }: InputBoxProps) {
  return (
    <div className="input-box flex flex-col gap-2">
      <label className="text-sm font-semibold text-neutral-300">{title}</label>
      <input
        className="px-4 py-2 bg-neutral-900 text-neutral-300 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-neutral-500 hover:border-indigo-500 transition-all duration-300"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}