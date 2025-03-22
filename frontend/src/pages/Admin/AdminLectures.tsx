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
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
	const [files, setFiles] = useState([]);

	const getPdfId = async () => {
		try {
			const { data } = await axios.get(
				'http://localhost:3100/api/pdf/pdf-lectures'
			);
			const pdf = data.data;
			console.log(pdf);
			setFiles(pdf);
		} catch (err) {
			console.error('getPdf error: ', err);
		}
	};

	useEffect(() => {
		getPdfId();
	}, []);

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

			{/* <ViewPdf /> */}

			<TableContainer>
				<Table variant="simple">
					<Thead bgColor={'white'}>
						<Tr>
							<Th>Subject</Th>
							<Th>Category</Th>
							<Th>Title</Th>
							<Th>File</Th>
						</Tr>
					</Thead>
					<Tbody>
						{files &&
							files.map((pdf) => (
								<Tr key={pdf.fileId}>
									<Td>{pdf.subject.toUpperCase()}</Td>
									<Td>{pdf.category.toUpperCase()}</Td>
									<Td>{pdf.title}</Td>
									<Td>View</Td>
									{/* <ViewPdf id={pdf._id} /> */}
								</Tr>
							))}
					</Tbody>
				</Table>
			</TableContainer>
		</>
	);
};

export default AdminLectures;
