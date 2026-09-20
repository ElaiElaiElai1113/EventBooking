"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "motion/react";
import { LoadingState } from "@/components/shared/loading-state";
import type { DemoState, Role } from "@/domain/model";
import type { Action } from "@/domain/commands";
import { transition } from "@/domain/transition";
import { createScene, identityFor } from "./scenes";
import { decode, save, STORAGE_KEY } from "./persistence";
type Context = {
  state: DemoState;
  dispatch: (action: Action) => boolean;
  present: (role: Role, identity?: string) => void;
  load: (scene: string) => boolean;
  draft: (key: string, value: Record<string, string>) => void;
  nav: (key: string, value: string) => void;
  error: string;
  clearError: () => void;
  saved: string;
  retry: () => void;
};
const DemoContext = createContext<Context | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState | null>(null),
    [error, setError] = useState(""),
    [saved, setSaved] = useState("Loading saved demo…"),
    [corrupt, setCorrupt] = useState(false);
  const current = useRef<DemoState | null>(null);
  // Browser-only hydration intentionally adds one render before private data becomes visible.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const s = raw ? decode(raw) : createScene("venue-inquiry");
      current.current = s;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(s);
      setSaved(raw ? "Saved in this browser" : "New local demo");
    } catch {
      setCorrupt(true);
      setError(
        "Saved data is unreadable or uses an incompatible version. It has not been overwritten. Explicitly reset to recover.",
      );
    }
  }, []);
  const persist = (s: DemoState) => {
    current.current = s;
    setState(s);
    const r = save(localStorage, s);
    setSaved(r.ok ? "Saved in this browser" : "Not saved — " + r.error);
  };
  const load = (scene: string) => {
    try {
      const s = createScene(scene);
      setCorrupt(false);
      setError("");
      persist(s);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load scene");
      return false;
    }
  };
  if (corrupt)
    return (
      <main className="container narrow">
        <h1>Recover your local demo</h1>
        <p role="alert">{error}</p>
        <button
          className="button button-primary"
          onClick={() => {
            if (
              confirm(
                "Discard incompatible saved data and load a fresh fictional demo?",
              )
            )
              load("venue-inquiry");
          }}
        >
          Reset saved demo
        </button>
      </main>
    );
  if (!state)
    return (
      <main><LoadingState /></main>
    );
  const value: Context = {
    state,
    error,
    saved,
    clearError: () => setError(""),
    retry: () => persist(current.current!),
    load,
    dispatch: (action) => {
      const s = current.current!;
      const r = transition(s, {
        ...action,
        role: s.role,
        actorId: s.identity,
        commandId: crypto.randomUUID(),
        expectedRevision: s.revision,
      });
      if (!r.ok) {
        setError(r.issues.map((i) => i.message).join(" "));
        return false;
      }
      setError("");
      persist(r.state);
      return true;
    },
    present: (role, identity) =>
      persist({
        ...current.current!,
        role,
        identity: identity ?? identityFor(role),
      }),
    draft: (key, value) => {
      const s = current.current!;
      persist({ ...s, drafts: { ...s.drafts, [key]: value } });
    },
    nav: (key, value) => {
      const s = current.current!;
      persist({ ...s, navigation: { ...s.navigation, [key]: value } });
    },
  };
  return (
    <DemoContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </DemoContext.Provider>
  );
}
export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("Demo provider required");
  return value;
}
