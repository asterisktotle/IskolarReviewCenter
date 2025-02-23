import useAuthStore from '../store/store';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@chakra-ui/react';
const Home = () => {
	const { userData } = useAuth();
	const { logout } = useAuthStore();

	return (
		<div className="text-white">
			Hello
			{userData ? userData.name : 'developer'}
			<Button onClick={logout}> Logout</Button>
		</div>
	);
};

export default Home;
