import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../src/store/authStore.js';
import NavBar from './components/NavBar.js';
const AuthenticatedRoute = () => {
	const isLogin = useAuthStore((state) => state.isLogin);

	console.log('AuthenticatedRoute isLogin:', isLogin); //debugging
	if (!isLogin) {
		console.log('Unauthorized! Redirecting to login...');
		return <Navigate replace to={'/'} />;
	}
	return (
		<div>
			<NavBar />
			<Outlet />
		</div>
	);
};

export default AuthenticatedRoute;
