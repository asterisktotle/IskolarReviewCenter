import useAuthStore from '../store/store';
import { useAuth } from '../hooks/useAuth';
const Home = () => {
	const { userData } = useAuth();

	return (
		<div className="text-white">
			Hello
			{userData ? userData.name : 'developer'}
		</div>
	);
};

export default Home;
