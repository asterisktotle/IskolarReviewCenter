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
import { formSchema } from '../schema/formSchema';
import useAuthStore from '../store/store';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
type FormValues = z.infer<typeof formSchema>;

const SignUpForm = () => {
	const navigate = useNavigate();
	// const { isLogin } = useAuth();

	const {
		login,
		isLogin,
		setIsLogin,
		isRegister,
		setIsRegister,
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

	const registerForm = async (userData: FormValues) => {
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
		}
	};

	const handleInputChange = (e) => setEmail(e.target.value);

	const handleInputPassword = (e) => setPassword(e.target.value);

	useEffect(() => {
		if (isLogin) {
			navigate('/');
		}
	}, [isLogin, navigate]);
	return (
		<div className=" h-svh flex flex-col justify-center items-center text-white">
			<div className=" z-20 px-3 py-4 rounded-3xl w-[90%] max-w-[25rem] sm:w-[25rem] lg:w-[30rem] 2xl:w-[50rem] bg-themeBlue-800">
				<div>
					<form onSubmit={isRegister ? handleSubmit(registerForm) : loginForm}>
						{isRegister ? (
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
												type={showConfirmPassword ? 'password' : 'text'}
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
						) : (
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
								>
									{' '}
									Forgot Password
								</Box>
							</VStack>
						)}
					</form>
					{isRegister ? (
						<Flex ml={4} padding={3}>
							{/* <span className="mr-1">Already have an account?</span> */}
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
					)}
				</div>
				{/* 		
					<div>
						<form onSubmit={onLogin}>
						
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
					</div> */}
			</div>
			{/* <img
				src={'/welcome-astronaut.png?url.'}
				className="absolute hidden  right-[2%] t z--20 size-50"
			/> */}
		</div>
	);
};

export default SignUpForm;
