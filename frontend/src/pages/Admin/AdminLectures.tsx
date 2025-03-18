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
	Container,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.mjs',
	import.meta.url
).toString();

import { Document, Page } from 'react-pdf';

const ViewPdf = () => {
	const [loading, setLoading] = useState(false);
	const [pdfUrl, setPdfUrl] = useState('');
	const [error, setError] = useState('');

	const [numPages, setNumPages] = useState();
	const [pageNumber, setPageNumber] = useState(1);
	const [disableNext, setDisableNext] = useState(false);
	const [disablePrevious, setDisablePrevious] = useState(false);

	const fetchPdf = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				'http://localhost:3100/api/pdf/pdf-lectures/67d5781610fabc74ce1c64af',
				{ responseType: 'blob' } // IMPORTANT WHEN GETTING A PDF, PDF IS BINARY BASED, NOT JSON TEXT
			);

			const pdfPath = window.URL.createObjectURL(new Blob([response.data]));
			setPdfUrl(pdfPath);
			setError(null);
		} catch (err) {
			console.error('view pdf error: ', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPdf();
	}, []);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
		setNumPages(numPages);
	}

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

	return (
		<div className="flex flex-col gap-2 ">
			<p>Lecture 1</p>
			<Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
				<div className="w-fit">
					<Page
						pageNumber={pageNumber}
						renderAnnotationLayer={false}
						renderTextLayer={false}
					/>
				</div>
			</Document>
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
		<div className="flex flex-col ">
			<div>Admin Lectures</div>
			<form
				className="flex justify-center items-center flex-col gap-2 border-2 border-white "
				onSubmit={submitPDF}
			>
				<h4>Upload Lecture</h4>

				<br />
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
					<FormLabel>Enter the title</FormLabel>
					<Input
						type="text"
						placeholder="Title"
						required
						onChange={(e) => setTitle(e.target.value)}
					/>
					<FormErrorMessage>Please enter a title</FormErrorMessage>
				</FormControl>

				<br />

				<FormControl isRequired isInvalid={!file}>
					<FormLabel>Upload file</FormLabel>
					<Input
						type="file"
						accept="application/pdf"
						placeholder="Upload pdf"
						required
						onChange={(e) => setFile(e.target.files[0])}
					/>
				</FormControl>
				<br />

				<Button disabled={loading} type="submit">
					Submit
				</Button>
			</form>
		</div>
	);
};

const AdminLectures = () => {
	return (
		<>
			{/* <UploadPdf /> */}
			<ViewPdf />
		</>
	);
};

export default AdminLectures;
