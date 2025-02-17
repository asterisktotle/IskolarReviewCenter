import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

createRoot(document.getElementById('root')!).render(
	<ChakraProvider>
		<BrowserRouter>
			<div className="bg-blue-900 h-svh">
				<App />
			</div>
		</BrowserRouter>
	</ChakraProvider>
);
