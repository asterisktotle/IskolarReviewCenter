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
	Text,
} from '@chakra-ui/react';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	signupSchema,
	forgotPasswordSchema,
	otpSchema,
} from '../schema/formSchema';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

type FormValuesSignUp = z.infer<typeof signupSchema>;

const SignUpForm = () => {
	const navigate = useNavigate();

	const {
		login,
		isLogin,
		setIsLogin,
		email,
		setEmail,
		setPassword,
		incorrectPassword,
		noUserEmail,
		backendUrl,
		getUserData,
	} = useAuthStore();

	const [formState, setFormState] = useState('signin');
	const [otpSent, setOtpSent] = useState(false);

	useEffect(() => {
		if (isLogin) {
			navigate('/dashboard');
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
										icon={togglePassword ? <ViewIcon /> : <ViewOffIcon />}
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
										icon={toggleConfirmPass ? <ViewIcon /> : <ViewOffIcon />}
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
						<FormErrorMessage>Email not found</FormErrorMessage>
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
									icon={togglePassword ? <ViewIcon /> : <ViewOffIcon />}
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
		const { register, handleSubmit } = useForm({
			resolver: zodResolver(forgotPasswordSchema),
		});

		const [errorMessage, setErrorMessage] = useState(false);

		const handleForgotPassword = async ({ email }: { email: string }) => {
			try {
				setOtpSent(false);
				setErrorMessage(false);
				const { data } = await axios.post(
					backendUrl + '/api/auth/reset-pass-otp',
					{
						email,
					}
				);

				if (!data.success) {
					console.log('forgot pass error: ', data.message);
					setErrorMessage(true);
					return;
				}

				if (data.success) {
					console.log(data.message);
					setOtpSent(true);
					return;
				}
			} catch (err) {
				console.error('forgot password error:', err.message);
			}
		};

		return (
			<Box p={3}>
				<Box fontSize={30}> Forgot Password</Box>

				{otpSent ? (
					<OTPForm />
				) : (
					<form onSubmit={handleSubmit(handleForgotPassword)}>
						<VStack padding={3} spacing={3} align={'stretch'}>
							<FormControl isRequired isInvalid={errorMessage}>
								<Input
									placeholder="Email"
									type="email"
									{...register('email')}
									color={'white'}
									p={2}
									// onChange={handleInputChange}
								/>
								<FormErrorMessage>
									This account is not registered user.
								</FormErrorMessage>
							</FormControl>
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
							<Flex gap={1}>
								Already have an OTP?
								<Box
									_hover={{
										textColor: 'yellow',
									}}
									cursor={'pointer'}
									onClick={() => setOtpSent(!otpSent)}
								>
									Enter here!
								</Box>
							</Flex>
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
				)}
			</Box>
		);
	};

	const OTPForm = () => {
		const {
			control,
			handleSubmit,
			register,
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
		const [togglePassword, setTogglePassword] = useState(false);

		const handleOTP = async (userData) => {
			const { email, password, otp } = userData;

			try {
				setOtpMessageError('');
				setSuccessChangePass(false);
				const { data } = await axios.post(
					backendUrl + '/api/auth/verify-reset-pass',
					{
						email,
						password,
						otp,
					}
				);

				if (!data.success) {
					setOtpMessageError(data.message);

					console.log('failed send', data.message);
					return;
				}
				setSuccessChangePass(true);
				setOtpMessage(data.message);
				console.log('otp msg ', otpMessage);
				console.log('success change password');
			} catch (err) {
				console.log(err.message);
				alert(err.message);
			}
		};

		if (successChangePass) {
			return (
				<Flex gap={1}>
					<Text>Password Changed Successfully</Text>{' '}
					<Text
						_hover={{
							textColor: 'yellow',
						}}
						cursor={'pointer'}
						onClick={() => setFormState('signin')}
					>
						Sign in
					</Text>
				</Flex>
			);
		}

		return (
			<Box bgColor={'green'}>
				<form
					onSubmit={handleSubmit(handleOTP)}
					className="flex flex-col items-center gap-2 "
				>
					<Box>Enter your OTP from the email we've sent you.</Box>

					<FormControl isRequired isInvalid={!!errors.email}>
						<Input
							placeholder="Enter your email"
							type="text"
							color={'white'}
							p={2}
							{...register('email')}
						/>
						<FormErrorMessage>{errors.email?.message}</FormErrorMessage>
					</FormControl>
					<FormControl isRequired isInvalid={!!errors.password}>
						<InputGroup>
							<Input
								placeholder="New Password"
								type={togglePassword ? 'text' : 'password'}
								{...register('password')}
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
						<FormErrorMessage>{errors.password?.message}</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={!!errors.otp || !!otpMessageError}>
						<Controller
							control={control}
							name="otp"
							render={({ field: { onChange, value } }) => (
								<HStack justifyContent={'center'} alignItems={'center'}>
									<PinInput otp size={'md'} value={value} onChange={onChange}>
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
					</FormControl>

					<Button
						_hover={{
							background: '#006da5',
						}}
						bg={'#0c638d'}
						textColor={'white'}
						type="submit"
					>
						Enter OTP
					</Button>
				</form>

				<Box
					_hover={{
						textColor: 'yellow',
					}}
					cursor={'pointer'}
					onClick={() => setOtpSent(!otpSent)}
				>
					Request OTP
				</Box>
			</Box>
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
			<Box
				backdropFilter="blur(10px)"
				border="1px solid"
				borderColor="whiteAlpha.500"
				shadow="md"
				marginBlock={'1'}
				marginInline={{ sm: 0, base: -5 }}
				p={5}
				rounded={'lg'}
			>
				{renderForm()}
			</Box>
		</div>
	);
};

export default SignUpForm;
