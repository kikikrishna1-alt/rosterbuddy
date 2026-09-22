"use client";

import { ReactNode } from "react";

export default function Modal({
  title,
  eyebrow,
  onClose,
  children,
}: {
  title: string;
  eyebrow: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-navy-800 p-5 shadow-card"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold tracking-wide text-lime">{eyebrow}</span>
            <h3 className="mt-0.5 text-lg font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/70"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
