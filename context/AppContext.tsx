"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  AppState,
  LeagueSettings,
  Player,
  RosterSlot,
  WaiverTarget,
} from "@/lib/types";
import { DEFAULT_LEAGUE, samplePlayers, sampleWaivers } from "@/lib/sampleData";
import { loadState, saveState } from "@/lib/storage";
import { canFillSlot, StarterSlotId } from "@/lib/slots";
import { uid } from "@/lib/logic";

const EMPTY_STATE: AppState = {
  league: DEFAULT_LEAGUE,
  players: [],
  waivers: [],
  completedLessons: [],
};

interface AppContextValue {
  hydrated: boolean;
  league: LeagueSettings;
  players: Player[];
  waivers: WaiverTarget[];
  completedLessons: string[];
  updateLeague: (partial: Partial<LeagueSettings>) => void;
  completeOnboarding: (settings: Omit<LeagueSettings, "onboardingComplete">) => void;
  addPlayer: (player: Omit<Player, "id" | "isSample">) => void;
  updatePlayer: (id: string, partial: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  movePlayer: (id: string, targetSlot: RosterSlot) => void;
  applySwap: (outId: string, inId: string, slot: RosterSlot) => void;
  resetSampleRoster: () => void;
  clearRoster: () => void;
  addWaiver: (waiver: Omit<WaiverTarget, "id" | "isSample">) => void;
  updateWaiver: (id: string, partial: Partial<WaiverTarget>) => void;
  removeWaiver: (id: string) => void;
  addWaiverToRoster: (id: string) => void;
  toggleLessonComplete: (id: string) => void;
  resetAllSampleData: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadState<AppState>(EMPTY_STATE);
    setState(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
  }, [state, hydrated]);

  const updateLeague = useCallback((partial: Partial<LeagueSettings>) => {
    setState((s) => ({ ...s, league: { ...s.league, ...partial } }));
  }, []);

  const completeOnboarding = useCallback(
    (settings: Omit<LeagueSettings, "onboardingComplete">) => {
      setState((s) => ({
        ...s,
        league: { ...settings, onboardingComplete: true },
      }));
    },
    []
  );

  const addPlayer = useCallback((player: Omit<Player, "id" | "isSample">) => {
    setState((s) => ({
      ...s,
      players: [...s.players, { ...player, id: uid("player"), isSample: false }],
    }));
  }, []);

  const updatePlayer = useCallback((id: string, partial: Partial<Player>) => {
    setState((s) => ({
      ...s,
      players: s.players.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    }));
  }, []);

  const deletePlayer = useCallback((id: string) => {
    setState((s) => ({ ...s, players: s.players.filter((p) => p.id !== id) }));
  }, []);

  const movePlayer = useCallback((id: string, targetSlot: RosterSlot) => {
    setState((s) => {
      const moving = s.players.find((p) => p.id === id);
      if (!moving) return s;
      if (targetSlot !== "BENCH" && !canFillSlot(moving.position, targetSlot as StarterSlotId)) {
        return s;
      }
      const occupant =
        targetSlot === "BENCH"
          ? undefined
          : s.players.find((p) => p.id !== id && p.slot === targetSlot);
      return {
        ...s,
        players: s.players.map((p) => {
          if (p.id === id) return { ...p, slot: targetSlot };
          if (occupant && p.id === occupant.id) return { ...p, slot: "BENCH" as RosterSlot };
          return p;
        }),
      };
    });
  }, []);

  const applySwap = useCallback((outId: string, inId: string, slot: RosterSlot) => {
    setState((s) => ({
      ...s,
      players: s.players.map((p) => {
        if (p.id === inId) return { ...p, slot };
        if (p.id === outId) return { ...p, slot: "BENCH" as RosterSlot };
        return p;
      }),
    }));
  }, []);

  const resetSampleRoster = useCallback(() => {
    setState((s) => ({ ...s, players: samplePlayers(), waivers: sampleWaivers() }));
  }, []);

  const clearRoster = useCallback(() => {
    setState((s) => ({ ...s, players: [] }));
  }, []);

  const addWaiver = useCallback((waiver: Omit<WaiverTarget, "id" | "isSample">) => {
    setState((s) => ({
      ...s,
      waivers: [...s.waivers, { ...waiver, id: uid("waiver"), isSample: false }],
    }));
  }, []);

  const updateWaiver = useCallback((id: string, partial: Partial<WaiverTarget>) => {
    setState((s) => ({
      ...s,
      waivers: s.waivers.map((w) => (w.id === id ? { ...w, ...partial } : w)),
    }));
  }, []);

  const removeWaiver = useCallback((id: string) => {
    setState((s) => ({ ...s, waivers: s.waivers.filter((w) => w.id !== id) }));
  }, []);

  const addWaiverToRoster = useCallback((id: string) => {
    setState((s) => {
      const target = s.waivers.find((w) => w.id === id);
      if (!target) return s;
      const newPlayer: Player = {
        id: uid("player"),
        name: target.name,
        nflTeam: target.nflTeam,
        position: target.position,
        opponent: "TBD",
        projectedPoints: target.projectedPoints,
        status: "Healthy",
        matchup: "Average",
        opportunity: target.notes,
        consistency: "Unknown",
        slot: "BENCH",
        notes: "Added from your waiver board.",
        isSample: false,
      };
      return {
        ...s,
        players: [...s.players, newPlayer],
        waivers: s.waivers.filter((w) => w.id !== id),
      };
    });
  }, []);

  const toggleLessonComplete = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      completedLessons: s.completedLessons.includes(id)
        ? s.completedLessons.filter((l) => l !== id)
        : [...s.completedLessons, id],
    }));
  }, []);

  const resetAllSampleData = useCallback(() => {
    setState((s) => ({ ...s, players: samplePlayers(), waivers: sampleWaivers() }));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      hydrated,
      league: state.league,
      players: state.players,
      waivers: state.waivers,
      completedLessons: state.completedLessons,
      updateLeague,
      completeOnboarding,
      addPlayer,
      updatePlayer,
      deletePlayer,
      movePlayer,
      applySwap,
      resetSampleRoster,
      clearRoster,
      addWaiver,
      updateWaiver,
      removeWaiver,
      addWaiverToRoster,
      toggleLessonComplete,
      resetAllSampleData,
    }),
    [
      hydrated,
      state,
      updateLeague,
      completeOnboarding,
      addPlayer,
      updatePlayer,
      deletePlayer,
      movePlayer,
      applySwap,
      resetSampleRoster,
      clearRoster,
      addWaiver,
      updateWaiver,
      removeWaiver,
      addWaiverToRoster,
      toggleLessonComplete,
      resetAllSampleData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
