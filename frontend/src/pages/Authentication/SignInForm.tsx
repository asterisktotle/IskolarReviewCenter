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
	Flex,
    Text
} from '@chakra-ui/react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';


const SignInForm = () => {
    
        const {
            login,
            email,
            setEmail,
            setPassword,
            incorrectPassword,
            noUserEmail,
            setAuthForm
        } = useAuthStore();
        
    
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
                    <Text textStyle='2xl' >Sign in to your account</Text>
                    {/* <p className=' md:text-3xl'>Sign in to your account</p> */}
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
                        type="submit"
                    >
                        Sign In
                    </Button>
                   
                </VStack>

                
                    
                 <Text
                        _hover={{
                            textColor: 'orange',
                        }}
                        cursor={'pointer'}
                        w={'full'}
                        textAlign={'center'}
                        onClick={() => {
                            setAuthForm('forgot-password')}}
                    >
                        {' '}
                        Forgot Password
                    </Text>
                <Flex gap={1}>
                    
                 

                    Don't have an account?

               
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
        );
    };


export default SignInForm;