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
				<div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
					{/* Background Pattern */}
					<div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

					{/* Gradient Orbs */}
					<div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
					<div className="absolute top-0 -right-4 w-72 h-72 bg-slate-500 rounded-full mix-blend-multiply filter blur-xl opacity-20  "></div>
					<div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20  "></div>
				</div>

				{/* Content Wrapper */}
				<div className="relative z-10 text-white">
					<App />
				</div>

				{/* Additional Styling for specific pages can be added here */}
			</div>
		</BrowserRouter>
	</ChakraProvider>
);
