"use client";

import { ReactNode } from "react";
import { useApp } from "@/context/AppContext";
import OnboardingFlow from "./OnboardingFlow";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: ReactNode }) {
  const { hydrated, league } = useApp();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <span className="text-2xl animate-pulse">🏈</span>
      </div>
    );
  }

  if (!league.onboardingComplete) {
    return <OnboardingFlow />;
  }

  return (
    <>
      <div className="pb-20">{children}</div>
      <BottomNav />
    </>
  );
}
