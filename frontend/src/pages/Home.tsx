import { useAuth } from '../hooks/useAuth';

const Home = () => {
	const { userData } = useAuth();

	return (
		<div className="text-white">
			<h1>HomePage</h1>

			<p>
				Hello
				{userData ? userData.name : 'developer'}
			</p>
		</div>
	);
};

export default Home;
