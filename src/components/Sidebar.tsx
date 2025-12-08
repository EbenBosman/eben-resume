import React, { useState, ChangeEvent } from 'react';
import { saveAs } from 'file-saver';
import { useTheme } from 'next-themes';
import { Basics } from '../types/resume';
import Image from 'next/image';
import fullResolutionProfilePicture from '../images/eben-profile.webp';

import ProfilePic from './content/side-bar-content/ProfilePic';
import Modal from './Modal';

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

		if (!isEmailValid || !isMessageValid) return;

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

			if (!res.ok) throw new Error('Failed to send message');

			setMessageLoading(false);
			setShowModal(false);
		} catch (error) {
			console.error(error);
			setMessageLoading(false);
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
			<div className="w-full md:w-1/4 xl:w-1/5 bg-gray-900 border-b md:border-b-0 md:border-r border-gray-700 flex-shrink-0">

				{/* ================= MOBILE LAYOUT ================= */}
				<div className="md:hidden w-full bg-gray-900">
					{/* Mobile Header: Profile Pic + Hamburger */}
					<div className="flex justify-between items-center px-4 h-16 border-b border-gray-700 z-50 relative bg-gray-900">
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
							<i className="fas fa-bars fa-2x"></i>
						</button>
					</div>

					{/* Mobile Dropdown Menu */}
					<div
						className={`flex flex-col w-full bg-gray-900 border-b border-gray-700 px-4 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100 pb-6' : 'max-h-0 opacity-0 pb-0'}`}
					>

						{/* 1. Social Icons (Row) */}
						<ul className="flex flex-row justify-center items-center w-full mt-6 space-x-8">
							<li className="nav-item">
								<a rel="noreferrer" href={basics.social.github} className="text-white hover:text-primary transition-colors" target="_blank" title="Github">
									<i className="fab fa-github fa-2x"></i>
								</a>
							</li>
							<li className="nav-item">
								<a rel="noreferrer" href={basics.social.stackOverflow} className="text-white hover:text-primary transition-colors" target="_blank" title="Stack Overflow">
									<i className="fab fa-stack-overflow fa-2x"></i>
								</a>
							</li>
							<li className="nav-item">
								<button type="button" className="text-white hover:text-primary transition-colors bg-transparent border-0 cursor-pointer" onClick={() => setShowModal(true)} title="Mail Me">
									<i className="fa fa-envelope fa-2x"></i>
								</button>
							</li>
							<li className="nav-item">
								<a rel="noreferrer" href={basics.social.linkedIn} className="text-white hover:text-primary transition-colors" target="_blank" title="LinkedIn">
									<i className="fab fa-linkedin fa-2x"></i>
								</a>
							</li>
							<li className="nav-item">
								<a rel="noreferrer" href="#" className={`text-white hover:text-primary transition-colors ${isPdfLoading ? 'animate-flicker' : ''}`} onClick={createAndDownloadPdf} title="PDF Resume">
									<i className={`fa fa-file-pdf fa-2x ${isPdfIsErrored ? 'shake' : ''}`} style={{ color: isPdfIsErrored ? 'red' : '' }}></i>
								</a>
							</li>
						</ul>

						{/* 2. Navigation Links (Column) */}
						<ul className="flex flex-col w-full space-y-4 mt-8 items-center">
							<li className="w-full text-center"><a className="block py-2 text-white text-lg font-medium hover:text-primary" href="#about">About</a></li>
							<li className="w-full text-center"><a className="block py-2 text-white text-lg font-medium hover:text-primary" href="#certificates">Certificates</a></li>
							<li className="w-full text-center"><a className="block py-2 text-white text-lg font-medium hover:text-primary" href="#experience">Experience</a></li>
							<li className="w-full text-center"><a className="block py-2 text-white text-lg font-medium hover:text-primary" href="#skills">Skills</a></li>
						</ul>

						{/* Mobile Dark Mode Toggle */}
						<div className="w-full mt-8 pt-4 border-t border-gray-700 flex justify-center">
							<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="flex items-center text-white hover:text-primary">
								<span className="mr-2">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
								<i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} fa-lg`}></i>
							</button>
						</div>
					</div>

				</div>


				{/* ================= DESKTOP LAYOUT ================= */}
				<nav
					id="sidebar"
					className="hidden md:flex flex-col items-center py-4 text-center sticky top-0 h-screen w-full bg-gray-900"
				>
					<div className="flex-1 flex flex-col items-center w-full overflow-y-auto no-scrollbar">

						{/* Desktop Profile Pic */}
						<ProfilePic />

						{/* Desktop Navigation & Socials */}
						<div className="flex flex-col w-full">

							{/* Social Links (Row as per original desktop design) */}
							<ul className="flex flex-row flex-wrap justify-center w-full mt-4 space-x-4">
								<li className="nav-item">
									<a rel="noreferrer" href={basics.social.github} className="text-white hover:text-primary transition-colors" target="_blank" title="Github">
										<span className="hidden">Github Profile</span>
										<i className="fab fa-github fa-lg"></i>
									</a>
								</li>
								<li className="nav-item">
									<a rel="noreferrer" href={basics.social.stackOverflow} className="text-white hover:text-primary transition-colors" target="_blank" title="Stack Overflow">
										<span className="hidden">Stack Overflow Profile</span>
										<i className="fab fa-stack-overflow fa-lg"></i>
									</a>
								</li>
								<li className="nav-item">
									<button type="button" className="text-white hover:text-primary transition-colors bg-transparent border-0 cursor-pointer" onClick={() => setShowModal(true)} title="Mail Me">
										<span className="hidden">Mail Me</span>
										<i className="fa fa-envelope fa-lg"></i>
									</button>
								</li>
								<li className="nav-item">
									<a rel="noreferrer" href={basics.social.linkedIn} className="text-white hover:text-primary transition-colors" target="_blank" title="LinkedIn">
										<span className="hidden">LinkedIn Profile</span>
										<i className="fab fa-linkedin fa-lg"></i>
									</a>
								</li>
								<li className="nav-item">
									<a rel="noreferrer" href="#" className={`text-white hover:text-primary transition-colors ${isPdfLoading ? 'animate-flicker' : ''}`} onClick={createAndDownloadPdf} title="PDF Resume">
										<span className="hidden">PDF Resume</span>
										<i className={`fa fa-file-pdf fa-lg ${isPdfIsErrored ? 'shake' : ''}`} style={{ color: isPdfIsErrored ? 'red' : '' }}></i>
									</a>
								</li>
							</ul>

							{/* Desktop Nav Links */}
							<ul className="flex flex-col w-full space-y-2 mt-4 items-center">
								<li className="nav-item w-full"><a className="block py-2 text-white hover:text-primary transition-colors" href="#about">About</a></li>
								<li className="nav-item w-full"><a className="block py-2 text-white hover:text-primary transition-colors" href="#certificates">Certificates</a></li>
								<li className="nav-item w-full"><a className="block py-2 text-white hover:text-primary transition-colors" href="#experience">Experience</a></li>
								<li className="nav-item w-full"><a className="block py-2 text-white hover:text-primary transition-colors" href="#skills">Skills</a></li>
							</ul>
						</div>
					</div>

					{/* Desktop Dark Mode Toggle */}
					<div className="w-full mt-auto mb-4 px-4 pt-4 border-t border-gray-700">
						<button
							onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
							className="flex items-center justify-center text-white hover:text-primary transition-colors w-full py-2"
							title="Toggle Dark Mode"
						>
							<span className="inline mr-2">
								{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
							</span>
							<i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} fa-lg`}></i>
						</button>
					</div>
				</nav>
			</div>

			<Modal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				title="Contact Me"
				footer={
					<>
						<button
							type="button"
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors"
							onClick={clearMessageFields}
						>
							Close
						</button>
						<button
							type="button"
							className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							onClick={sendMessage}
							disabled={
								isTextEmpty(message) ||
								isTextEmpty(email) ||
								!isValidEmail(email) ||
								isTextLessThan50(message)
							}
						>
							Send
						</button>
					</>
				}
			>
				<form noValidate>
					<div className="mb-4">
						<label
							htmlFor="email"
							className={`block mb-2 text-sm font-medium ${!isEmailValid ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
						>
							Your Email Address
						</label>
						<input
							type="text"
							className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white ${!isEmailValid ? 'border-red-500' : 'border-gray-300'}`}
							id="email"
							name="email"
							onChange={changeEmail}
							value={email}
						/>
						{!isEmailValid && (
							<p className="mt-1 text-sm text-red-500">{emailInvalidText}</p>
						)}
					</div>
					<div className="mb-4">
						<label
							htmlFor="message-text"
							className={`block mb-2 text-sm font-medium ${!isMessageValid ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
						>
							Message
						</label>
						<textarea
							className={`w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white ${!isMessageValid ? 'border-red-500' : 'border-gray-300'}`}
							id="message-text"
							name="message-text"
							onChange={changeMessage}
							rows={5}
							value={message}
						></textarea>
						{!isMessageValid && (
							<p className="mt-1 text-sm text-red-500">{messageInvalidText}</p>
						)}
					</div>
				</form>
			</Modal>
		</React.Fragment>
	);
};

export default Sidebar;
