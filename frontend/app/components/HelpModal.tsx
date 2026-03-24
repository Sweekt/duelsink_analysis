import React from 'react';

export const HelpModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            {/* Conteneur principal de la modale */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-2xl flex flex-col shadow-2xl relative overflow-hidden animate-[scaleIn_0.2s_ease-out_forwards]">

                {/* Header */}
                <div className="p-6 border-b border-gray-700 flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="text-2xl font-extrabold text-white mb-1">How to get your CSV file?</h2>
                        <p className="text-gray-400 text-sm">Follow these simple steps to export your match history.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-700 hover:bg-red-500 rounded-full transition-colors text-white shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenu */}
                <div className="p-6">
                    <ol className="list-decimal list-inside space-y-3 text-gray-300 mb-6 font-medium">
                        <li>Go to your <a href="https://duels.ink/account" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-400 hover:text-blue-300 underline transition-colors">Duels.ink account settings</a></li>
                        <li>Look for the <span className="text-white font-bold bg-gray-700 px-2 py-1 rounded">Export</span> button in the game history section.</li>
                        <li>Click it to download your history, then upload that file here!</li>
                    </ol>

                    {/* L'image du tutoriel (Réduite et centrée) */}
                    <div className="flex justify-center mb-2">
                        <div className="w-full max-w-md rounded-xl overflow-hidden border-2 border-gray-600 shadow-lg relative">
                            <img
                                src="/export-tutorial.png"
                                alt="Screenshot of the export button"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer de la modale avec bouton OK */}
                <div className="p-6 border-t border-gray-700 bg-gray-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Got it!
                    </button>
                </div>

            </div>
        </div>
    );
};