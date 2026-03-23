import React from 'react';
import {getColors} from "@/app/utils/Color";

// Modale de détail d'un deck

export const DeckModal = ({ deck, onClose }) => {
	// Rend une cellule du tableau
	const renderCell = (wins, games) => {
		if (games === 0) return <span className="text-gray-600">-</span>;
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
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
			<div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-7xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden animate-[scaleIn_0.2s_ease-out_forwards]">
				<div className="h-3 w-full shrink-0" style={{ background: `linear-gradient(to right, ${color1}, ${color2})` }}></div>

				<div className="p-6 border-b border-gray-700 flex justify-between items-center shrink-0">
					<div>
						<h2 className="text-3xl font-extrabold text-white mb-1">{deck.colors} - Detailed Analysis</h2>
						<p className="text-gray-400 text-sm">{deck.games} total games played</p>
					</div>
					<button onClick={onClose} className="p-2 bg-gray-700 hover:bg-red-500 rounded-full transition-colors text-white">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
					</button>
				</div>

				<div className="p-6 overflow-x-auto flex-grow custom-scrollbar">
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