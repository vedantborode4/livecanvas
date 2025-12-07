"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
  onClick: () => void;
}

export const Button = ({ children, className, appName, onClick }: ButtonProps) => {
  return (
<button
  className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ${className}`}
  onClick={onClick}
>
  {children}
</button>

  );
};
