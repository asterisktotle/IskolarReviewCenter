import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider} from '@chakra-ui/react';
import customTheme from './utils/customTheme.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false, // Don't refetch when window gains focus
			retry: 2, // Retry failed requests 2 times
			staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
			gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
		},
		mutations: {
			retry: 1,
		}
	}
})


createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<ChakraProvider theme={customTheme}>
			<BrowserRouter>
						<App />
			</BrowserRouter>
		</ChakraProvider>
	</QueryClientProvider>
		
);
