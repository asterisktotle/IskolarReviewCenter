import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

createRoot(document.getElementById('root')!).render(
	<ChakraProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ChakraProvider>
);
