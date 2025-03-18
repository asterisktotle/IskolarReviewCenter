import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Radio,
	HStack,
	RadioGroup,
	FormErrorMessage,
	useToast,
	Spinner,
	CloseButton,
	Text,
	Container,
	VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { pdfjs, Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString();

const ViewPdf = () => {
	const [loading, setLoading] = useState(false);
	const [pdfUrl, setPdfUrl] = useState('');
	const [error, setError] = useState('');
	const [view, setView] = useState(false);
	const [isPreloaded, setIsPreloaded] = useState(false);

	const [numPages, setNumPages] = useState();
	const [pageNumber, setPageNumber] = useState(1);
	const [disableNext, setDisableNext] = useState(false);
	const [disablePrevious, setDisablePrevious] = useState(false);

	// Preload the PDF on component mount
	useEffect(() => {
		fetchPdf();
	}, []);

	const fetchPdf = async () => {
		if (!isPreloaded) {
			setLoading(true);
		}
		try {
			const response = await fetch(
				'http://localhost:3100/api/pdf/pdf-lectures/67d5781610fabc74ce1c64af'
			);
			const blob = await response.blob();
			const pdfPath = window.URL.createObjectURL(blob);
			setPdfUrl(pdfPath);
			setError('');
			setIsPreloaded(true);
		} catch (err) {
			console.error('view pdf error: ', err);
			setError('Failed to load PDF');
		} finally {
			setLoading(false);
		}
	};

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
			fetchPdf();
		}
	};

	if (!view) {
		return (
			<>
				<Button
					backgroundColor={loading ? 'whiteAlpha.800' : 'white'}
					onClick={() => setView(!view)}
					onMouseEnter={handleButtonMouseEnter}
					isLoading={loading && !!isPreloaded}
				>
					View Pdf
				</Button>
			</>
		);
	}
	return (
		<div className="flex flex-col items-center gap-2 p-4 w-full max-w-md mx-auto">
			<p>Lecture 1</p>
			<Button onClick={() => setView(!view)}>Close Pdf</Button>
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

const UploadPdf = () => {
	const [title, setTitle] = useState('');
	const [file, setFile] = useState('');
	const [category, setCategory] = useState('lecture');
	const [subject, setSubject] = useState('mesl');
	const [loading, setLoading] = useState(false);

	const toast = useToast();

	const submitPDF = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('title', title);
		formData.append('file', file);
		formData.append('subject', subject);
		formData.append('category', category);

		setLoading(true);

		toast.promise(
			axios.post('http://localhost:3100/api/pdf/pdf-lectures', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			}),
			{
				success: { title: 'File uploaded', description: 'Looks great!' },
				error: {
					title: 'File failed to upload',
					description: 'Something wrong',
				},
				loading: { title: 'File uploading', description: 'Please wait' },
			}
		);

		setLoading(false);
		setTitle('');
		setFile('');
	};

	return (
		<Container flexDirection={'column'}>
			<Text fontSize="lg" textAlign={'center'} fontWeight={'bold'}>
				UPLOAD NEW {category.toUpperCase()}
			</Text>
			<form onSubmit={submitPDF}>
				<VStack spacing={2}>
					<FormControl as="fieldset">
						<FormLabel as="legend">Subject</FormLabel>
						<RadioGroup value={subject} onChange={setSubject}>
							<HStack spacing="24px">
								<Radio value="mesl">MESL</Radio>
								<Radio value="mdsp">MDSP</Radio>
								<Radio value="pipe">PIPE</Radio>
							</HStack>
						</RadioGroup>
					</FormControl>
					<FormControl as="fieldset">
						<FormLabel as="legend">Category</FormLabel>
						<RadioGroup value={category} onChange={setCategory}>
							<HStack spacing="24px">
								<Radio value="lecture">Lecture</Radio>
								<Radio value="terms">Terms</Radio>
								<Radio value="quiz">Quiz</Radio>
								<Radio value="solution">Solution</Radio>
							</HStack>
						</RadioGroup>
					</FormControl>

					<br />
					<FormControl isRequired isInvalid={!title}>
						{/* <FormLabel>Enter the File Name</FormLabel> */}
						<Input
							type="text"
							placeholder="Enter File Name"
							required
							onChange={(e) => setTitle(e.target.value)}
						/>
						<FormErrorMessage>Please enter a title</FormErrorMessage>
					</FormControl>

					<br />

					<FormControl isRequired isInvalid={!file}>
						<FormLabel>Upload file</FormLabel>
						<HStack spacing={2}>
							<Input
								type="file"
								accept="application/pdf"
								placeholder="Upload pdf"
								hidden
								id="file-upload"
								onChange={(e) => setFile(e.target.files[0])}
							/>
							<Button
								as="label"
								htmlFor="file-upload"
								colorScheme="blue"
								cursor="pointer"
							>
								Choose File
							</Button>
							{file && <Text fontSize="sm">{file.name}</Text>}
						</HStack>
					</FormControl>
					<br />
				</VStack>

				<Button w={'full'} disabled={loading} type="submit">
					Submit
				</Button>
			</form>
		</Container>
	);
};

const AdminLectures = () => {
	const [openUploadForm, setOpenUploadForm] = useState(false);
	return (
		<>
			{openUploadForm ? (
				<CloseButton onClick={() => setOpenUploadForm(!openUploadForm)} />
			) : (
				<Button onClick={() => setOpenUploadForm(!openUploadForm)}>
					Upload PDF
				</Button>
			)}

			{openUploadForm && <UploadPdf />}
			<ViewPdf />
		</>
	);
};

export default AdminLectures;
