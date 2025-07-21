import {
    FormControl,
    Box,
    FormErrorMessage,
    Input,
    InputRightElement,
    IconButton,
    InputGroup,
    Button,
    HStack,
    PinInputField,
    PinInput,
    Flex,
    Text,
} from '@chakra-ui/react';

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema } from '../../schema/formSchema';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

interface UserDataType {
    email: string;
    password: string;
    otp: string;
}

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

        const {backendUrl, setAuthForm} = useAuthStore();


        const [otpMessageError, setOtpMessageError] = useState('');
        const [otpMessage, setOtpMessage] = useState('');
        const [successChangePass, setSuccessChangePass] = useState(false);
        const [togglePassword, setTogglePassword] = useState(false);

        const handleOTP = async (userData : UserDataType) => {
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
                        onClick={() => setAuthForm('signin')}
                    >
                        Sign in
                    </Text>
                </Flex>
            );
        }

        return (
            <Box>
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
                    onClick={() => setAuthForm('forgot-password')}
                >
                    Request OTP
                </Box>
            </Box>
        );
    };

export default OTPForm;