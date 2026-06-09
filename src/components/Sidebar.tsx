'use client';

import React, { useState, ChangeEvent } from 'react';

import Image from 'next/image';
import { useTheme } from 'next-themes';

import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faStackOverflow, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faFilePdf, faMoon, faSun, faBars } from '@fortawesome/free-solid-svg-icons';

import { Basics } from '../types/resume';
import fullResolutionProfilePicture from '../images/eben-profile.webp';

import ProfilePic from './content/side-bar-content/ProfilePic';
import Modal from './Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { TextArea } from './ui/TextArea';

interface SidebarProps {
  basics: Basics;
}

const Sidebar: React.FC<SidebarProps> = ({ basics }) => {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPdfLoading, setPdfIsLoading] = useState<boolean>(false);
  const [isPdfIsErrored, setPdfIsErrored] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const constructResumeFileName = (name: string): string => {
    const date = new Date();
    const formattedDate = date
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .replace(/ /g, ' ');

    return `Resume of ${name} (${formattedDate}).pdf`;
  };

  const createAndDownloadPdf = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setPdfIsLoading(true);

    try {
      const res = await fetch('/api/pdf-resume', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await res.blob();
      saveAs(blob, constructResumeFileName('Eben Bosman'));
      setPdfIsLoading(false);
    } catch (error) {
      console.error(error);
      setPdfIsLoading(false);
      setPdfIsErrored(true);
      setTimeout(() => {
        setPdfIsErrored(false);
      }, 1000);
    }
  };

  const sendMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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

      setTimeout(() => {
        setMessageSuccess(false);
        setShowModal(false);
      }, 5000);
    } catch (error: any) {
      console.error(error);
      setMessageLoading(false);
      setMessageError(true);
      setMessageErrorText(error.message || 'Something went wrong. Please try again later.');

      setTimeout(() => {
        setMessageError(false);
        setMessageErrorText('');
      }, 5000);
    }
  };

  const changeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const rawEmail = e.target.value;
    setEmail(rawEmail);

    // eslint-disable-next-line no-useless-escape
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

  const isTextEmpty = (text: string): boolean => {
    return text.length === 0 && text === '';
  };

  const isTextLessThan50 = (text: string): boolean => {
    return text.length <= 49 && text !== '';
  };

  const isValidEmail = (email: string): boolean => {
    // eslint-disable-next-line no-useless-escape
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const clearMessageFields = () => {
    setEmail('');
    setEmailValid(true);
    setEmailInvalidText('');

    setMessage('');
    setMessageValid(true);
    setMessageInvalidText('');

    setShowModal(false);
  };

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
            >
              <FontAwesomeIcon icon={faBars} className="fa-lg md:fa-lg md:fa-2x" />
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          <div
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
                >
                  <FontAwesomeIcon icon={faStackOverflow} className="fa-lg md:fa-2x" />
                </a>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="text-white hover:text-primary transition-colors bg-transparent border-0 cursor-pointer"
                  onClick={() => setShowModal(true)}
                  title="Mail Me"
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
                >
                  <FontAwesomeIcon icon={faLinkedin} className="fa-lg md:fa-2x" />
                </a>
              </li>
              <li className="nav-item">
                <a
                  rel="noreferrer"
                  href="#"
                  className={`text-white hover:text-primary transition-colors cursor-pointer ${isPdfLoading ? 'animate-flicker' : ''} ${isPdfIsErrored ? 'shake' : ''}`}
                  onClick={createAndDownloadPdf}
                  title="PDF Resume"
                >
                  <FontAwesomeIcon
                    icon={faFilePdf}
                    className="fa-lg md:fa-2x"
                    style={{ color: isPdfIsErrored ? 'red' : '' }}
                  />
                </a>
              </li>
            </ul>

            {/* 2. Navigation Links (Column) */}
            <ul className="flex flex-col w-full space-y-4 mt-8 items-center">
              <li className="w-full text-center">
                <a
                  className="block py-2 text-white text-lg font-medium hover:text-primary"
                  href="#about"
                >
                  About
                </a>
              </li>
              <li className="w-full text-center">
                <a
                  className="block py-2 text-white text-lg font-medium hover:text-primary"
                  href="#ataru"
                >
                  Ataru.io
                </a>
              </li>
              <li className="w-full text-center">
                <a
                  className="block py-2 text-white text-lg font-medium hover:text-primary"
                  href="#certificates"
                >
                  Certificates
                </a>
              </li>
              <li className="w-full text-center">
                <a
                  className="block py-2 text-white text-lg font-medium hover:text-primary"
                  href="#experience"
                >
                  Experience
                </a>
              </li>
              <li className="w-full text-center">
                <a
                  className="block py-2 text-white text-lg font-medium hover:text-primary"
                  href="#skills"
                >
                  Skills
                </a>
              </li>
            </ul>

            {/* Mobile Dark Mode Toggle */}
            <div className="w-full mt-8 pt-4 border-t border-sidebar-border flex justify-center">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center text-white hover:text-primary cursor-pointer"
              >
                <span className="mr-2">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="fa-lg" />
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
                    <span className="hidden">Github Profile</span>
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
                    <span className="hidden">Stack Overflow Profile</span>
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
                    <span className="hidden">Mail Me</span>
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
                    <span className="hidden">LinkedIn Profile</span>
                    <FontAwesomeIcon icon={faLinkedin} className="fa-lg" />
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    rel="noreferrer"
                    href="#"
                    className={`text-white hover:text-primary transition-colors ${isPdfLoading ? 'animate-flicker' : ''} ${isPdfIsErrored ? 'shake' : ''}`}
                    onClick={createAndDownloadPdf}
                    title="PDF Resume"
                  >
                    <span className="hidden">PDF Resume</span>
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      className="fa-lg"
                      style={{ color: isPdfIsErrored ? 'red' : '' }}
                    />
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
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center justify-center text-white hover:text-primary transition-colors cursor-pointer w-full py-2"
              title="Toggle Dark Mode"
            >
              <span className="inline mr-2">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="fa-lg" />
            </button>
          </div>
        </nav>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => !isMessageSending && setShowModal(false)}
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
            disabled={isMessageSending}
          />
        </form>
      </Modal>
    </React.Fragment>
  );
};

export default Sidebar;
