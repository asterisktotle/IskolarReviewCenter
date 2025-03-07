import axios from 'axios';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

axios.defaults.withCredentials = true;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface UserData {
	_id: string;
	name: string;
	email: string;
	isAccountVerified: boolean;
}

interface UsersList {
	success: boolean;
	data: UserData[];
	count: number;
}

interface AdminStore {
	totalUser: number | null;
	usersList: UserData[];
	getUsersList: () => Promise<void>;
}

const AdminStore = create<AdminStore>((set) => ({
	totalUser: null,
	usersList: [],
	getUsersList: async () => {
		try {
			const { data } = await axios.get(BACKEND_URL + '/api/user/users-list');

			if (!data.success) {
				console.log('getUsersList Success: ', data.success);
				return;
			}

			set((state) => ({
				usersList: data.data,
				totalUser: data.count - 1,
			}));
			console.log('getUsersList executed');
		} catch (err) {
			console.log('getUserEmail error: ', err.message);
		}
	},
}));

export default AdminStore;
