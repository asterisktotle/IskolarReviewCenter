import { useCallback, useEffect, useState } from 'react';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const usePdfViewer = () => {
	const [selectedPdf, setSelectedPdf] = useState <null | string> (null);
	const [errorMessage, setErrorMessage] = useState('');
	const [pdfUrl, setPdfUrl] = useState<null | string>(null);
	const [loading, setLoading] = useState(false);

	const fetchPdf = useCallback(async () => {
		if (!selectedPdf) {
			setErrorMessage('No PDF Selected');
			console.error('No pdf selected to fetch') //remove this 
			return;
		}

		setLoading(true);
		try {
			const response = await fetch(
				`${BACKEND_URL}/api/pdf/pdf-lectures/${selectedPdf}`
			);

			if (!response.ok) {
				setErrorMessage(`Fetching data error: ${response.statusText}`);
				console.log('response is not ok') //remove this 
				return;
			}

			const data = await response.json();

			if(data.success && data.data && data.data.s3Url){
				setPdfUrl(data.data.s3Url)
				setErrorMessage('')
			}else {
				setErrorMessage('Invalid fetched')
			}

			
			console.log('response: ', data.data.s3Url)
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
		} else {
			setPdfUrl(null)
		}

	}, [selectedPdf, fetchPdf]);

	return { setSelectedPdf, pdfUrl, errorMessage, loading };
};

export default usePdfViewer;
