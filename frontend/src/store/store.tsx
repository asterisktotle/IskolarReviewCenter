import axios from 'axios';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

axios.defaults.withCredentials = true;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface UserData {
	name: string;
	isAccountVerified: boolean;
}

interface AuthStore {
	// Form display states
	isLogin: boolean;
	isRegister: boolean;
	showPassword: boolean;
	showConfirmPassword: boolean;

	//  Form values
	email: string;
	password: string;

	// Error state
	incorrectPassword: boolean;
	noUserEmail: boolean;

	userData: UserData | null;

	//Setters
	setIsLogin: (value: boolean) => void;
	setIsRegister: (value: boolean) => void;
	setUserData: (data: UserData) => void;
	togglePassword: () => void;
	togglePasswordConfirm: () => void;
	setEmail: (email: string) => void;
	setPassword: (password: string) => void;
	setIncorrectPassword: (value: boolean) => void;
	setNoUserEmail: (value: boolean) => void;

	//API Keys
	backendUrl: string;

	//API Operation
	getUserData: () => Promise<void>;
	getAuth: () => Promise<boolean>;
	login: () => Promise<void>;
	logout: () => Promise<void>;
}

const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			//Initial values
			isLogin: false,
			isRegister: true,
			showPassword: false,
			showConfirmPassword: false,
			email: '',
			password: '',
			incorrectPassword: false,
			noUserEmail: false,
			backendUrl: BACKEND_URL,
			userData: null,

			// Setters
			setIsLogin: (value) => set({ isLogin: value }),
			setIsRegister: (value) => set({ isRegister: value }),
			togglePassword: () =>
				set((state) => ({ showPassword: !state.showPassword })),
			togglePasswordConfirm: () =>
				set((state) => ({
					showConfirmPassword: !state.showConfirmPassword,
				})),
			setEmail: (email) => set({ email }),
			setPassword: (password) => set({ password }),
			setIncorrectPassword: (value) => set({ incorrectPassword: value }),
			setNoUserEmail: (value) => set({ noUserEmail: value }),
			setUserData: (data) => set({ userData: data || null }),

			getUserData: async () => {
				const { backendUrl, setUserData } = get();

				try {
					axios.defaults.withCredentials = true;
					const { data } = await axios.get(backendUrl + '/api/user/data');

					if (data.success) {
						setUserData(data.userData);
					} else if (!data.success) {
						console.log('data unsuccess: ', data.message);
						setUserData(null);
					}
				} catch (err) {
					console.log('getuserdata err: ', err.message);
					setUserData(null);
					throw err;
				}
			},
			getAuth: async () => {
				const { backendUrl, setIsLogin, getUserData, setUserData, logout } =
					get();

				try {
					const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
					if (data.success) {
						setIsLogin(true);
						await getUserData();
						return true;
					} else {
						await logout();
						setIsLogin(false);
						setUserData(null);

						return false;
					}
				} catch (err) {
					setIsLogin(false);
					setUserData(null);

					console.log('getAuth error: ', err.message);
					return false;
				}
			},
			login: async () => {
				const {
					email,
					password,
					getAuth,
					backendUrl,
					setIncorrectPassword,
					setNoUserEmail,
				} = get();
				try {
					const { data } = await axios.post(
						backendUrl + '/api/auth/login',
						{
							email,
							password,
						},
						{ withCredentials: true }
					);

					if (data.success) {
						await getAuth();
						console.log('login:', data.message);
					} else if (data.message === 'User did not exist') {
						setNoUserEmail(true);
					} else if (data.message === 'Incorrect password') {
						setIncorrectPassword(true);
					} else {
						console.log(data.message);
					}
				} catch (err) {
					console.log('login error: ', err.message);
				}
			},
			logout: async () => {
				const { backendUrl, setIsLogin, setUserData } = get();
				try {
					const { data } = await axios.post(backendUrl + '/api/auth/logout');

					if (!data.success) {
						console.log('logout error: ', data.message);
					}

					//clear storage
					setUserData(null);
					setIsLogin(false);
					sessionStorage.removeItem('auth-store');

					console.log('logout: ', data.message);
				} catch (err) {
					console.log('logout catch error: ', err.message);
				}
			},
		}),
		{
			name: 'auth-store',
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({
				isLogin: state.isLogin,
				userData: state?.userData,
			}),
		}
	)
);

export default useAuthStore;
