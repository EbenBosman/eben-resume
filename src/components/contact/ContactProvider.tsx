'use client';

import React, { ChangeEvent, createContext, useContext, useEffect, useRef, useState } from 'react';

import { HudButton } from '../hud/HudButton';
import Modal from '../Modal';

const EMAIL_RE =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const MAX_MESSAGE_LENGTH = 5000; // matches the server limit in /api/message
const STATUS_DISPLAY_MS = 5000;

const isTextEmpty = (text: string): boolean => text.length === 0;
const isTextLessThan50 = (text: string): boolean => text.length <= 49 && text !== '';
const isValidEmail = (email: string): boolean => EMAIL_RE.test(email);

const ContactContext = createContext<{ openContact: () => void }>({ openContact: () => {} });

/** Opens the contact modal from anywhere under <ContactProvider> (desktop nav, mobile drawer, hero, footer). */
export const useContact = () => useContext(ContactContext);

/** Owns the contact form state and its modal; children open it via useContact(). */
export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [isMessageSending, setMessageLoading] = useState<boolean>(false);
  const [isMessageSuccess, setMessageSuccess] = useState<boolean>(false);
  const [isMessageError, setMessageError] = useState<boolean>(false);
  const [messageErrorText, setMessageErrorText] = useState<string>('');

  const [email, setEmail] = useState<string>('');
  const [isEmailValid, setEmailValid] = useState<boolean>(true);
  const [emailInvalidText, setEmailInvalidText] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isMessageValid, setMessageValid] = useState<boolean>(true);
  const [messageInvalidText, setMessageInvalidText] = useState<string>('');
  // Hidden honeypot field (see the form); people never see it, so only bots fill it in.
  const honeypotRef = useRef<HTMLInputElement>(null);

  // The success/error banner auto-hides after a delay. Keep the timer so a new send, closing
  // the modal, or unmounting cancels it instead of it firing into a later interaction.
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearStatusTimer = () => {
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = null;
  };
  const scheduleStatusReset = (reset: () => void) => {
    clearStatusTimer();
    statusTimer.current = setTimeout(reset, STATUS_DISPLAY_MS);
  };
  useEffect(() => clearStatusTimer, []);

  const closeModal = () => {
    clearStatusTimer();
    setMessageSuccess(false);
    setMessageError(false);
    setMessageErrorText('');
    setShowModal(false);
  };

  const sendMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    clearStatusTimer();
    setMessageLoading(true);
    setMessageSuccess(false);
    setMessageError(false);
    setMessageErrorText('');

    if (!isEmailValid || !isMessageValid) {
      setMessageLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, email, company: honeypotRef.current?.value ?? '' }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to send message');
      }

      setMessageLoading(false);
      setMessageSuccess(true);
      setEmail('');
      setMessage('');

      scheduleStatusReset(closeModal);
    } catch (error: any) {
      console.error(error);
      setMessageLoading(false);
      setMessageError(true);
      setMessageErrorText(error.message || 'Something went wrong. Please try again later.');

      scheduleStatusReset(() => {
        setMessageError(false);
        setMessageErrorText('');
      });
    }
  };

  const changeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const rawEmail = e.target.value;
    setEmail(rawEmail);

    if (isTextEmpty(rawEmail)) {
      setEmailValid(false);
      setEmailInvalidText('Please provide an email address.');
    } else if (!isValidEmail(rawEmail)) {
      setEmailValid(false);
      setEmailInvalidText('Please provide a valid email address.');
    } else {
      setEmailValid(true);
      setEmailInvalidText('');
    }
  };

  const changeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const rawMessage = e.target.value;
    setMessage(rawMessage);

    if (isTextEmpty(rawMessage)) {
      setMessageValid(false);
      setMessageInvalidText('Please provide a message of at least 50 characters.');
    } else if (isTextLessThan50(rawMessage)) {
      setMessageValid(false);
      setMessageInvalidText(
        `The minimum required message length is 50 characters. (${50 - rawMessage.length} to go)`,
      );
    } else {
      setMessageValid(true);
      setMessageInvalidText('');
    }
  };

  const clearMessageFields = () => {
    setEmail('');
    setEmailValid(true);
    setEmailInvalidText('');
    setMessage('');
    setMessageValid(true);
    setMessageInvalidText('');
    closeModal();
  };

  const sendDisabled =
    isMessageSending ||
    isTextEmpty(message) ||
    isTextEmpty(email) ||
    !isValidEmail(email) ||
    isTextLessThan50(message);

  return (
    <ContactContext.Provider value={{ openContact: () => setShowModal(true) }}>
      {children}
      <Modal
        isOpen={showModal}
        onClose={() => !isMessageSending && closeModal()}
        eyebrow="// CHANNEL.OPEN"
        title="Contact Eben Bosman"
        hideTitle
        footer={
          <>
            <HudButton
              variant="outline"
              size="sm"
              onClick={clearMessageFields}
              disabled={isMessageSending}
            >
              <span>$ close</span>
            </HudButton>
            <HudButton
              size="sm"
              onClick={sendMessage}
              disabled={sendDisabled}
              aria-busy={isMessageSending || undefined}
            >
              <span>{isMessageSending ? '$ sending…' : '$ send message'}</span>
              <span aria-hidden="true">&rarr;</span>
            </HudButton>
          </>
        }
      >
        <form noValidate>
          {/* Honeypot: hidden from people and assistive tech; bots that fill it are ignored. */}
          <input
            ref={honeypotRef}
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          {isMessageSuccess && (
            <div
              className="relative mb-4 overflow-hidden border border-green-600 bg-green-50 p-3 text-green-800 dark:bg-green-950/40 dark:text-green-300"
              role="alert"
            >
              <strong className="t-mono font-bold">{'// SENT'}</strong>
              <span className="block sm:inline"> Thanks, I&apos;ll get back to you soon.</span>
              <div className="animate-progress absolute bottom-0 left-0 h-1 bg-green-600"></div>
            </div>
          )}
          {isMessageError && (
            <div
              className="relative mb-4 overflow-hidden border border-red-600 bg-red-50 p-3 text-red-800 dark:bg-red-950/40 dark:text-red-300"
              role="alert"
            >
              <strong className="t-mono font-bold">{'// ERROR'}</strong>
              <span className="block sm:inline"> {messageErrorText}</span>
              <div className="animate-progress absolute bottom-0 left-0 h-1 bg-red-600"></div>
            </div>
          )}
          <Field id="email" label="email.address" error={!isEmailValid && emailInvalidText}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="hud-input"
              value={email}
              onChange={changeEmail}
              aria-invalid={!isEmailValid || undefined}
              aria-describedby={!isEmailValid ? 'email-error' : undefined}
              disabled={isMessageSending}
            />
          </Field>
          <Field id="message-text" label="message" error={!isMessageValid && messageInvalidText}>
            <textarea
              id="message-text"
              name="message-text"
              rows={5}
              maxLength={MAX_MESSAGE_LENGTH}
              className="hud-input"
              value={message}
              onChange={changeMessage}
              aria-invalid={!isMessageValid || undefined}
              aria-describedby={!isMessageValid ? 'message-text-error' : undefined}
              disabled={isMessageSending}
            />
            {/* The 50-character minimum, made visible while typing (decorative; the rule itself
                is announced through the field's error text). */}
            <div aria-hidden="true" className="t-mono mt-1 flex justify-end text-xs">
              <span
                style={{
                  color: message.length >= 50 ? 'var(--accent-text)' : 'var(--fg-subtle)',
                }}
              >
                {message.length < 50 ? `${message.length} / 50 min` : `${message.length} chars ✓`}
              </span>
            </div>
          </Field>
        </form>
      </Modal>
    </ContactContext.Provider>
  );
};

const Field: React.FC<{
  id: string;
  label: string;
  error: string | false;
  children: React.ReactNode;
}> = ({ id, label, error, children }) => (
  <div className="mb-4">
    {/* Console-style label: a Cesium-blue prompt before the field name. */}
    <label htmlFor={id} className="t-mono mb-2 block text-sm text-fg-muted">
      <span aria-hidden="true" className="mr-1.5 text-accent-text">
        &gt;
      </span>
      {label}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
        {error}
      </p>
    )}
  </div>
);
