"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick: () => void;
}

export const Button = ({ children, className, onClick }: ButtonProps) => {
  return (
    <button
      className={`px-6 py-3 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-400 hover:scale-105 transition-all duration-300 transform ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
