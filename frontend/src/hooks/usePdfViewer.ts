import { useCallback, useEffect, useState } from 'react';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const usePdfViewer = () => {
	const [selectedPdf, setSelectedPdf] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');
	const [pdfUrl, setPdfUrl] = useState(null);
	const [loading, setLoading] = useState(false);

	const fetchPdf = useCallback(async () => {
		if (!selectedPdf) {
			setErrorMessage('No PDF Selected');
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(
				`${BACKEND_URL}/api/pdf/pdf-lectures/${selectedPdf}`
			);

			if (!response.ok) {
				setErrorMessage(`Fetching data error: ${response.statusText}`);
				return;
			}

			const blob = await response.blob();
			const pdfPath = window.URL.createObjectURL(blob);
			setPdfUrl(pdfPath);
			setErrorMessage('');
		} catch (error) {
			setErrorMessage(error.message);
			setPdfUrl(null);
			console.log('usePdfViewer error', error);
		} finally {
			setLoading(false);
		}
	}, [selectedPdf]);

	useEffect(() => {
		if (selectedPdf) {
			fetchPdf();
		}

		return () => {
			if (pdfUrl) {
				window.URL.revokeObjectURL(pdfUrl);
			}
		};
	}, [selectedPdf, fetchPdf]);

	return { setSelectedPdf, pdfUrl, errorMessage, loading };
};

export default usePdfViewer;
