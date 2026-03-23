import React from 'react';
import {getColors} from "@/app/utils/Color";

// Carte individuelle pour un Deck

export const DeckCard = ({ archetype, onClick, index }) => {
	const { color1, color2 } = getColors(archetype.colors);
	const winRate = ((archetype.wins / archetype.games) * 100).toFixed(1);
	const isPositive = winRate >= 50;

	// Calcul du délai d'animation pour un effet d'apparition en cascade
	const animationDelay = `${index * 0.1}s`;

	return (
		<div
			onClick={onClick}
			className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/20 border border-gray-700 cursor-pointer group opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
			style={{ animationDelay }}
		>
			<div className="h-3 w-full group-hover:h-4 transition-all duration-300" style={{ background: `linear-gradient(to right, ${color1}, ${color2})` }}></div>
			<div className="p-6 flex-grow flex flex-col justify-between relative">
				<div className="absolute top-4 right-4 text-gray-600 group-hover:text-blue-400 transition-colors">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
				</div>
				<div className="mb-6 border-b border-gray-700 pb-4">
					<div className="flex items-center gap-2 mb-1 pr-6">
						<div className="flex -space-x-1 shrink-0">
							<div className="w-4 h-4 rounded-full shadow-sm border border-gray-900" style={{ backgroundColor: color1 }}></div>
							<div className="w-4 h-4 rounded-full shadow-sm border border-gray-900" style={{ backgroundColor: color2 }}></div>
						</div>
						<h2 className="text-xl font-bold truncate" title={archetype.colors}>{archetype.colors}</h2>
					</div>
					<p className="text-gray-400 text-sm font-medium">{archetype.games} games played</p>
				</div>
				<div className="mb-6 flex items-baseline gap-2">
					<span className={`text-4xl font-extrabold tracking-tighter ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{winRate}%</span>
					<span className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Win Rate</span>
				</div>
				<div className="grid grid-cols-2 gap-3 mt-auto">
					<div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700/50 group-hover:bg-gray-900/80 transition-colors">
						<p className="text-[11px] text-gray-400 mb-1 font-semibold uppercase">Going first</p>
						{archetype.otpGames > 0 ? <p className="font-bold text-lg text-gray-200">{((archetype.otpWins / archetype.otpGames) * 100).toFixed(0)}% <span className="text-xs font-normal text-gray-500 ml-1">({archetype.otpGames})</span></p> : <p className="text-gray-600 text-sm">-</p>}
					</div>
					<div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700/50 group-hover:bg-gray-900/80 transition-colors">
						<p className="text-[11px] text-gray-400 mb-1 font-semibold uppercase">Going second</p>
						{archetype.otdGames > 0 ? <p className="font-bold text-lg text-gray-200">{((archetype.otdWins / archetype.otdGames) * 100).toFixed(0)}% <span className="text-xs font-normal text-gray-500 ml-1">({archetype.otdGames})</span></p> : <p className="text-gray-600 text-sm">-</p>}
					</div>
				</div>
			</div>
		</div>
	);
};