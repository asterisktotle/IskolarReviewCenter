import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	FormHelperText,
} from '@chakra-ui/react';
import { useState } from 'react';

const Login = () => {
	const [input, setInput] = useState('');
	const handleInputChange = (e) => setInput(e.target.value);

	const isError = input === '';

	return (
		<div className="bg-blue-950 h-svh flex flex-col justify-center items-center">
			<div className="bg-green-300 p-2 rounded-3xl w-[25rem]">
				<FormControl isInvalid={isError}>
					<FormLabel>Email</FormLabel>
					<Input type="email" value={input} onChange={handleInputChange} />
					{!isError ? (
						<FormHelperText>
							Enter the email you'd like to receive the newsletter on.
						</FormHelperText>
					) : (
						<FormErrorMessage>Email is required.</FormErrorMessage>
					)}
				</FormControl>
			</div>
		</div>
	);
};

export default Login;
