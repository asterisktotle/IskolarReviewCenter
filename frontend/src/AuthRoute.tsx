import { Navigate } from 'react-router-dom';
import useAuthStore from '../src/store/store.js';
const AuthenticatedRoute = ({ children }) => {
	const isLogin = useAuthStore((state) => state.isLogin);
	if (!isLogin) {
		return <Navigate replace to={'/login'} />;
	}
	return children;
};

export default AuthenticatedRoute;
