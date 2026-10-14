'use client';

import { faGithub, faLinkedin, faStackOverflow } from '@fortawesome/free-brands-svg-icons';
import { faBars, faEnvelope, faFilePdf, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import React, { ChangeEvent, useEffect, useRef, useState, useSyncExternalStore } from 'react';

import fullResolutionProfilePicture from '../images/eben-profile.webp';
import { Basics } from '../types/resume';
import ProfilePic from './content/side-bar-content/ProfilePic';
import Modal from './Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { TextArea } from './ui/TextArea';

interface SidebarProps {
  basics: Basics;
}

const emptySubscribe = () => () => {};

const EMAIL_RE =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const MAX_MESSAGE_LENGTH = 5000; // matches the server limit in /api/message
const STATUS_DISPLAY_MS = 5000;

const isTextEmpty = (text: string): boolean => text.length === 0;
const isTextLessThan50 = (text: string): boolean => text.length <= 49 && text !== '';
const isValidEmail = (email: string): boolean => EMAIL_RE.test(email);

const Sidebar: React.FC<SidebarProps> = ({ basics }) => {
  const { resolvedTheme, setTheme } = useTheme();
  // The resolved theme ('system' → light/dark) is only known client-side; gate on
  // hydration so the SSR'd toggle label matches the initial client render.
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const isDark = hydrated && resolvedTheme === 'dark';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    const messageDetails = {
      message,
      email,
      company: honeypotRef.current?.value ?? '',
    };

    try {
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageDetails),
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
      setEmailInvalidText('Please provide an valid address.');
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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <React.Fragment>
      <div className="w-full md:w-1/4 xl:w-1/5 bg-sidebar border-b md:border-b-0 md:border-r border-sidebar-border flex-shrink-0">
        {/* ================= MOBILE LAYOUT ================= */}
        <div className="md:hidden w-full bg-sidebar">
          {/* Mobile Header: Profile Pic + Hamburger */}
          <div className="flex justify-between items-center px-4 h-16 border-b border-sidebar-border z-50 relative bg-sidebar">
            <div className="flex-shrink-0 flex items-center">
              <Image
                src={fullResolutionProfilePicture}
                alt="Eben Bosman"
                width={40}
                height={40}
                placeholder="blur"
                className="rounded-full w-10 h-10 shadow-sm object-cover"
              />
            </div>
            <button
              className="text-white focus:outline-none focus:ring-2 focus:ring-primary rounded p-1 flex items-center justify-center h-10 w-10"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <FontAwesomeIcon icon={faBars} className="fa-lg md:fa-lg md:fa-2x" />
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          <div
            id="mobile-menu"
            inert={!isMobileMenuOpen}
            className={`flex flex-col w-full bg-sidebar border-b border-sidebar-border px-4 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100 pb-6' : 'max-h-0 opacity-0 pb-0'}`}
          >
            {/* 1. Social Icons (Row) */}
            <ul className="flex flex-row justify-center items-center w-full mt-6 space-x-8">
              <li className="nav-item">
                <a
                  rel="noreferrer"
                  href={basics.social.github}
                  className="text-white hover:text-primary transition-colors cursor-pointer"
                  target="_blank"
                  title="Github"
                  aria-label="GitHub profile"
                >
                  <FontAwesomeIcon icon={faGithub} className="fa-lg md:fa-2x" />
                </a>
              </li>
              <li className="nav-item">
                <a
                  rel="noreferrer"
                  href={basics.social.stackOverflow}
                  className="text-white hover:text-primary transition-colors cursor-pointer"
                  target="_blank"
                  title="Stack Overflow"
                  aria-label="Stack Overflow profile"
                >
                  <FontAwesomeIcon icon={faStackOverflow} className="fa-lg md:fa-2x" />
                </a>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="text-white hover:text-primary transition-colors bg-transparent border-0 cursor-pointer"
                  onClick={() => {
                    closeMobileMenu();
                    setShowModal(true);
                  }}
                  title="Mail Me"
                  aria-label="Mail me"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="fa-lg md:fa-2x" />
                </button>
              </li>
              <li className="nav-item">
                <a
                  rel="noreferrer"
                  href={basics.social.linkedIn}
                  className="text-white hover:text-primary transition-colors cursor-pointer"
                  target="_blank"
                  title="LinkedIn"
                  aria-label="LinkedIn profile"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="fa-lg md:fa-2x" />
                </a>
              </li>
              <li className="nav-item">
                <a
                  rel="noopener noreferrer"
                  href="/api/pdf-resume"
                  target="_blank"
                  className="text-white hover:text-primary transition-colors cursor-pointer"
                  title="Download PDF Resume"
                  aria-label="Download PDF resume"
                >
                  <FontAwesomeIcon icon={faFilePdf} className="fa-lg md:fa-2x" />
                </a>
              </li>
            </ul>

            {/* 2. Navigation Links (Column) */}
            <ul className="flex flex-col w-full space-y-4 mt-8 items-center">
              <li className="w-full text-center">
                <a
                  className="block py-2 text-white text-lg font-medium hover:text-primary"
                  onClick={closeMobileMenu}
                  href="#about"
                >
                  About
                </a>
              </li>
              <li className="w-full text-center">
                <a
                  className="block py-2 text-white text-lg font-medium hover:text-primary"
                  onClick={closeMobileMenu}
                  href="#ataru"
                >
                  Ataru.io
                </a>
              </li>
              <li className="w-full text-center">
                <a
                  className="block py-2 text-white text-lg font-medium hover:text-primary"
                  onClick={closeMobileMenu}
                  href="#certificates"
                >
                  Certificates
                </a>
              </li>
              <li className="w-full text-center">
                <a
                  className="block py-2 text-white text-lg font-medium hover:text-primary"
                  onClick={closeMobileMenu}
                  href="#experience"
                >
                  Experience
                </a>
              </li>
              <li className="w-full text-center">
                <a
                  className="block py-2 text-white text-lg font-medium hover:text-primary"
                  onClick={closeMobileMenu}
                  href="#skills"
                >
                  Skills
                </a>
              </li>
            </ul>

            {/* Mobile Dark Mode Toggle */}
            <div className="w-full mt-8 pt-4 border-t border-sidebar-border flex justify-center">
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="flex items-center text-white hover:text-primary cursor-pointer"
              >
                <span className="mr-2">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="fa-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= DESKTOP LAYOUT ================= */}
        <nav
          id="sidebar"
          className="hidden md:flex flex-col items-center py-4 text-center sticky top-0 h-screen w-full bg-sidebar "
        >
          <div className="flex-1 flex flex-col items-center w-full overflow-y-auto no-scrollbar">
            {/* Desktop Profile Pic */}
            <ProfilePic />

            {/* Desktop Navigation & Socials */}
            <div className="flex flex-col w-full">
              {/* Social Links (Row as per original desktop design) */}
              <ul className="flex flex-row flex-wrap justify-center w-full mt-4 space-x-4">
                <li className="nav-item">
                  <a
                    rel="noreferrer"
                    href={basics.social.github}
                    className="text-white hover:text-primary transition-colors"
                    target="_blank"
                    title="Github"
                  >
                    <span className="sr-only">Github Profile</span>
                    <FontAwesomeIcon icon={faGithub} className="fa-lg" />
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    rel="noreferrer"
                    href={basics.social.stackOverflow}
                    className="text-white hover:text-primary transition-colors"
                    target="_blank"
                    title="Stack Overflow"
                  >
                    <span className="sr-only">Stack Overflow Profile</span>
                    <FontAwesomeIcon icon={faStackOverflow} className="fa-lg" />
                  </a>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="text-white hover:text-primary transition-colors bg-transparent border-0 cursor-pointer"
                    onClick={() => setShowModal(true)}
                    title="Mail Me"
                  >
                    <span className="sr-only">Mail Me</span>
                    <FontAwesomeIcon icon={faEnvelope} className="fa-lg" />
                  </button>
                </li>
                <li className="nav-item">
                  <a
                    rel="noreferrer"
                    href={basics.social.linkedIn}
                    className="text-white hover:text-primary transition-colors"
                    target="_blank"
                    title="LinkedIn"
                  >
                    <span className="sr-only">LinkedIn Profile</span>
                    <FontAwesomeIcon icon={faLinkedin} className="fa-lg" />
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    rel="noopener noreferrer"
                    href="/api/pdf-resume"
                    target="_blank"
                    className="text-white hover:text-primary transition-colors"
                    title="Download PDF Resume"
                  >
                    <span className="sr-only">PDF Resume</span>
                    <FontAwesomeIcon icon={faFilePdf} className="fa-lg" />
                  </a>
                </li>
              </ul>

              {/* Desktop Nav Links */}
              <ul className="flex flex-col w-full space-y-2 mt-4 items-center">
                <li className="nav-item w-full">
                  <a
                    className="block py-2 text-white hover:text-primary transition-colors"
                    href="#about"
                  >
                    About
                  </a>
                </li>
                <li className="nav-item w-full">
                  <a
                    className="block py-2 text-white hover:text-primary transition-colors"
                    href="#ataru"
                  >
                    Ataru.io
                  </a>
                </li>
                <li className="nav-item w-full">
                  <a
                    className="block py-2 text-white hover:text-primary transition-colors"
                    href="#certificates"
                  >
                    Certificates
                  </a>
                </li>
                <li className="nav-item w-full">
                  <a
                    className="block py-2 text-white hover:text-primary transition-colors"
                    href="#experience"
                  >
                    Experience
                  </a>
                </li>
                <li className="nav-item w-full">
                  <a
                    className="block py-2 text-white hover:text-primary transition-colors"
                    href="#skills"
                  >
                    Skills
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Desktop Dark Mode Toggle */}
          <div className="w-full mt-auto mb-4 px-4 pt-4 border-sidebar-border">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="flex items-center justify-center text-white hover:text-primary transition-colors cursor-pointer w-full py-2"
              title="Toggle Dark Mode"
            >
              <span className="inline mr-2">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="fa-lg" />
            </button>
          </div>
        </nav>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => !isMessageSending && closeModal()}
        title="Contact Me"
        footer={
          <>
            <Button variant="secondary" onClick={clearMessageFields} disabled={isMessageSending}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={sendMessage}
              disabled={
                isMessageSending ||
                isTextEmpty(message) ||
                isTextEmpty(email) ||
                !isValidEmail(email) ||
                isTextLessThan50(message)
              }
            >
              {isMessageSending ? 'Sending...' : 'Send'}
            </Button>
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
              className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded relative overflow-hidden"
              role="alert"
            >
              <strong className="font-bold">Email Successfully Sent</strong>
              <span className="block sm:inline"> Expect a response soon.</span>
              <div className="absolute bottom-0 left-0 h-1 bg-green-400 animate-progress"></div>
            </div>
          )}
          {isMessageError && (
            <div
              className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded relative overflow-hidden"
              role="alert"
            >
              <strong className="font-bold">Something went wrong</strong>
              <span className="block sm:inline"> {messageErrorText}</span>
              <div className="absolute bottom-0 left-0 h-1 bg-red-400 animate-progress"></div>
            </div>
          )}
          <Input
            id="email"
            label="Your Email Address"
            value={email}
            onChange={changeEmail}
            error={!isEmailValid ? emailInvalidText : undefined}
            name="email"
            disabled={isMessageSending}
          />
          <TextArea
            id="message-text"
            label="Message"
            value={message}
            onChange={changeMessage}
            error={!isMessageValid ? messageInvalidText : undefined}
            name="message-text"
            rows={5}
            maxLength={MAX_MESSAGE_LENGTH}
            disabled={isMessageSending}
          />
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default Sidebar;
