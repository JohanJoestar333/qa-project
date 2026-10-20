import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  testIdPrefix: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  testIdPrefix,
}) => {
  const titleId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Keep the latest callback without restarting the effect below on every render
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    // Cancel is focused first so that pressing Enter by accident does not delete anything
    cancelButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancelRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      // Keep Tab inside the dialog
      const buttons = dialogRef.current?.querySelectorAll<HTMLElement>('button');
      if (!buttons || buttons.length === 0) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-5">
      <div
        data-testid={`${testIdPrefix}-backdrop`}
        onClick={onCancel}
        className="fade-in absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        data-testid={testIdPrefix}
        className="dialog-enter relative w-full max-w-[320px] rounded-[22px] bg-surface p-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
      >
        <h2 id={titleId} data-testid={`${testIdPrefix}-title`} className="text-[19px] text-ink">
          {title}
        </h2>
        <p id={messageId} data-testid={`${testIdPrefix}-message`} className="mt-2 text-[14px] text-ink-2">
          {message}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            data-testid={`${testIdPrefix}-cancel-button`}
            className="btn btn-secondary"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            data-testid={`${testIdPrefix}-confirm-button`}
            className="btn btn-danger"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
