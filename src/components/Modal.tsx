'use client';

import React, { useEffect, useRef } from 'react';

import { Button } from './ui/Button';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
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
      if (event.shiftKey && (active === first || !dialog?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialog?.contains(active))) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50 backdrop-blur-sm p-4">
      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-lg transform rounded-lg bg-surface border shadow-xl transition-all focus:outline-none"
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-medium leading-6 text-foreground" id="modal-title">
            {title}
          </h2>
          <Button variant="ghost" onClick={onClose}>
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        {/* Body */}
        <div className="px-4 py-6 text-foreground space-y-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="bg-background-alt px-4 py-3 flex justify-end space-x-2 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
