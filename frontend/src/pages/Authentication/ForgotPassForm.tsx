import {
    FormControl,
    Box,
    FormErrorMessage,
    Input,
    VStack,
    Button,
    Flex,
} from '@chakra-ui/react';


import axios from 'axios';

import {  useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../../schema/formSchema';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';


const ForgotPasswordForm = () => {
        const { register, handleSubmit } = useForm({
            resolver: zodResolver(forgotPasswordSchema),
        });

        const {
        setAuthForm,
		backendUrl,
	} = useAuthStore();

        const [otpSent, setOtpSent] = useState(false);
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
                    <form onSubmit={handleSubmit(handleForgotPassword)}>
                        <VStack padding={3} spacing={3} align={'stretch'}>
                            <FormControl isRequired isInvalid={errorMessage}>
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    {...register('email')}
                                    color={'white'}
                                    p={2}
                                />
                                <FormErrorMessage>
                                    This account is not registered user.
                                </FormErrorMessage>
                            </FormControl>
                            <Button
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
                                    onClick={() => setAuthForm('otp-form')}
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
                                onClick={() => setAuthForm('signin')}
                            >
                                Sign in
                            </Box>
                            or
                            <Box
                                _hover={{
                                    textColor: 'yellow',
                                }}
                                cursor={'pointer'}
                                onClick={() => setAuthForm('signup')}
                            >
                                Sign up
                            </Box>
                        </Flex>
                    </form>
            
            </Box>
        );
};


export default ForgotPasswordForm;