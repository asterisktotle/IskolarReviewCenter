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
	HStack,
	PinInputField,
	PinInput,
	Flex,
} from '@chakra-ui/react';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';

import { Controller, useForm } from 'react-hook-form';
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
		// showPassword,
		// showConfirmPassword,
		email,
		setEmail,
		password,
		setPassword,
		incorrectPassword,
		noUserEmail,
		// togglePassword,
		// togglePasswordConfirm,
		backendUrl,
		getUserData,
	} = useAuthStore();

	const [formState, setFormState] = useState('signin');

	// const loginForm = async (e) => {
	// 	e.preventDefault();

	// 	//store the user data
	// 	const { password, email } = e.target;
	// 	const userEmail = email.value;
	// 	const userPass = password.value;
	// 	setEmail(userEmail);
	// 	setPassword(userPass);

	// 	try {
	// 		await login();
	// 	} catch (err) {
	// 		console.log('error: ', err.message);
	// 	} finally {
	// 		email.value = '';
	// 		password.value = '';
	// 	}
	// };

	// INPUT HANDLER
	// const handleInputChange = (e) => setEmail(e.target.value);
	// const handleInputPassword = (e) => setPassword(e.target.value);

	useEffect(() => {
		if (isLogin) {
			navigate('/');
		}
	}, [isLogin, navigate]);

	//Forms
	const SignUpForm = () => {
		const [togglePassword, setTogglePassword] = useState(false);
		const [toggleConfirmPass, setToggleConfirmPass] = useState(false);
		const [emailAlreadyUsed, setEmailAlreadyUsed] = useState(false);

		const registerForm = async (userData: FormValuesSignUp) => {
			const { name, email, password } = userData;
			try {
				setEmailAlreadyUsed(false);
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
					setEmailAlreadyUsed(true);
				}
			} catch (err) {
				console.error(err.message);
			}
		};

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

						<FormControl isInvalid={!!errors.email || emailAlreadyUsed}>
							<Input placeholder="Email" type="text" {...register('email')} />
							{errors.email ? (
								<FormErrorMessage>{errors.email.message}</FormErrorMessage>
							) : (
								emailAlreadyUsed && (
									<FormErrorMessage>Email is already used</FormErrorMessage>
								)
							)}
						</FormControl>

						<FormControl isInvalid={!!errors.password}>
							<InputGroup>
								<Input
									placeholder="Password"
									type={togglePassword ? 'text' : 'password'}
									{...register('password', {
										setValueAs: (value: string) => value.trim(),
									})}
								/>

								<InputRightElement>
									<IconButton
										aria-label={
											togglePassword ? 'Hide password' : 'Show password'
										}
										icon={togglePassword ? <ViewOffIcon /> : <ViewIcon />}
										variant="ghost"
										onClick={() => setTogglePassword(!togglePassword)}
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
									type={toggleConfirmPass ? 'text' : 'password'}
									{...register('confirmPassword')}
								/>
								<InputRightElement>
									<IconButton
										aria-label={
											toggleConfirmPass ? 'Hide password' : 'Show password'
										}
										icon={toggleConfirmPass ? <ViewOffIcon /> : <ViewIcon />}
										variant="ghost"
										onClick={() => setToggleConfirmPass(!toggleConfirmPass)}
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
				<Flex gap={1}>
					Already have an account?
					<Box
						_hover={{
							textColor: 'yellow',
						}}
						cursor={'pointer'}
						onClick={() => setFormState('signin')}
					>
						Sign in
					</Box>
				</Flex>
			</form>
		);
	};

	const SignInForm = () => {
		const [togglePassword, setTogglePassword] = useState(false);
		const [userEmail, setUserEmail] = useState(email);
		const [userPass, setUserPass] = useState('');

		const handleSignInForm = async (e) => {
			e.preventDefault();
			setEmail(userEmail);
			setPassword(userPass);
			console.log('user info submitted: ', userEmail, userPass);

			try {
				await login();
			} catch (err) {
				console.log('error: ', err.message);
			}
		};

		return (
			<form onSubmit={handleSignInForm}>
				<VStack padding={3} spacing={3} align={'stretch'}>
					<Box fontSize={30}> SIGN IN</Box>

					{/* Email */}
					<FormControl isRequired isInvalid={noUserEmail}>
						<Input
							placeholder="Email"
							type="text"
							color={'white'}
							p={2}
							value={userEmail}
							name="email"
							onChange={(e) => {
								setUserEmail(e.target.value);
							}}
						/>
						<FormErrorMessage>No user email</FormErrorMessage>
					</FormControl>

					{/* Password */}
					<FormControl isRequired isInvalid={incorrectPassword}>
						<InputGroup>
							<Input
								placeholder="Password"
								type={togglePassword ? 'text' : 'password'}
								name="password"
								value={userPass}
								onChange={(e) => setUserPass(e.target.value)}
							/>

							<InputRightElement>
								<IconButton
									aria-label={
										togglePassword ? 'Hide password' : 'Show password'
									}
									icon={togglePassword ? <ViewOffIcon /> : <ViewIcon />}
									variant="ghost"
									onClick={() => setTogglePassword(!togglePassword)}
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
						onClick={() => setFormState('forgot-password')}
					>
						{' '}
						Forgot Password
					</Box>
				</VStack>
				<Flex gap={1}>
					Don't have an account?
					<Box
						_hover={{
							textColor: 'yellow',
						}}
						cursor={'pointer'}
						onClick={() => setFormState('signup')}
					>
						Sign up
					</Box>
				</Flex>
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

		const [otpSent, setOtpSent] = useState(false);
		const [confirmationMessage, setConfirmationMessage] = useState('');

		const handleForgotPassword = async ({ email }: { email: string }) => {
			try {
				setOtpSent(false);
				const { data } = await axios.post(
					backendUrl + '/api/auth/reset-pass-otp',
					{
						email,
					}
				);

				if (!data.success) {
					console.log('forgot pass error: ', data.message);
					setConfirmationMessage(data.message);
				}

				if (data.success) {
					setOtpSent(true);
					// setConfirmationMessage(data.message);
				}
			} catch (err) {
				console.error('forgot password error:', err.message);
				setConfirmationMessage(err.message);
			}
		};

		return (
			<div>
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
								// onChange={handleInputChange}
							/>

							{errors.email ? (
								<FormErrorMessage>{errors.email.message}</FormErrorMessage>
							) : (
								<FormErrorMessage>{confirmationMessage}</FormErrorMessage>
							)}

							<Button
								_hover={{
									background: '#006da5',
								}}
								bg={'#0c638d'}
								textColor={'white'}
								type="submit"
							>
								Send OTP
							</Button>
						</FormControl>
					</VStack>
					<Flex gap={2}>
						{' '}
						<Box
							_hover={{
								textColor: 'yellow',
							}}
							cursor={'pointer'}
							onClick={() => setFormState('signin')}
						>
							Sign in
						</Box>
						or
						<Box
							_hover={{
								textColor: 'yellow',
							}}
							cursor={'pointer'}
							onClick={() => setFormState('signup')}
						>
							Sign up
						</Box>
					</Flex>
				</form>

				{otpSent && <OTPForm />}
			</div>
		);
	};

	const OTPForm = () => {
		const {
			control,
			handleSubmit,
			formState: { errors },
		} = useForm({
			resolver: zodResolver(otpSchema),
			defaultValues: {
				otp: '',
			},
		});
		const [otpMessageError, setOtpMessageError] = useState('');
		const [otpMessage, setOtpMessage] = useState('');
		const [successChangePass, setSuccessChangePass] = useState(false);

		const handleOTP = async ({ otp }: { otp: string }) => {
			try {
				setSuccessChangePass(false);
				const { data } = await axios.post(
					backendUrl + '/api/auth/verify-reset-pass',
					{
						otp,
					}
				);

				if (!data.success) {
					setOtpMessageError(data.message);
				}

				if (data.success) {
					setSuccessChangePass(true);
					setOtpMessage(data.message);
				}
			} catch (err) {
				console.log(err.message);
			}
		};

		return (
			<form onSubmit={handleSubmit(handleOTP)}>
				<FormControl isInvalid={!!errors.otp || !!otpMessageError}>
					<Controller
						control={control}
						name="otp"
						render={({ field: { onChange, value } }) => (
							<HStack>
								<Box>Enter your OTP</Box>
								<PinInput otp size={'xs'} value={value} onChange={onChange}>
									<PinInputField />
									<PinInputField />
									<PinInputField />
									<PinInputField />
									<PinInputField />
									<PinInputField />
								</PinInput>
							</HStack>
						)}
					></Controller>

					{errors.otp ? (
						<FormErrorMessage>{errors.otp.message}</FormErrorMessage>
					) : (
						otpMessageError && (
							<FormErrorMessage>{otpMessageError}</FormErrorMessage>
						)
					)}
					<Button
						_hover={{
							background: '#006da5',
						}}
						bg={'#0c638d'}
						textColor={'white'}
						type="submit"
					>
						Enter
					</Button>

					{successChangePass && <Box>{otpMessage}</Box>}
				</FormControl>
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
				return <ForgotPasswordForm />;
		}
	};

	return (
		<div className=" h-svh flex flex-col justify-center items-center text-white">
			<div className=" z-20 px-3 py-4 rounded-3xl w-[90%] max-w-[25rem] sm:w-[25rem] lg:w-[30rem] 2xl:w-[50rem] bg-themeBlue-800">
				{renderForm()}
			</div>
		</div>
	);
};

export default SignUpForm;
