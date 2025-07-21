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


import { useNavigate } from 'react-router-dom';
import {  useState } from 'react';
import { signupSchema } from '../../schema/formSchema';
import useAuthStore from '../../store/authStore';

type FormValuesSignUp = z.infer<typeof signupSchema>;


const SignUpForm = () => {
        
		const [togglePassword, setTogglePassword] = useState(false);
		const [toggleConfirmPass, setToggleConfirmPass] = useState(false);
		const [emailAlreadyUsed, setEmailAlreadyUsed] = useState(false);

        const {
            setIsLogin,
            backendUrl,
            getUserData,
            setAuthForm
        } = useAuthStore();

        const navigate = useNavigate()

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
						onClick={() => setAuthForm('signin')}
					>
						Sign in
					</Box>
				</Flex>
			</form>
		);
	};

export default SignUpForm;