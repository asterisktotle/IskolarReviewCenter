import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider} from '@chakra-ui/react';
import customTheme from './utils/customTheme.ts';
// Supports weights 100-900




createRoot(document.getElementById('root')!).render(
	<ChakraProvider theme={customTheme}>
		<BrowserRouter>
					<App />
		</BrowserRouter>
	</ChakraProvider>
);
