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
	Flex,
} from '@chakra-ui/react';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	signupSchema,
	signinSchema,
	forgotPasswordSchema,
	otpSchema,
} from '../schema/formSchema';
import useAuthStore from '../store/store';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// TODO
//  refactor the state in showpassword
// refactor formstate

type FormValuesSignUp = z.infer<typeof signupSchema>;
type FormValuesSignIn = z.infer<typeof signinSchema>;
type FormValuesForgotPassword = z.infer<typeof forgotPasswordSchema>;
type FormValuesOTP = z.infer<typeof otpSchema>;

const SignUpForm = () => {
	const navigate = useNavigate();

	const {
		login,
		isLogin,
		setIsLogin,
		// isRegister,
		// setIsRegister,
		showPassword,
		showConfirmPassword,
		email,
		setEmail,
		password,
		setPassword,
		incorrectPassword,
		noUserEmail,
		togglePassword,
		togglePasswordConfirm,
		backendUrl,
		getUserData,
	} = useAuthStore();

	const [formState, setFormState] = useState('signin');

	// ZOD FORM HANDLER ERROR
	// const {
	// 	register,
	// 	handleSubmit,
	// 	formState: { errors },
	// } = useForm<FormValues>({
	// 	resolver: zodResolver(signupSchema),
	// 	defaultValues: {
	// 		name: '',
	// 		email: '',
	// 		password: '',
	// 		confirmPassword: '',
	// 	},
	// });

	const loginForm = async (e) => {
		e.preventDefault();

		//store the user data
		const { password, email } = e.target;
		const userEmail = email.value;
		const userPass = password.value;
		setEmail(userEmail);
		setPassword(userPass);

		try {
			await login();
		} catch (err) {
			console.log('error: ', err.message);
		} finally {
			email.value = '';
			password.value = '';
		}
	};

	// INPUT HANDLER
	const handleInputChange = (e) => setEmail(e.target.value);
	const handleInputPassword = (e) => setPassword(e.target.value);

	useEffect(() => {
		if (isLogin) {
			navigate('/');
		}
	}, [isLogin, navigate]);

	//Forms
	const SignUpForm = () => {
		//Zod Form Handler
		const {
			register,
			handleSubmit,
			formState: { errors },
		} = useForm<FormValuesSignUp>({
			resolver: zodResolver(signupSchema),
			defaultValues: {
				name: '',
				email: '',
				password: '',
				confirmPassword: '',
			},
		});

		const registerForm = async (userData: FormValuesSignUp) => {
			const { name, email, password } = userData;
			try {
				const { data } = await axios.post(backendUrl + '/api/auth/register', {
					email,
					name,
					password,
				});

				if (data.success) {
					setIsLogin(true);
					console.log(data.message);
					getUserData();
					navigate('/');
				} else {
					alert(data.message);
				}
			} catch (err) {
				console.error(err.message);
			}
		};

		return (
			<form onSubmit={handleSubmit(registerForm)}>
				<Container>
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
							<Input placeholder="Email" type="text" {...register('email')} />
							{errors.email && (
								<FormErrorMessage>{errors.email.message}</FormErrorMessage>
							)}
						</FormControl>

						<FormControl isInvalid={!!errors.password}>
							<InputGroup>
								<Input
									placeholder="Password"
									type={showPassword ? 'text' : 'password'}
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
										onClick={togglePassword}
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
									type={showConfirmPassword ? 'text' : 'password'}
									{...register('confirmPassword')}
								/>
								<InputRightElement>
									<IconButton
										aria-label={
											showConfirmPassword ? 'Hide password' : 'Show password'
										}
										icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
										variant="ghost"
										onClick={togglePasswordConfirm}
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
				</Container>
			</form>
		);
	};

	const SignInForm = () => {
		const {
			register,
			handleSubmit,
			formState: { errors },
		} = useForm({
			resolver: zodResolver(signinSchema),
		});

		const handleSignInForm = async (userData: FormValuesSignIn) => {
			const { email, password } = userData;

			setEmail(email);
			setPassword(password);

			try {
				await login();
			} catch (err) {
				console.log('error: ', err.message);
			} finally {
				email.value = '';
				password.value = '';
			}
		};

		return (
			<form onSubmit={handleSubmit(handleSignInForm)}>
				<VStack padding={3} spacing={3} align={'stretch'}>
					<Box fontSize={30}> SIGN IN</Box>

					{/* Email */}
					<FormControl isRequired isInvalid={!!noUserEmail}>
						<Input
							placeholder="Email"
							type="email"
							{...register('email')}
							color={'white'}
							p={2}
							// value={email}
							onChange={handleInputChange}
						/>

						{errors.email ? (
							<FormErrorMessage>{errors.email.message}</FormErrorMessage>
						) : (
							<FormErrorMessage>No user email</FormErrorMessage>
						)}
					</FormControl>

					{/* Password */}
					<FormControl isRequired isInvalid={!!incorrectPassword}>
						<InputGroup>
							<Input
								placeholder="Password"
								type={showPassword ? 'text' : 'password'}
								// name="password"
								// value={password}
								{...register('password')}
								onChange={handleInputPassword}
							/>

							<InputRightElement>
								<IconButton
									aria-label={showPassword ? 'Hide password' : 'Show password'}
									icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
									variant="ghost"
									onClick={togglePassword}
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
					<Box
						_hover={{
							textColor: 'orange',
						}}
						cursor={'pointer'}
						w={'full'}
						textAlign={'center'}
						onClick={() => console.log('click forgot password')}
					>
						{' '}
						Forgot Password
					</Box>
				</VStack>
			</form>
		);
	};

	const ForgotPasswordForm = () => {
		const {
			register,
			handleSubmit,
			formState: { errors },
		} = useForm({
			resolver: zodResolver(forgotPasswordSchema),
		});

		const handleForgotPassword = async (email) => {
			console.log(email);
		};

		return (
			<form onSubmit={handleSubmit(handleForgotPassword)}>
				<VStack padding={3} spacing={3} align={'stretch'}>
					<Box fontSize={30}> Forgot Password</Box>

					<FormControl isRequired isInvalid={!!noUserEmail}>
						<Input
							placeholder="Email"
							type="email"
							{...register('email')}
							color={'white'}
							p={2}
							onChange={handleInputChange}
						/>

						{errors.email ? (
							<FormErrorMessage>{errors.email.message}</FormErrorMessage>
						) : (
							<FormErrorMessage>Email does not exist</FormErrorMessage>
						)}
					</FormControl>
				</VStack>
			</form>
		);
	};

	const OTPForm = () => {
		const {
			register,
			handleSubmit,
			formState: { errors },
		} = useForm({
			resolver: zodResolver(otpSchema),
		});

		const handleOTP = async (otp) => {
			console.log(otp);
		};

		return (
			<form onSubmit={handleSubmit(handleOTP)}>
				<VStack padding={3} spacing={3} align={'stretch'}>
					<Box fontSize={30}> Forgot Password</Box>

					<FormControl isRequired isInvalid={!!noUserEmail}>
						<Input
							placeholder="Email"
							type="email"
							{...register('email')}
							color={'white'}
							p={2}
							onChange={handleInputChange}
						/>

						{errors.email ? (
							<FormErrorMessage>{errors.email.message}</FormErrorMessage>
						) : (
							<FormErrorMessage>Email does not exist</FormErrorMessage>
						)}
					</FormControl>
				</VStack>
			</form>
		);
	};

	//Form State Render
	const renderForm = () => {
		switch (formState) {
			case 'signup':
				return <SignUpForm />;
			case 'signin':
				return <SignInForm />;
			case 'forgot-password':
				<ForgotPasswordForm />;
		}
	};

	return (
		<div className=" h-svh flex flex-col justify-center items-center text-white">
			<div className=" z-20 px-3 py-4 rounded-3xl w-[90%] max-w-[25rem] sm:w-[25rem] lg:w-[30rem] 2xl:w-[50rem] bg-themeBlue-800">
				<div>
					<form onSubmit={isRegister ? handleSubmit(registerForm) : loginForm}>
						{/* {formState === 'signup' ? 
						//REGISTRATION FORM 
						(
							<Container>
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
											<FormErrorMessage>
												{errors.email.message}
											</FormErrorMessage>
										)}
									</FormControl>

									<FormControl isInvalid={!!errors.password}>
										<InputGroup>
											<Input
												placeholder="Password"
												type={showPassword ? 'text' : 'password'}
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
													onClick={togglePassword}
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
												type={showConfirmPassword ? 'text' : 'password'}
												{...register('confirmPassword')}
											/>
											<InputRightElement>
												<IconButton
													aria-label={
														showConfirmPassword
															? 'Hide password'
															: 'Show password'
													}
													icon={
														showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />
													}
													variant="ghost"
													onClick={togglePasswordConfirm}
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
							</Container>
						) : 
						// SIGN UP FORM
						(
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
											type={showPassword ? 'text' : 'password'}
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
												onClick={togglePassword}
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
								<Box
									_hover={{
										textColor: 'orange',
									}}
									cursor={'pointer'}
									w={'full'}
									textAlign={'center'}
									onClick={() =>}
								>
									{' '}
									Forgot Password
								</Box>
							</VStack>
						)} */}
						renderForm();
					</form>
					{/* {formState === 'signin' ? (
						<Flex ml={4} padding={3}>
							Already have an account?
							<Box
								_hover={{
									textColor: 'green',
								}}
								paddingLeft={1}
								onClick={() => setIsRegister(!isRegister)}
							>
								Sign In
							</Box>
						</Flex>
					) : (
						<Flex padding={3}>
							<span className="mr-1">Don't have an account?</span>
							<Box
								_hover={{
									textColor: 'green',
								}}
								onClick={() => setIsRegister(!isRegister)}
							>
								Sign Up
							</Box>
						</Flex>
					)} */}
				</div>
			</div>
		</div>
	);
};

export default SignUpForm;
