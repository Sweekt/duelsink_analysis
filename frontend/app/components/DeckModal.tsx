import React from 'react';
import { getColors } from "@/app/utils/Color";

export const DeckModal = ({ deck, onClose }) => {
	// Rend une cellule de statistique
	const renderCell = (wins, games) => {
		if (games === 0) return <span className="text-gray-600 font-medium">-</span>;
		const wr = (wins / games) * 100;
		return (
			<div className="flex flex-col items-center">
				<span className={`font-bold ${wr >= 50 ? 'text-green-400' : 'text-red-400'}`}>{wr.toFixed(1)}%</span>
				<span className="text-xs text-gray-500">({wins}/{games})</span>
			</div>
		);
	};

	const { color1, color2 } = getColors(deck.colors);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
			{/* Conteneur principal de la modale */}
			<div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-7xl max-h-[95vh] md:max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden animate-[scaleIn_0.2s_ease-out_forwards]">

				{/* Liseré de couleur */}
				<div className="h-2 md:h-3 w-full shrink-0" style={{ background: `linear-gradient(to right, ${color1}, ${color2})` }}></div>

				{/* Header responsive */}
				<div className="p-4 md:p-6 border-b border-gray-700 flex justify-between items-start shrink-0">
					<div className="pr-4">
						<h2 className="text-xl md:text-3xl font-extrabold text-white mb-1 leading-tight">{deck.colors}</h2>
						<p className="text-gray-400 text-xs md:text-sm">{deck.games} total games played</p>
					</div>
					<button onClick={onClose} className="p-2 bg-gray-700 hover:bg-red-500 rounded-full transition-colors text-white shrink-0">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* ==================================================== */}
				{/* VUE MOBILE : Liste de cartes (Cachée sur grand écran) */}
				{/* ==================================================== */}
				<div className="md:hidden flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-900/20">

					{/* Carte Globale */}
					<div className="bg-gray-700/40 border border-gray-600 rounded-xl p-4 shadow-sm">
						<h3 className="text-center font-bold text-white mb-3 uppercase tracking-wider text-sm">Global (All)</h3>
						<div className="grid grid-cols-3 gap-2">
							<div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg">
								<span className="text-[10px] text-gray-400 uppercase mb-1">Win Rate</span>
								{renderCell(deck.wins, deck.games)}
							</div>
							<div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg">
								<span className="text-[10px] text-gray-400 uppercase mb-1">OTP</span>
								{renderCell(deck.otpWins, deck.otpGames)}
							</div>
							<div className="flex flex-col items-center bg-gray-800 p-2 rounded-lg">
								<span className="text-[10px] text-gray-400 uppercase mb-1">OTD</span>
								{renderCell(deck.otdWins, deck.otdGames)}
							</div>
						</div>
					</div>

					{/* Cartes par Matchup */}
					{deck.sortedMatchups.map((matchup, i) => {
						const { color1, color2 } = getColors(matchup.opponent);
						return (
							<div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-sm">
								<div className="flex items-center justify-center gap-2 mb-3">
									<h3 className="font-semibold text-gray-200 text-sm">VS</h3>
									<div className="flex -space-x-1">
										<div className="w-5 h-5 rounded-full shadow-sm border border-gray-600" style={{ backgroundColor: color1 }}></div>
										<div className="w-5 h-5 rounded-full shadow-sm border border-gray-600" style={{ backgroundColor: color2 }}></div>
									</div>
								</div>
								<div className="grid grid-cols-3 gap-2">
									<div className="flex flex-col items-center bg-gray-900/50 p-2 rounded-lg">
										<span className="text-[10px] text-gray-400 uppercase mb-1">Win Rate</span>
										{renderCell(matchup.wins, matchup.games)}
									</div>
									<div className="flex flex-col items-center bg-gray-900/50 p-2 rounded-lg">
										<span className="text-[10px] text-gray-400 uppercase mb-1">OTP</span>
										{renderCell(matchup.otpWins, matchup.otpGames)}
									</div>
									<div className="flex flex-col items-center bg-gray-900/50 p-2 rounded-lg">
										<span className="text-[10px] text-gray-400 uppercase mb-1">OTD</span>
										{renderCell(matchup.otdWins, matchup.otdGames)}
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* ==================================================== */}
				{/* VUE DESKTOP : Tableau (Caché sur mobile)               */}
				{/* ==================================================== */}
				<div className="hidden md:block p-6 overflow-x-auto flex-grow custom-scrollbar">
					<table className="w-full text-sm text-left border-collapse min-w-[600px]">
						<thead>
						<tr>
							<th className="p-4 bg-gray-900 border border-gray-700 text-gray-400 font-semibold uppercase tracking-wider sticky left-0 z-10 w-40">Metrics</th>
							<th className="p-4 bg-gray-800 border border-gray-700 text-center font-bold text-white uppercase tracking-wider min-w-[100px]">Global (All)</th>
							{deck.sortedMatchups.map((matchup, i) => {
								const { color1, color2 } = getColors(matchup.opponent);
								return (
									<th key={i} className="p-4 bg-gray-800 border border-gray-700 text-center min-w-[80px] hover:bg-gray-750 transition-colors" title={`Vs ${matchup.opponent}`}>
										<div className="flex justify-center -space-x-1">
											<div className="w-5 h-5 rounded-full shadow-sm border border-gray-600" style={{ backgroundColor: color1 }}></div>
											<div className="w-5 h-5 rounded-full shadow-sm border border-gray-600" style={{ backgroundColor: color2 }}></div>
										</div>
									</th>
								);
							})}
						</tr>
						</thead>
						<tbody>
						<tr className="hover:bg-gray-750 transition-colors">
							<td className="p-4 bg-gray-900 border border-gray-700 font-bold text-gray-200 sticky left-0 z-10">Win Rate</td>
							<td className="p-4 border border-gray-700 bg-gray-800/50">{renderCell(deck.wins, deck.games)}</td>
							{deck.sortedMatchups.map((m, i) => <td key={i} className="p-4 border border-gray-700 bg-gray-800/50">{renderCell(m.wins, m.games)}</td>)}
						</tr>
						<tr className="hover:bg-gray-750 transition-colors">
							<td className="p-4 bg-gray-900 border border-gray-700 font-semibold text-gray-300 sticky left-0 z-10">Going First (OTP)</td>
							<td className="p-4 border border-gray-700">{renderCell(deck.otpWins, deck.otpGames)}</td>
							{deck.sortedMatchups.map((m, i) => <td key={i} className="p-4 border border-gray-700">{renderCell(m.otpWins, m.otpGames)}</td>)}
						</tr>
						<tr className="hover:bg-gray-750 transition-colors">
							<td className="p-4 bg-gray-900 border border-gray-700 font-semibold text-gray-300 sticky left-0 z-10">Going Second (OTD)</td>
							<td className="p-4 border border-gray-700">{renderCell(deck.otdWins, deck.otdGames)}</td>
							{deck.sortedMatchups.map((m, i) => <td key={i} className="p-4 border border-gray-700">{renderCell(m.otdWins, m.otdGames)}</td>)}
						</tr>
						</tbody>
					</table>
				</div>

			</div>
		</div>
	);
};