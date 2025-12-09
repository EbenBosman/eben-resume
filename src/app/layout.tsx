import './globals.css';
import { Providers } from './providers';

import favIcon from '../images/fav.jpg';

export const metadata = {
	title: 'Eben Bosman Resume',
	description: 'Resume for Eben Bosman', icons: {
		icon: favIcon.src,
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
			</head>
			<body className="bg-background text-foreground transition-colors duration-300">
				<Providers>
					<div id="app" className="min-h-screen">
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
