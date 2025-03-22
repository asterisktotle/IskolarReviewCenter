import { useCallback, useEffect, useState } from 'react';

const usePdfViewer = () => {
	const [selectedPdf, setSelectedPdf] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');
	const [pdfUrl, setPdfUrl] = useState(null);
	const [loading, setLoading] = useState(false);

	const fetchPdf = useCallback(async () => {
		if (!selectedPdf) {
			console.log('selected pdf error: ', selectedPdf);
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(
				`http://localhost:3100/api/pdf/pdf-lectures/${selectedPdf}`
			);

			if (!response.ok) {
				setErrorMessage('fetching pdf error');
				return;
			}

			const blob = await response.blob();
			const pdfPath = window.URL.createObjectURL(blob);
			setPdfUrl(pdfPath);
			setErrorMessage('');
		} catch (error) {
			setErrorMessage('usePdfViewer error: ', error.message);
			setPdfUrl(null);
			console.log('usePdfViewer error', error);
		} finally {
			setLoading(false);
		}
	}, [selectedPdf]);

	useEffect(() => {
		let isMounted = true;
		if (selectedPdf) {
			fetchPdf();
		}

		return () => {
			isMounted = false;
			// Revoke object URL to prevent memory leaks
			if (pdfUrl) {
				window.URL.revokeObjectURL(pdfUrl);
			}
		};
	}, [selectedPdf, fetchPdf]);

	return { setSelectedPdf, pdfUrl, errorMessage, loading };
};

export default usePdfViewer;
