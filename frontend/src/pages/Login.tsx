import {
	FormControl,
	Box,
	FormErrorMessage,
	Input,
	VStack,
	InputRightElement,
	IconButton,
	InputGroup,
	Button,
	Container,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import astronaut from '../../public/welcome-astronaut.png';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '../schema/formSchema';

type FormValues = z.infer<typeof formSchema>;

const SignUpForm = () => {
	const [isRegister, setIsRegister] = useState(true);
	const [showPassword, setShowPassword] = useState(true);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(true);
	const [incorrectPassword, setIncorrectPassword] = useState(false);
	const [noUserEmail, setNoUserEmail] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

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
	const onLogin = (e) => {
		e.preventDefault();
		console.log('Login: ', e.target.password.value);
	};

	const handleInputChange = (e) => setEmail(e.target.value);

	const handleInputPassword = (e) => setPassword(e.target.value);

	return (
		<div className=" h-svh flex flex-col justify-center items-center text-white">
			<div className=" z-20 px-3 py-4 rounded-3xl w-[90%] max-w-[25rem] sm:w-[25rem] lg:w-[30rem] 2xl:w-[50rem] bg-themeBlue-800  ">
				{isRegister ? (
					<div>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Container backdropBlur={'3xl'} blur={'3xl'}>
								<Box fontSize={30}> WELCOME</Box>
								<Box fontSize={15}>Create an account and join us!</Box>
							</Container>
							<VStack padding={3} spacing={3} align={'stretch'}>
								<FormControl isInvalid={!!errors.name}>
									<Input
										placeholder="Name"
										type="text"
										{...register('name')}
										color={'white'}
										p={2}
									/>
									{errors.name && (
										<FormErrorMessage>{errors.name.message}</FormErrorMessage>
									)}
								</FormControl>

								<FormControl isInvalid={!!errors.email}>
									<Input
										placeholder="Email"
										type="text"
										{...register('email')}
									/>
									{errors.email && (
										<FormErrorMessage>{errors.email.message}</FormErrorMessage>
									)}
								</FormControl>

								<FormControl isInvalid={!!errors.password}>
									<InputGroup>
										<Input
											placeholder="Password"
											type={showPassword ? 'password' : 'text'}
											{...register('password', {
												setValueAs: (value: string) => value.trim(),
											})}
										/>

										<InputRightElement>
											<IconButton
												aria-label={
													showPassword ? 'Hide password' : 'Show password'
												}
												icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
												variant="ghost"
												onClick={() => setShowPassword(!showPassword)}
												size="sm"
											/>
										</InputRightElement>
									</InputGroup>
									{errors.password && (
										<FormErrorMessage>
											{errors.password.message}
										</FormErrorMessage>
									)}
								</FormControl>

								<FormControl isInvalid={!!errors.confirmPassword}>
									<InputGroup>
										<Input
											placeholder="Confirm Password"
											type={showPasswordConfirm ? 'password' : 'text'}
											{...register('confirmPassword', {
												setValueAs: (value: string) => value.trim(),
											})}
										/>
										<InputRightElement>
											<IconButton
												aria-label={
													showPasswordConfirm
														? 'Hide password'
														: 'Show password'
												}
												icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
												variant="ghost"
												onClick={() =>
													setShowPasswordConfirm(!showPasswordConfirm)
												}
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
								<Button
									_hover={{
										background: '#006da5',
									}}
									bg={'#0c638d'}
									textColor={'white'}
									type="submit"
								>
									Register
								</Button>
							</VStack>
						</form>
						<Box padding={3}>
							Already have an account?{' '}
							<button onClick={() => setIsRegister(!isRegister)}>
								SIGN IN
							</button>
						</Box>
					</div>
				) : (
					<div>
						<form onSubmit={onLogin}>
							<VStack padding={3} spacing={3} align={'stretch'}>
								<Box fontSize={30}> SIGN IN</Box>

								<FormControl isRequired isInvalid={noUserEmail}>
									<Input
										placeholder="Email"
										type="email"
										name="email"
										color={'white'}
										p={2}
										value={email}
										onChange={handleInputChange}
									/>

									<FormErrorMessage>Email does not exist</FormErrorMessage>
								</FormControl>
								<FormControl isRequired isInvalid={incorrectPassword}>
									<InputGroup>
										<Input
											placeholder="Password"
											type={showPassword ? 'password' : 'text'}
											name="password"
											value={password}
											onChange={handleInputPassword}
										/>

										<InputRightElement>
											<IconButton
												aria-label={
													showPassword ? 'Hide password' : 'Show password'
												}
												icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
												variant="ghost"
												onClick={() => setShowPassword(!showPassword)}
												size="sm"
											/>
										</InputRightElement>
									</InputGroup>
									<FormErrorMessage>Incorrect password.</FormErrorMessage>
								</FormControl>
								<Button
									_hover={{
										background: '#006da5',
									}}
									bg={'#0c638d'}
									textColor={'white'}
									type="submit"
								>
									Sign In
								</Button>
							</VStack>
						</form>
						<Box
							_hover={{
								textColor: 'orange',
							}}
							paddingX={3}
						>
							Forgot password
						</Box>
						<Box padding={3}>
							No account?{' '}
							<button onClick={() => setIsRegister(!isRegister)}>
								<p className="hover:text-orange-300"> SIGN UP</p>
							</button>
						</Box>
					</div>
				)}
			</div>
			<img src={astronaut} className="absolute right-25 t z--20 size-50" />
		</div>
	);
};

export default SignUpForm;
