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
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-[#a6adc8]">{title}</label>
      <input
        className="
          px-3.5 py-2.5 rounded-lg text-sm
          bg-[#1e1e2e] text-[#cdd6f4]
          border border-[#313244] 
          focus:outline-none focus:ring-2 focus:ring-[#89b4fa]/40 focus:border-[#89b4fa]/60
          placeholder:text-[#45475a]
          hover:border-[#45475a]
          transition-all duration-150
        "
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
