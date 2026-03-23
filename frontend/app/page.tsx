'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import colors from 'tailwindcss/colors';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const lorcanaColors = {
	'Amber': colors.amber[400],
	'Amethyst': colors.violet[700],
	'Emerald': colors.green[600],
	'Ruby': colors.red[700],
	'Sapphire': colors.blue[500],
	'Steel': colors.gray[400]
};

export default function Home() {
	const [stats, setStats] = useState(null);
	const [globalStats, setGlobalStats] = useState(null);
	const [mmrHistory, setMmrHistory] = useState([]);
	const [mmrHistoryByDay, setMmrHistoryByDay] = useState([]);
	const [chartMode, setChartMode] = useState('game');

	const [selectedDeck, setSelectedDeck] = useState(null);

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		Papa.parse(file, {
			header: true,
			dynamicTyping: true,
			complete: (results) => {
				processData(results.data);
			},
		});
	};

	const processData = (data) => {
		const colorMap = {};

		const global = {
			games: 0, wins: 0,
			otpGames: 0, otpWins: 0,
			otdGames: 0, otdWins: 0
		};

		const mmrData = [];
		const dayMap = {};

		const validRows = data.filter(row => row['My Colors'] && row['Result']);
		const sortedData = validRows.sort((a, b) => new Date(a['Started At']) - new Date(b['Started At']));

		sortedData.forEach((row, index) => {
			const colorDuo = row['My Colors'];
			const isWin = row.Result === 'Win';

			global.games++;
			if (isWin) global.wins++;

			if (row['Turn Order'] === 'OTP') {
				global.otpGames++;
				if (isWin) global.otpWins++;
			} else if (row['Turn Order'] === 'OTD') {
				global.otdGames++;
				if (isWin) global.otdWins++;
			}

			if (row['MMR After']) {
				const gameDate = row['Started At'] ? row['Started At'].split(' ')[0] : '';
				const gameEntry = {
					match: index + 1,
					date: gameDate,
					mmr: row['MMR After'],
					deck: colorDuo
				};
				mmrData.push(gameEntry);
				if (gameDate) dayMap[gameDate] = gameEntry;
			}

			if (!colorMap[colorDuo]) {
				colorMap[colorDuo] = {
					colors: colorDuo,
					games: 0, wins: 0,
					otpWins: 0, otpGames: 0,
					otdWins: 0, otdGames: 0,
					matchups: {}
				};
			}

			colorMap[colorDuo].games++;
			if (isWin) colorMap[colorDuo].wins++;

			if (row['Turn Order'] === 'OTP') {
				colorMap[colorDuo].otpGames++;
				if (isWin) colorMap[colorDuo].otpWins++;
			} else if (row['Turn Order'] === 'OTD') {
				colorMap[colorDuo].otdGames++;
				if (isWin) colorMap[colorDuo].otdWins++;
			}

			const oppColor = row['Opponent Colors'] || 'Unknown';
			if (!colorMap[colorDuo].matchups[oppColor]) {
				colorMap[colorDuo].matchups[oppColor] = {
					opponent: oppColor,
					games: 0, wins: 0,
					otpGames: 0, otpWins: 0,
					otdGames: 0, otdWins: 0
				};
			}

			colorMap[colorDuo].matchups[oppColor].games++;
			if (isWin) colorMap[colorDuo].matchups[oppColor].wins++;

			if (row['Turn Order'] === 'OTP') {
				colorMap[colorDuo].matchups[oppColor].otpGames++;
				if (isWin) colorMap[colorDuo].matchups[oppColor].otpWins++;
			} else if (row['Turn Order'] === 'OTD') {
				colorMap[colorDuo].matchups[oppColor].otdGames++;
				if (isWin) colorMap[colorDuo].matchups[oppColor].otdWins++;
			}
		});

		const statsArray = Object.values(colorMap).sort((a, b) => b.games - a.games);
		statsArray.forEach(deck => {
			deck.sortedMatchups = Object.values(deck.matchups).sort((a, b) => b.games - a.games);
		});

		const mmrByDayArray = Object.values(dayMap).sort((a, b) => new Date(a.date) - new Date(b.date));

		setStats(statsArray);
		setGlobalStats(global);
		setMmrHistory(mmrData);
		setMmrHistoryByDay(mmrByDayArray);
	};

	const getColors = (colorString) => {
		// Si "Unknown" ou pas de slash, on renvoie une couleur neutre
		if (!colorString || !colorString.includes('/')) return { color1: '#4b5563', color2: '#4b5563' };
		const parts = colorString.split('/');
		const color1 = lorcanaColors[parts[0]] || '#4b5563';
		const color2 = lorcanaColors[parts[1]] || color1;
		return { color1, color2 };
	};

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="bg-gray-800 border border-gray-600 p-3 rounded-lg shadow-xl">
					<p className="font-bold text-white mb-1">
						{chartMode === 'game' ? `Match #${data.match}` : `End of day`}
					</p>
					<p className="text-blue-400 text-sm">MMR : <span className="font-bold">{data.mmr}</span></p>
					<p className="text-gray-500 text-xs mt-1">{data.date}</p>
					{chartMode === 'game' && <p className="text-gray-400 text-xs mt-1">{data.deck}</p>}
				</div>
			);
		}
		return null;
	};

	const currentChartData = chartMode === 'game' ? mmrHistory : mmrHistoryByDay;

	const renderTableCell = (wins, games) => {
		if (games === 0) return <span className="text-gray-600">-</span>;
		const wr = (wins / games) * 100;
		const colorClass = wr >= 50 ? 'text-green-400' : 'text-red-400';
		return (
			<div className="flex flex-col items-center">
				<span className={`font-bold ${colorClass}`}>{wr.toFixed(1)}%</span>
				<span className="text-xs text-gray-500">({wins}/{games})</span>
			</div>
		);
	};

	return (
		<main className="p-8 bg-gray-900 text-white min-h-screen font-sans relative">

			{selectedDeck && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
					<div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-7xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">

						{(() => {
							const { color1, color2 } = getColors(selectedDeck.colors);
							return <div className="h-3 w-full shrink-0" style={{ background: `linear-gradient(to right, ${color1}, ${color2})` }}></div>;
						})()}

						<div className="p-6 border-b border-gray-700 flex justify-between items-center shrink-0">
							<div>
								<h2 className="text-3xl font-extrabold text-white mb-1">{selectedDeck.colors} - Detailed Analysis</h2>
								<p className="text-gray-400 text-sm">{selectedDeck.games} total games played</p>
							</div>
							<button
								onClick={() => setSelectedDeck(null)}
								className="p-2 bg-gray-700 hover:bg-red-500 rounded-full transition-colors text-white"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div className="p-6 overflow-x-auto flex-grow">
							<table className="w-full text-sm text-left border-collapse min-w-[600px]">
								<thead>
								<tr>
									<th className="p-4 bg-gray-900 border border-gray-700 text-gray-400 font-semibold uppercase tracking-wider sticky left-0 z-10 w-40">
										Metrics
									</th>
									<th className="p-4 bg-gray-800 border border-gray-700 text-center font-bold text-white uppercase tracking-wider min-w-[100px]">
										Global
									</th>
									{/* Remplacement du texte "VS" par les pastilles de couleur */}
									{selectedDeck.sortedMatchups.map((matchup, i) => {
										const { color1, color2 } = getColors(matchup.opponent);
										return (
											<th
												key={i}
												className="p-4 bg-gray-800 border border-gray-700 text-center min-w-[80px]"
												title={`Vs ${matchup.opponent}`} // Affiche le nom au survol
											>
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
									<td className="p-4 bg-gray-900 border border-gray-700 font-bold text-gray-200 sticky left-0 z-10">
										Win Rate
									</td>
									<td className="p-4 border border-gray-700 bg-gray-800/50">
										{renderTableCell(selectedDeck.wins, selectedDeck.games)}
									</td>
									{selectedDeck.sortedMatchups.map((matchup, i) => (
										<td key={i} className="p-4 border border-gray-700 bg-gray-800/50">
											{renderTableCell(matchup.wins, matchup.games)}
										</td>
									))}
								</tr>

								<tr className="hover:bg-gray-750 transition-colors">
									<td className="p-4 bg-gray-900 border border-gray-700 font-semibold text-gray-300 sticky left-0 z-10">
										Going First (OTP)
									</td>
									<td className="p-4 border border-gray-700">
										{renderTableCell(selectedDeck.otpWins, selectedDeck.otpGames)}
									</td>
									{selectedDeck.sortedMatchups.map((matchup, i) => (
										<td key={i} className="p-4 border border-gray-700">
											{renderTableCell(matchup.otpWins, matchup.otpGames)}
										</td>
									))}
								</tr>

								<tr className="hover:bg-gray-750 transition-colors">
									<td className="p-4 bg-gray-900 border border-gray-700 font-semibold text-gray-300 sticky left-0 z-10">
										Going Second (OTD)
									</td>
									<td className="p-4 border border-gray-700">
										{renderTableCell(selectedDeck.otdWins, selectedDeck.otdGames)}
									</td>
									{selectedDeck.sortedMatchups.map((matchup, i) => (
										<td key={i} className="p-4 border border-gray-700">
											{renderTableCell(matchup.otdWins, matchup.otdGames)}
										</td>
									))}
								</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}

			<div className={`max-w-7xl mx-auto ${selectedDeck ? 'blur-sm pointer-events-none opacity-50' : ''} transition-all duration-300`}>

				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
					<h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
						Duels.ink Analyzer
					</h1>

					{stats && (
						<div className="flex items-center gap-3">
							<span className="text-gray-400 text-sm">{globalStats.games} games analyzed</span>
							<input type="file" onChange={handleFileUpload} accept=".csv" className="hidden" id="fileInputTop" />
							<label htmlFor="fileInputTop" className="cursor-pointer bg-gray-800 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-700 transition-colors inline-block text-sm shadow-sm border border-gray-700">
								New file
							</label>
						</div>
					)}
				</div>

				{!stats && (
					<div className="mt-20 p-12 border-2 border-dashed border-gray-700 rounded-2xl text-center bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 max-w-4xl mx-auto">
						<div className="mb-6 text-gray-400">
							<svg className="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							<h3 className="text-xl font-medium text-gray-200">Ready to analyze your games?</h3>
						</div>
						<input type="file" onChange={handleFileUpload} accept=".csv" className="hidden" id="fileInput" />
						<label htmlFor="fileInput" className="cursor-pointer bg-blue-600 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all inline-block">
							Import history .csv file
						</label>
						<p className="mt-4 text-gray-500 text-sm">Your data will be processed locally in your browser.</p>
					</div>
				)}

				{globalStats && (
					<div className="mb-10 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 flex flex-col lg:flex-row gap-8">

						<div className="w-full lg:w-1/3 flex flex-col justify-center">
							<h2 className="text-xl font-bold mb-6 text-gray-200">Global Overview</h2>
							<div className="grid grid-cols-2 gap-4">

								<div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700/50">
									<p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">Overall Win Rate</p>
									<p className={`text-2xl font-bold ${globalStats.wins / globalStats.games >= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
										{((globalStats.wins / globalStats.games) * 100).toFixed(1)}%
									</p>
									<p className="text-xs text-gray-500 mt-1">{globalStats.wins}W - {globalStats.games - globalStats.wins}L</p>
								</div>

								<div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700/50">
									<p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">Play Rate (OTP)</p>
									<p className="text-2xl font-bold text-blue-400">
										{((globalStats.otpGames / globalStats.games) * 100).toFixed(1)}%
									</p>
									<p className="text-xs text-gray-500 mt-1">Started {globalStats.otpGames} times</p>
								</div>

								<div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700/50">
									<p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">OTP Win Rate</p>
									<p className="text-2xl font-bold text-gray-200">
										{((globalStats.otpWins / globalStats.otpGames) * 100).toFixed(1)}%
									</p>
								</div>

								<div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700/50">
									<p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">OTD Win Rate</p>
									<p className="text-2xl font-bold text-gray-200">
										{((globalStats.otdWins / globalStats.otdGames) * 100).toFixed(1)}%
									</p>
								</div>

							</div>
						</div>

						<div className="w-full lg:w-2/3 h-72 bg-gray-900/40 rounded-xl border border-gray-700/50 p-4 flex flex-col">

							<div className="flex justify-between items-center mb-4">
								<h3 className="text-sm text-gray-400 font-medium uppercase tracking-wide">MMR Evolution</h3>
								{mmrHistory.length > 0 && (
									<div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
										<button
											onClick={() => setChartMode('game')}
											className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${chartMode === 'game' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
										>
											Per Game
										</button>
										<button
											onClick={() => setChartMode('day')}
											className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${chartMode === 'day' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
										>
											Per Day
										</button>
									</div>
								)}
							</div>

							{mmrHistory.length > 0 ? (
								<div className="flex-grow w-full">
									<ResponsiveContainer width="100%" height="100%">
										<LineChart data={currentChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
											<CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
											<XAxis dataKey={chartMode === 'game' ? 'match' : 'date'} stroke="#6b7280" tick={{fontSize: 12}} minTickGap={20} />
											<YAxis stroke="#6b7280" tick={{fontSize: 12}} domain={['dataMin - 10', 'dataMax + 10']} />
											<RechartsTooltip content={<CustomTooltip />} />
											<Line type="monotone" dataKey="mmr" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#c084fc', stroke: '#fff', strokeWidth: 2 }} />
										</LineChart>
									</ResponsiveContainer>
								</div>
							) : (
								<div className="flex-grow flex items-center justify-center text-gray-500">
									No MMR data available in this file.
								</div>
							)}
						</div>

					</div>
				)}

				{stats && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{stats.map((archetype, idx) => {
							const { color1, color2 } = getColors(archetype.colors);
							const winRate = ((archetype.wins / archetype.games) * 100).toFixed(1);
							const isPositive = winRate >= 50;

							return (
								<div
									key={idx}
									onClick={() => setSelectedDeck(archetype)}
									className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 border border-gray-700 cursor-pointer group"
								>

									<div className="h-3 w-full group-hover:h-4 transition-all duration-300" style={{ background: `linear-gradient(to right, ${color1}, ${color2})` }}></div>

									<div className="p-6 flex-grow flex flex-col justify-between relative">
										<div className="absolute top-4 right-4 text-gray-600 group-hover:text-blue-400 transition-colors">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
											</svg>
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
                                   <span className={`text-4xl font-extrabold tracking-tighter ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                     {winRate}%
                                   </span>
											<span className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Win Rate</span>
										</div>

										<div className="grid grid-cols-2 gap-3 mt-auto">
											<div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700/50">
												<p className="text-[11px] text-gray-400 mb-1 font-semibold uppercase">Going first</p>
												{archetype.otpGames > 0 ? (
													<p className="font-bold text-lg text-gray-200">
														{((archetype.otpWins / archetype.otpGames) * 100).toFixed(0)}%
														<span className="text-xs font-normal text-gray-500 ml-1">({archetype.otpGames})</span>
													</p>
												) : (
													<p className="text-gray-600 text-sm">-</p>
												)}
											</div>

											<div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700/50">
												<p className="text-[11px] text-gray-400 mb-1 font-semibold uppercase">Going second</p>
												{archetype.otdGames > 0 ? (
													<p className="font-bold text-lg text-gray-200">
														{((archetype.otdWins / archetype.otdGames) * 100).toFixed(0)}%
														<span className="text-xs font-normal text-gray-500 ml-1">({archetype.otdGames})</span>
													</p>
												) : (
													<p className="text-gray-600 text-sm">-</p>
												)}
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</main>
	);
}