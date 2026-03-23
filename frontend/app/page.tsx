'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { LoadingModal } from "./components/LoadingModal";
import { DeckModal } from "./components/DeckModal";
import {GlobalDashboard} from "@/app/components/GlobalDashboard";
import {DeckCard} from "@/app/components/DeckCard";


export default function Home() {
	const [stats, setStats] = useState(null);
	const [globalStats, setGlobalStats] = useState(null);
	const [mmrHistory, setMmrHistory] = useState([]);
	const [mmrHistoryByDay, setMmrHistoryByDay] = useState([]);
	const [chartMode, setChartMode] = useState('game');
	const [selectedDeck, setSelectedDeck] = useState(null);

	// NOUVEAU : État pour gérer l'animation de chargement
	const [isProcessing, setIsProcessing] = useState(false);

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// On lance l'animation de chargement
		setIsProcessing(true);

		Papa.parse(file, {
			header: true,
			dynamicTyping: true,
			complete: (results) => {
				// On utilise un setTimeout pour s'assurer que l'utilisateur
				// voit la belle animation au moins 1 seconde
				setTimeout(() => {
					processData(results.data);
					setIsProcessing(false);
				}, 1200);
			},
		});
	};

	const processData = (data) => {
		// ... (La logique de parsing n'a pas changé)
		const colorMap = {};
		const global = { games: 0, wins: 0, otpGames: 0, otpWins: 0, otdGames: 0, otdWins: 0 };
		const mmrData = [];
		const dayMap = {};

		const validRows = data.filter(row => row['My Colors'] && row['Result']);
		const sortedData = validRows.sort((a, b) => new Date(a['Started At']) - new Date(b['Started At']));

		sortedData.forEach((row, index) => {
			const colorDuo = row['My Colors'];
			const isWin = row.Result === 'Win';

			global.games++;
			if (isWin) global.wins++;
			if (row['Turn Order'] === 'OTP') { global.otpGames++; if (isWin) global.otpWins++; }
			else if (row['Turn Order'] === 'OTD') { global.otdGames++; if (isWin) global.otdWins++; }

			if (row['MMR After']) {
				const gameDate = row['Started At'] ? row['Started At'].split(' ')[0] : '';
				const gameEntry = { match: index + 1, date: gameDate, mmr: row['MMR After'], deck: colorDuo };
				mmrData.push(gameEntry);
				if (gameDate) dayMap[gameDate] = gameEntry;
			}

			if (!colorMap[colorDuo]) {
				colorMap[colorDuo] = { colors: colorDuo, games: 0, wins: 0, otpWins: 0, otpGames: 0, otdWins: 0, otdGames: 0, matchups: {} };
			}

			colorMap[colorDuo].games++;
			if (isWin) colorMap[colorDuo].wins++;
			if (row['Turn Order'] === 'OTP') { colorMap[colorDuo].otpGames++; if (isWin) colorMap[colorDuo].otpWins++; }
			else if (row['Turn Order'] === 'OTD') { colorMap[colorDuo].otdGames++; if (isWin) colorMap[colorDuo].otdWins++; }

			const oppColor = row['Opponent Colors'] || 'Unknown';
			if (!colorMap[colorDuo].matchups[oppColor]) {
				colorMap[colorDuo].matchups[oppColor] = { opponent: oppColor, games: 0, wins: 0, otpGames: 0, otpWins: 0, otdGames: 0, otdWins: 0 };
			}

			colorMap[colorDuo].matchups[oppColor].games++;
			if (isWin) colorMap[colorDuo].matchups[oppColor].wins++;
			if (row['Turn Order'] === 'OTP') { colorMap[colorDuo].matchups[oppColor].otpGames++; if (isWin) colorMap[colorDuo].matchups[oppColor].otpWins++; }
			else if (row['Turn Order'] === 'OTD') { colorMap[colorDuo].matchups[oppColor].otdGames++; if (isWin) colorMap[colorDuo].matchups[oppColor].otdWins++; }
		});

		const statsArray = Object.values(colorMap).sort((a, b) => b.games - a.games);
		statsArray.forEach(deck => deck.sortedMatchups = Object.values(deck.matchups).sort((a, b) => b.games - a.games));
		const mmrByDayArray = Object.values(dayMap).sort((a, b) => new Date(a.date) - new Date(b.date));

		setStats(statsArray);
		setGlobalStats(global);
		setMmrHistory(mmrData);
		setMmrHistoryByDay(mmrByDayArray);
	};

	return (
		<main className="p-8 bg-gray-900 text-white min-h-screen font-sans relative overflow-x-hidden">

			{/* Définition des animations personnalisées CSS directement dans le JSX */}
			<style dangerouslySetInnerHTML={{__html: `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            
            .custom-scrollbar::-webkit-scrollbar { height: 8px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
          `}} />

			{/* Modale de chargement */}
			{isProcessing && <LoadingModal />}

			{/* Modale de détails du deck */}
			{selectedDeck && <DeckModal deck={selectedDeck} onClose={() => setSelectedDeck(null)} />}

			{/* Contenu principal (flouté si une modale est ouverte) */}
			<div className={`max-w-7xl mx-auto transition-all duration-500 ease-in-out ${(selectedDeck || isProcessing) ? 'blur-md opacity-40 scale-[0.98] pointer-events-none' : ''}`}>

				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
					<div className="flex items-center gap-3">
						{/* Icône de logo */}
						<svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
						<h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight">
							Duels.ink Analyzer
						</h1>
					</div>

					{stats && (
						<div className="flex items-center gap-3 animate-[fadeIn_1s_ease-out]">
							<span className="text-gray-400 text-sm font-medium bg-gray-800 px-3 py-1 rounded-full">{globalStats.games} games analyzed</span>
							<input type="file" onChange={handleFileUpload} accept=".csv" className="hidden" id="fileInputTop" />
							<label htmlFor="fileInputTop" className="cursor-pointer bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg font-bold transition-all inline-block text-sm shadow-lg shadow-blue-500/20 border border-blue-400/20">
								Import New File
							</label>
						</div>
					)}
				</div>

				{/* Placeholder d'import (si pas encore de données) */}
				{!stats && !isProcessing && (
					<div className="mt-20 p-12 border-2 border-dashed border-gray-700 rounded-3xl text-center bg-gray-800/40 hover:bg-gray-800/60 transition-all duration-500 max-w-3xl mx-auto animate-[scaleIn_0.5s_ease-out]">
						<div className="mb-6 text-gray-400">
							<div className="w-20 h-20 mx-auto mb-6 bg-gray-900 rounded-full flex items-center justify-center shadow-inner border border-gray-700">
								<svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-gray-200 mb-2">Ready to analyze your games?</h3>
							<p className="text-gray-500 max-w-md mx-auto">Upload your exported match history to get deep insights into your win rates and matchups.</p>
						</div>
						<input type="file" onChange={handleFileUpload} accept=".csv" className="hidden" id="fileInput" />
						<label htmlFor="fileInput" className="cursor-pointer bg-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 inline-block">
							Select .csv file
						</label>
					</div>
				)}

				{/* Affichage des composants de Dashboard et Cartes */}
				{stats && (
					<>
						<GlobalDashboard
							globalStats={globalStats}
							mmrHistory={mmrHistory}
							mmrHistoryByDay={mmrHistoryByDay}
							chartMode={chartMode}
							setChartMode={setChartMode}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{stats.map((archetype, idx) => (
								<DeckCard
									key={idx}
									archetype={archetype}
									index={idx}
									onClick={() => setSelectedDeck(archetype)}
								/>
							))}
						</div>
					</>
				)}
			</div>
		</main>
	);
}