import { createSignal, onCleanup } from "solid-js";

export function useClickOutside(action: () => void) {
  const [el, setEl] = createSignal<HTMLElement | null>(null);
  const onClick = (e: MouseEvent) => {
    if (!el()?.contains(e.target as Node)) {
      action();
    }
  };
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
  return {
    setEl,
  };
}
