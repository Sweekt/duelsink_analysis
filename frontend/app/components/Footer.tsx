import React from 'react';

export const Footer = () => {
	return (
		<footer className="w-full mt-auto pt-6 pb-2 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-gray-500 gap-4">

			{/* GAUCHE : Disclaimer */}
			<div className="text-[12px] text-gray-600 text-center md:text-left max-w-xl">
				Duels.ink Analyzer is a fan-made tool.<br/>
				This website is not affiliated with, nor approved by Ravensburger or Disney.<br/>
				Lorcana is a registered trademark of Disney.
			</div>

			{/* DROITE : Crédits */}
			<div className="flex flex-col items-center md:items-end text-sm">
				<p>
					Made by{' '}
					<a
						href="https://sweek.ovh"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-400 hover:text-purple-400 hover:underline transition-colors font-semibold"
					>
						Benjamin "Sweek" Roy
					</a>
				</p>
				<p className="mt-1 text-xs md:text-sm">
					Team member of <span className="font-medium text-violet-500">LoreKeepers</span>
				</p>
			</div>

		</footer>
	);
};