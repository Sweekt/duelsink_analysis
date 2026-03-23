import React from 'react';

// Écran de chargement animé

export const LoadingModal = () => (
	<div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-gray-900/90 backdrop-blur-md transition-all duration-300">
		<div className="relative flex justify-center items-center w-24 h-24 mb-8">
			<div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
			<div className="absolute inset-2 rounded-full border-r-4 border-purple-500 animate-spin opacity-70" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
			<svg className="w-8 h-8 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
			</svg>
		</div>
		<h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse">
			Analyzing your matches...
		</h2>
		<p className="text-gray-400 mt-2 text-sm">Extracting lore, calculating win rates, and drawing graphs.</p>
	</div>
);