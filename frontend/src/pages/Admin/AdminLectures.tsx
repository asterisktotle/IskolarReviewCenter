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
	useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
const AdminLectures = () => {
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
		<>
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
		</>
	);
};

export default AdminLectures;
