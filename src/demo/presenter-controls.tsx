"use client";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDemo } from "./demo-provider";
import { scenes } from "./scenes";
import type { Role } from "@/domain/model";
import { dateTime, fromInput, localInput } from "@/domain/time";
import { Button } from "@/components/ui/button";
export function PresenterControls() {
  const { state, present, load, dispatch, saved, retry, error } = useDemo();
  const router = useRouter();
  const [sceneEdit, setSceneEdit] = useState({
    origin: state.scene,
    value: state.scene,
  });
  const [timeEdit, setTimeEdit] = useState({
    clock: state.now,
    value: localInput(state.now),
  });
  const scene =
    sceneEdit.origin === state.scene ? sceneEdit.value : state.scene;
  const time =
    timeEdit.clock === state.now ? timeEdit.value : localInput(state.now);
  const loadSelected = (id: string) => {
    if (
      state.revision > 0 &&
      !confirm("Load this scene? Current local work will be replaced.")
    )
      return;
    if (load(id)) {
      router.push(scenes.find((s) => s[0] === id)![3]);
    }
  };
  return (
    <div className="presenter">
      <span>
        <span className="demo-dot" /> Fictional local demo{" "}
        <span className="presenter-context">
          · {state.role} · {dateTime(state.now)}
        </span>
      </span>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button variant="ghost">
            <SlidersHorizontal size={15} />
            Demo controls
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <div className="spread">
              <Dialog.Title>Presenter controls</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" aria-label="Close demo controls">
                  <X size={20} />
                </Button>
              </Dialog.Close>
            </div>
            <Dialog.Description>
              Role switching is a simulation, not authentication. All people,
              payments and messages are fictional.
            </Dialog.Description>
            <label>
              Demo role
              <select
                aria-label="Demo role"
                value={state.role}
                onChange={(e) => present(e.target.value as Role)}
              >
                <option value="customer">Venue customer · Alex</option>
                <option value="venue">Venue staff</option>
                <option value="organizer">
                  Organizer · Sample Market Team
                </option>
                <option value="merchant">Merchant</option>
              </select>
            </label>
            {state.role === "merchant" && (
              <label>
                Demo merchant
                <select
                  aria-label="Demo identity"
                  value={state.identity}
                  onChange={(e) => present("merchant", e.target.value)}
                >
                  {state.profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {state.role === "venue" && (
              <label>
                Demo venue
                <select
                  aria-label="Demo identity"
                  value={state.identity}
                  onChange={(e) => present("venue", e.target.value)}
                >
                  {state.venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label>
              Demo scene
              <select
                aria-label="Demo scene"
                value={scene}
                onChange={(e) =>
                  setSceneEdit({ origin: state.scene, value: e.target.value })
                }
              >
                {scenes.map((s) => (
                  <option key={s[0]} value={s[0]}>
                    {s[1]}
                  </option>
                ))}
              </select>
            </label>
            <Button onClick={() => loadSelected(scene)}>Load scene</Button>
            <label>
              Demo time
              <input
                type="datetime-local"
                value={time}
                onChange={(e) =>
                  setTimeEdit({ clock: state.now, value: e.target.value })
                }
              />
            </label>
            <Button
              variant="outline"
              onClick={() =>
                dispatch({ type: "advance", time: fromInput(time) })
              }
            >
              Advance time
            </Button>
            <p className="small">
              Current: {dateTime(state.now)}. Time only moves forward.
            </p>
            <Button variant="outline" onClick={() => loadSelected(state.scene)}>
              Reset current scene
            </Button>
            <p role="status" className="small">
              {saved}
            </p>
            {saved.startsWith("Not saved") && (
              <Button onClick={retry}>Retry save</Button>
            )}
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
