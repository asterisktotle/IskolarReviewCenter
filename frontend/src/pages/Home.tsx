import { useAuth } from '../hooks/useAuth';
import AdminDashBoard from './Admin/AdminDashBoard';

const Home = () => {
	const { userData } = useAuth();
	console.log('userdata: ', userData);

	if (userData?.isAdmin) {
		return <AdminDashBoard />;
	}

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
