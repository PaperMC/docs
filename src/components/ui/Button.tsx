import React, { MouseEventHandler } from "react";
import clsx from "clsx";

export default function Button({ label, onClick, id, success, error, disabled }: ButtonProps) {
  return <button type="button" className={clsx("btn", success && "success", error && "error")} onClick={onClick} id={id} disabled={disabled}>{label}</button>
}

interface ButtonProps {
  label: string;
  id?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  success?: boolean;
  error?: boolean;
  disabled?: boolean;
}
