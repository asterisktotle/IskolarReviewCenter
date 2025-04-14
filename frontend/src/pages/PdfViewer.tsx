import { Button, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import usePdfViewer from '../hooks/usePdfViewer.ts';
import { useParams } from 'react-router-dom';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString();

const ViewPdf = () => {
	const { pdfId } = useParams();

	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [disableNext, setDisableNext] = useState(false);
	const [disablePrevious, setDisablePrevious] = useState(false);

	const { setSelectedPdf, pdfUrl, errorMessage, loading } = usePdfViewer();

	useEffect(() => {
		if (!pdfId) {
			console.log('no pdf selected');
			return;
		}
		setSelectedPdf(pdfId);
	}, []);

	const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
		setNumPages(numPages);
	};

	useEffect(() => {
		setDisablePrevious(pageNumber === 1);
		setDisableNext(numPages !== null && pageNumber === numPages);
	}, [pageNumber, numPages]);

	const handleNextPage = () => {
		if (numPages && pageNumber < numPages) {
			setPageNumber((prev) => prev + 1);
		}
	};

	const handlePreviousPage = () => {
		if (pageNumber > 1) {
			setPageNumber((prev) => prev - 1);
		}
	};

	if (errorMessage) {
		<div className="flex flex-col items-center ">
			return <h1 className="text-white text-2xl font-bold ">{errorMessage}</h1>;
		</div>;
	}

	return (
		<div className="flex flex-col items-center gap-4 w-full">
			<h2 className="text-lg font-medium">Lecture 1</h2>

			{loading ? (
				<Spinner
					thickness="4px"
					speed="0.65s"
					emptyColor="gray.200"
					color="blue.500"
					size="xl"
				/>
			) : (
				<div className="w-full flex justify-center">
					<Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
						<Page
							pageNumber={pageNumber}
							renderAnnotationLayer={false}
							renderTextLayer={false}
							width={Math.min(window.innerWidth - 32, 800)}
							scale={1}
						/>
					</Document>
				</div>
			)}

			<div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2">
				<span className="text-sm">
					Page {pageNumber} of {numPages}
				</span>

				<div className="flex gap-2">
					<Button
						disabled={disablePrevious}
						onClick={handlePreviousPage}
						size="sm"
					>
						Previous
					</Button>
					<Button disabled={disableNext} onClick={handleNextPage} size="sm">
						Next
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ViewPdf;
