"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button = ({ children, className, onClick, disabled }: ButtonProps) => {
  return (
    <button
      className={`
        px-6 py-3 rounded-xl font-medium text-sm
        bg-[#89b4fa] text-[#1e1e2e]
        hover:bg-[#b4d0fb] active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-150
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
