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
import AdminStore from '../../store/adminStore';
import ViewPdf from '../PdfViewer';
import { useNavigate } from 'react-router-dom';

const UploadPdf = () => {
	const toast = useToast();

	const {
		uploadPdfFile,
		setTitle,
		setCategory,
		setSubject,
		setFile,
		loading,
		title,
		subject,
		category,
		file,
	} = AdminStore();

	const handleSubmit = (e) => {
		e.preventDefault();

		toast.promise(uploadPdfFile(), {
			success: { title: 'File uploaded', description: 'Looks great!' },
			error: {
				title: 'File failed to upload',
				description: 'Something wrong',
			},
			loading: { title: 'File uploading', description: 'Please wait' },
		});
	};

	return (
		<Container
			flexDirection={'column'}
			mb={'5'}
			maxW={'full'}
			border={'1px'}
			p={5}
			borderColor={'gray.500'}
			borderRadius={'md'}
			bgColor={'whiteAlpha.50'}
		>
			<Text fontSize="lg" textAlign={'center'} fontWeight={'bold'}>
				UPLOAD NEW {category.toUpperCase()}
			</Text>
			<form onSubmit={handleSubmit}>
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
	const navigate = useNavigate();
	const [openUploadForm, setOpenUploadForm] = useState(false);
	const { getAllPdf, pdfList, messageError, loading } = AdminStore();

	useEffect(() => {
		getAllPdf();
	}, [loading]);

	const handleViewPdf = (pdfId) => {
		//insert dynamic url
		navigate(`/view-pdf/${pdfId}`);
	};

	return (
		<>
			{openUploadForm ? (
				<CloseButton onClick={() => setOpenUploadForm(!openUploadForm)} />
			) : (
				<Button
					w={'full'}
					mb={'5'}
					onClick={() => setOpenUploadForm(!openUploadForm)}
				>
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
						{pdfList &&
							pdfList.map((pdf) => (
								<Tr key={pdf.fileId}>
									<Td>{pdf.subject.toUpperCase()}</Td>
									<Td>{pdf.category.toUpperCase()}</Td>
									<Td>{pdf.title}</Td>
									<Td
										cursor={'pointer'}
										_hover={{ color: 'blue.500' }}
										onClick={() => handleViewPdf(pdf._id)}
									>
										View
									</Td>
								</Tr>
							))}
						{messageError && <p>{messageError}</p>}
					</Tbody>
				</Table>
			</TableContainer>
		</>
	);
};

export default AdminLectures;
