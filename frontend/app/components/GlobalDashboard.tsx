import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Dashboard Global (Graphiques et stats globales)

export const GlobalDashboard = ({ globalStats, mmrHistory, mmrHistoryByDay, chartMode, setChartMode }) => {
	const currentChartData = chartMode === 'game' ? mmrHistory : mmrHistoryByDay;

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="bg-gray-800 border border-gray-600 p-3 rounded-lg shadow-xl">
					<p className="font-bold text-white mb-1">{chartMode === 'game' ? `Match #${data.match}` : `End of day`}</p>
					<p className="text-blue-400 text-sm">MMR : <span className="font-bold">{data.mmr}</span></p>
					<p className="text-gray-500 text-xs mt-1">{data.date}</p>
					{chartMode === 'game' && <p className="text-gray-400 text-xs mt-1">{data.deck}</p>}
				</div>
			);
		}
		return null;
	};

	return (
		<div className="mb-10 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 flex flex-col lg:flex-row gap-8 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
			<div className="w-full lg:w-1/3 flex flex-col justify-center">
				<h2 className="text-xl font-bold mb-6 text-gray-200">Global Overview</h2>
				<div className="grid grid-cols-2 gap-4">
					<div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700/50 hover:bg-gray-900 transition-colors">
						<p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">Overall Win Rate</p>
						<p className={`text-2xl font-bold ${globalStats.wins / globalStats.games >= 0.5 ? 'text-green-400' : 'text-red-400'}`}>
							{((globalStats.wins / globalStats.games) * 100).toFixed(1)}%
						</p>
						<p className="text-xs text-gray-500 mt-1">{globalStats.wins}W - {globalStats.games - globalStats.wins}L</p>
					</div>
					<div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700/50 hover:bg-gray-900 transition-colors">
						<p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">Play Rate (OTP)</p>
						<p className="text-2xl font-bold text-blue-400">{((globalStats.otpGames / globalStats.games) * 100).toFixed(1)}%</p>
						<p className="text-xs text-gray-500 mt-1">Started {globalStats.otpGames} times</p>
					</div>
					<div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700/50 hover:bg-gray-900 transition-colors">
						<p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">OTP Win Rate</p>
						<p className="text-2xl font-bold text-gray-200">{((globalStats.otpWins / globalStats.otpGames) * 100).toFixed(1)}%</p>
					</div>
					<div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700/50 hover:bg-gray-900 transition-colors">
						<p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">OTD Win Rate</p>
						<p className="text-2xl font-bold text-gray-200">{((globalStats.otdWins / globalStats.otdGames) * 100).toFixed(1)}%</p>
					</div>
				</div>
			</div>

			<div className="w-full lg:w-2/3 h-72 bg-gray-900/40 rounded-xl border border-gray-700/50 p-4 flex flex-col">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-sm text-gray-400 font-medium uppercase tracking-wide">MMR Evolution</h3>
					{mmrHistory.length > 0 && (
						<div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
							<button onClick={() => setChartMode('game')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${chartMode === 'game' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}>Per Game</button>
							<button onClick={() => setChartMode('day')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${chartMode === 'day' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}>Per Day</button>
						</div>
					)}
				</div>
				{mmrHistory.length > 0 ? (
					<div className="flex-grow w-full">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={currentChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
								<CartesianGrid key="grid" strokeDasharray="3 3" stroke="#374151" vertical={false} />
								<XAxis key="xaxis" dataKey={chartMode === 'game' ? 'match' : 'date'} stroke="#6b7280" tick={{ fontSize: 12 }} minTickGap={20} />
								<YAxis key="yaxis" stroke="#6b7280" tick={{ fontSize: 12 }} domain={['dataMin - 10', 'dataMax + 10']} />
								<RechartsTooltip key="tooltip" content={<CustomTooltip />} />
								<Line key="line1" type="monotone" dataKey="mmr" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#c084fc', stroke: '#fff', strokeWidth: 2 }} animationDuration={1500} />
							</LineChart>
						</ResponsiveContainer>
					</div>
				) : (
					<div className="flex-grow flex items-center justify-center text-gray-500">No MMR data available.</div>
				)}
			</div>
		</div>
	);
};