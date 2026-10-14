'use client';

import React, { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const MODAL_TICKS = [
  '-top-1.5 -left-1.5 border-t-2 border-l-2 origin-top-left',
  '-top-1.5 -right-1.5 border-t-2 border-r-2 origin-top-right',
  '-bottom-1.5 -left-1.5 border-b-2 border-l-2 origin-bottom-left',
  '-bottom-1.5 -right-1.5 border-b-2 border-r-2 origin-bottom-right',
];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** Optional HUD label above the title, e.g. "// CHANNEL.OPEN". */
  eyebrow?: string;
  /** Keep the title for screen readers only (the eyebrow is the visible header). */
  hideTitle?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  eyebrow,
  hideTitle = false,
  children,
  footer,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  // Latest onClose without re-running the open/close effect when the parent re-renders.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // While open: move focus into the dialog, keep Tab inside it, close on Escape, and hand focus
  // back to whatever opened it when it closes.
  useEffect(() => {
    if (!isOpen) return;
    const dialog = modalRef.current;
    const opener = document.activeElement as HTMLElement | null;
    const focusable = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => el.offsetParent !== null,
      );

    (focusable().find((el) => el.matches('input, textarea')) ?? dialog)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      // The dialog element itself (focused after a click on non-interactive content, or as the
      // fallback) counts as outside the item list, so Tab/Shift+Tab can't escape from it.
      const onDialog = active === dialog;
      if (event.shiftKey && (active === first || onDialog || !dialog?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || onDialog || !dialog?.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      opener?.focus?.();
    };
  }, [isOpen]);

  // Always mounted so it can animate out as well as in. Opening: a quick glitch-in (.modal-glitch
  // in globals.css), then the HUD corner ticks draw in; closing: fade + scale to 96%.
  // `invisible` + `inert` take it out of the tab order and accessibility tree when shut;
  // visibility flips instantly on open (so focus can move in) and transitions only on close.
  return (
    <div
      inert={!isOpen}
      className={`fixed inset-0 z-[60] flex items-center justify-center overflow-auto bg-black/60 p-4 backdrop-blur-sm duration-200 ease-out motion-reduce:transition-none ${isOpen ? 'visible opacity-100 transition-opacity' : 'invisible opacity-0 transition-[opacity,visibility]'}`}
    >
      <div
        className={`modal-dialog relative w-full max-w-lg border bg-card shadow-2xl transition-transform duration-200 ease-out focus:outline-none motion-reduce:transition-none ${isOpen ? 'is-open scale-100' : 'scale-[0.96]'}`}
        style={{ borderColor: 'var(--accent)' }}
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* HUD corner ticks, drawn in after the glitch */}
        {MODAL_TICKS.map((pos) => (
          <span key={pos} aria-hidden="true" className={`modal-tick ${pos}`} />
        ))}
        {/* Faint grid behind the content */}
        <div
          aria-hidden="true"
          className="fx-grid pointer-events-none absolute inset-0 opacity-50"
        />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              {eyebrow && <div className="t-eyebrow">{eyebrow}</div>}
              <h2 className={hideTitle ? 'sr-only' : 't-h3 mt-1'} id="modal-title">
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="group grid h-9 w-9 place-items-center text-fg-muted transition-colors duration-200 hover:text-[#ff3d2e] focus-visible:text-[#ff3d2e]"
            >
              <span className="sr-only">Close</span>
              {/* On hover / keyboard focus: spins a half-turn and turns signal orange-red. */}
              <svg
                className="h-5 w-5 transition-transform duration-300 ease-out group-hover:rotate-180 group-focus-visible:rotate-180 motion-reduce:transition-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="square" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5 text-fg">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex flex-wrap justify-end gap-2 border-t bg-muted-bg/80 px-5 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
