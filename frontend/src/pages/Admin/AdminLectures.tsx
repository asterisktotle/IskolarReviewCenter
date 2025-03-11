import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
const AdminLectures = () => {
	const [title, setTitle] = useState('');
	const [file, setFile] = useState('');
	const [allImage, setAllImage] = useState(null);
	const [pdfFile, setPdfFile] = useState(null);

	const submitPDF = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('title', title);
		formData.append('file', file);
		console.log(title, file);
		const result = await axios.post(
			'http://localhost:3100/api/pdf/pdf-lectures',
			formData,
			{
				headers: { 'Content-Type': 'multipart/form-data' },
			}
		);
		console.log(result);
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

				<FormControl isRequired>
					<FormLabel>Enter the title</FormLabel>
					<Input
						type="text"
						placeholder="Title"
						required
						onChange={(e) => setTitle(e.target.value)}
					/>
				</FormControl>

				<br />

				<FormControl isRequired>
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
				<Button type="submit">Submit</Button>
			</form>
		</>
	);
};

export default AdminLectures;
