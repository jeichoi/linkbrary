"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "outline";
}

const Button = ({
  children,
  className,
  variant = "default",
  ...props
}: ButtonProps) => {
  const baseStyle =
    "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium focus:outline-none";
  const variantStyle = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      className={clsx(baseStyle, variantStyle[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
