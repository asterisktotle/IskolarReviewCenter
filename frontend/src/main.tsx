import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Custom theme to match the homepage design
const customTheme = extendTheme({
	config: {
		initialColorMode: 'dark',
		useSystemColorMode: false,
	},
	styles: {
		global: {
			body: {
				bg: 'transparent',
				color: 'white',
			},
		},
	},
	colors: {
		purple: {
			50: '#faf5ff',
			100: '#f3e8ff',
			200: '#e9d5ff',
			300: '#d8b4fe',
			400: '#c084fc',
			500: '#a855f7',
			600: '#9333ea',
			700: '#7c3aed',
			800: '#6b21a8',
			900: '#581c87',
		},
		slate: {
			50: '#f8fafc',
			100: '#f1f5f9',
			200: '#e2e8f0',
			300: '#cbd5e1',
			400: '#94a3b8',
			500: '#64748b',
			600: '#475569',
			700: '#334155',
			800: '#1e293b',
			900: '#0f172a',
		},
	},
	components: {
		// Override Chakra components to match theme
		Card: {
			baseStyle: {
				container: {
					bg: 'whiteAlpha.50',
					backdropFilter: 'blur(12px)',
					border: '1px solid',
					borderColor: 'whiteAlpha.200',
					boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
				},
			},
		},
		Table: {
			baseStyle: {
				table: {
					bg: 'whiteAlpha.50',
					backdropFilter: 'blur(12px)',
				},
				th: {
					color: 'whiteAlpha.900',
					borderColor: 'whiteAlpha.200',
				},
				td: {
					color: 'whiteAlpha.800',
					borderColor: 'whiteAlpha.100',
				},
			},
		},
		Button: {
			baseStyle: {
				fontWeight: 'semibold',
			},
			variants: {
				solid: {
					bg: 'purple.600',
					color: 'white',
					_hover: {
						bg: 'purple.700',
						transform: 'translateY(-2px)',
						boxShadow: '0 10px 20px rgba(168, 85, 247, 0.4)',
					},
					_active: {
						bg: 'purple.800',
					},
				},
			},
		},
	},
});

createRoot(document.getElementById('root')!).render(
	<ChakraProvider theme={customTheme}>
		<BrowserRouter>
			<div className="min-h-screen relative overflow-hidden">
				{/* Animated Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
					{/* Background Pattern */}
					<div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

					{/* Animated Gradient Orbs */}
					<div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
					<div className="absolute top-0 -right-4 w-72 h-72 bg-slate-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
					<div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
				</div>

				{/* Content Wrapper */}
				<div className="relative z-10 text-white">
					<App />
				</div>

				{/* Additional Styling for specific pages can be added here */}
				<style>{`
					/* Custom animations */
					@keyframes blob {
						0% {
							transform: translate(0px, 0px) scale(1);
						}
						33% {
							transform: translate(30px, -50px) scale(1.1);
						}
						66% {
							transform: translate(-20px, 20px) scale(0.9);
						}
						100% {
							transform: translate(0px, 0px) scale(1);
						}
					}

					.animate-blob {
						animation: blob 7s infinite;
					}

					.animation-delay-2000 {
						animation-delay: 2s;
					}

					.animation-delay-4000 {
						animation-delay: 4s;
					}

					/* Scrollbar styling */
					::-webkit-scrollbar {
						width: 8px;
					}

					::-webkit-scrollbar-track {
						background: rgba(15, 23, 42, 0.5);
					}

					::-webkit-scrollbar-thumb {
						background: rgba(168, 85, 247, 0.5);
						border-radius: 4px;
					}

					::-webkit-scrollbar-thumb:hover {
						background: rgba(168, 85, 247, 0.7);
					}

					/* Glass morphism utilities */
					.glass {
						background: rgba(255, 255, 255, 0.05);
						backdrop-filter: blur(12px);
						border: 1px solid rgba(255, 255, 255, 0.1);
					}

					/* Focus styles for accessibility */
					*:focus {
						outline: 2px solid rgba(168, 85, 247, 0.6);
						outline-offset: 2px;
					}
				`}</style>
			</div>
		</BrowserRouter>
	</ChakraProvider>
);
