import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input,
	FormHelperText,
	Form,
	VStack,
	InputRightElement,
	IconButton,
	InputGroup,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '../schema/formSchema';

type FormValues = z.infer<typeof formSchema>;

const SignUpForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = (data: FormValues) => {
		console.log('Form submitted: ', data);
	};
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	return (
		<div className=" h-svh flex flex-col justify-center items-center">
			<div className="bg-green-300 p-2 rounded-3xl w-[25rem]">
				{/* <FormControl isInvalid={isError}>
					<FormLabel>Email</FormLabel>
					<Input type="email" value={input} onChange={handleInputChange} />
					{!isError ? (
						<FormHelperText>
							Enter the email you'd like to receive the newsletter on.
						</FormHelperText>
					) : (
						<FormErrorMessage>Email is required.</FormErrorMessage>
					)}
				</FormControl> */}

				<form onSubmit={handleSubmit(onSubmit)} className="text-center my-5">
					<h2>Register Account</h2>
					<VStack padding={3} spacing={3} align={'stretch'}>
						<FormControl isInvalid={!!errors.name}>
							<Input placeholder="Name" type="text" {...register('name')} />
							{errors.name && (
								<FormErrorMessage>{errors.name.message}</FormErrorMessage>
							)}
						</FormControl>

						<FormControl isInvalid={!!errors.email}>
							<Input placeholder="Email" type="text" {...register('email')} />
							{errors.email && (
								<FormErrorMessage>{errors.email.message}</FormErrorMessage>
							)}
						</FormControl>

						<FormControl isInvalid={!!errors.password}>
							<InputGroup>
								<Input
									placeholder="Password"
									type="text"
									{...register('password')}
								/>

								<InputRightElement>
									<IconButton
										aria-label={
											showPassword ? 'Hide password' : 'Show password'
										}
										icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
										variant="ghost"
										onClick={() => setShowPassword((prev) => !prev)}
										size="sm"
									/>
								</InputRightElement>
							</InputGroup>
							{errors.password && (
								<FormErrorMessage>{errors.password.message}</FormErrorMessage>
							)}
						</FormControl>

						<FormControl isInvalid={!!errors.confirmPassword}>
							<InputGroup>
								<Input
									placeholder="Confirm Password"
									type="text"
									{...register('confirmPassword')}
								/>
								<InputRightElement>
									<IconButton
										aria-label={
											showPasswordConfirm ? 'Hide password' : 'Show password'
										}
										icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
										variant="ghost"
										onClick={() => setShowPasswordConfirm((prev) => !prev)}
										size="sm"
									/>
								</InputRightElement>
							</InputGroup>
							{errors.confirmPassword && (
								<FormErrorMessage>
									{errors.confirmPassword.message}
								</FormErrorMessage>
							)}
						</FormControl>
					</VStack>
					<button type="submit">Register</button>
				</form>
			</div>
		</div>
	);
};

export default SignUpForm;
