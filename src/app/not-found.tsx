

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
	return (
		<React.Fragment>
			<div className="page-404-container">
				<div className="page-404">
					<div className="noise"></div>
					<div className="overlay"></div>
					<div className="terminal">
						<h1>
							Error <span className="errorcode">404</span>
						</h1>
						<p className="output">
							The page you are looking for might have been removed, had its name changed or is
							temporarily unavailable.
						</p>
						<p className="output">
							Please try to{' '}
							<Link href="/" className="not-found">
								return to the homepage
							</Link>
							.
						</p>
						<p className="output">Good luck.</p>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}
