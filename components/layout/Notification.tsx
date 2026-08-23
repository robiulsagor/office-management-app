import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Notification = ({
  title,
  message,
  link,
}: {
  title: string;
  message: string;
  link?: string | null;
}) => {
  return (
    <div
      className={`p-2 rounded hover:bg-slate-100  00 text-sm cursor-pointer border-b border-slate-300 text-slate-600 flex gap-1`}
    >
      <Link
        href={link || "#"}
        className={`ml-auto`}
      >
        <span className={`${link ? "text-blue-400 hover:underline" : ""}`}>{title}</span>
        <p className="text-xs text-slate-500">{message}</p>
      </Link>
    </div>
  );
};

export default Notification;
