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
	// const [loading, setLoading] = useState(false);
	const [view, setView] = useState(false);
	const [isPreloaded, setIsPreloaded] = useState(false);

	const [numPages, setNumPages] = useState();
	const [pageNumber, setPageNumber] = useState(1);
	const [disableNext, setDisableNext] = useState(false);
	const [disablePrevious, setDisablePrevious] = useState(false);

	const { setSelectedPdf, pdfUrl, errorMessage, loading } = usePdfViewer();

	// useEffect(() => {
	// 	setSelectedPdf('67d5781610fabc74ce1c64af');
	// }, []);

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

	// Optional: Add preload functionality for hover
	const handleButtonMouseEnter = () => {
		if (!isPreloaded) {
			setSelectedPdf(pdfId);
		}
	};

	// if (!view) {
	// 	return (
	// 		<>
	// 			<Button
	// 				backgroundColor={loading ? 'whiteAlpha.800' : 'white'}
	// 				onClick={() => setView(!view)}
	// 				onMouseEnter={handleButtonMouseEnter}
	// 				isLoading={loading && !!isPreloaded}
	// 			>
	// 				View Pdf
	// 			</Button>
	// 		</>
	// 	);
	// }
	return (
		<div className="flex flex-col items-center gap-2 p-4 w-full mx-auto">
			<p>Lecture 1</p>
			{/* <Button onClick={() => setView(!view)}>Close Pdf</Button> */}
			{loading ? (
				<Spinner
					thickness="4px"
					speed="0.65s"
					emptyColor="gray.200"
					color="blue.500"
					size="xl"
				/>
			) : (
				<div className="w-full overflow-auto">
					<Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
						{/* <div className="w-fit"> */}
						<Page
							pageNumber={pageNumber}
							renderAnnotationLayer={false}
							renderTextLayer={false}
						/>
						{/* </div> */}
					</Document>
				</div>
			)}
			<p>
				Page {pageNumber} of {numPages}
			</p>

			<div className=" flex gap-2">
				<Button disabled={disablePrevious} onClick={handlePreviousPage}>
					Previous
				</Button>
				<Button disabled={disableNext} onClick={handleNextPage}>
					Next
				</Button>
			</div>
		</div>
	);
};

export default ViewPdf;
