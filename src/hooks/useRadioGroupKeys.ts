import { useRef } from 'react';
import type { KeyboardEvent } from 'react';

// Arrow-key navigation for a group of role="radio" buttons, as in a native radio group.
export const useRadioGroupKeys = (
  ids: string[],
  selectedId: string | null,
  onSelect: (id: string) => void,
) => {
  const groupRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent) => {
    const step = ['ArrowRight', 'ArrowDown'].includes(event.key)
      ? 1
      : ['ArrowLeft', 'ArrowUp'].includes(event.key)
      ? -1
      : 0;
    if (step === 0) return;

    event.preventDefault();
    const currentIndex = selectedId === null ? -1 : ids.indexOf(selectedId);
    const nextIndex =
      currentIndex === -1 ? (step > 0 ? 0 : ids.length - 1) : (currentIndex + step + ids.length) % ids.length;

    onSelect(ids[nextIndex]);
    groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[nextIndex]?.focus();
  };

  return { groupRef, onKeyDown };
};
