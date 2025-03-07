import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { getUserData, getListsOfUsers } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.get('/users-list', userAuth, getListsOfUsers);
export default userRouter;
