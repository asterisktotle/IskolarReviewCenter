// Custom theme to match the homepage design

import { extendTheme } from "@chakra-ui/react";


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

export default customTheme;