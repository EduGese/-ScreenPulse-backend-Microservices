import express from 'express';
import userController from "../controllers/user.controller";


const router = express.Router();

//Register
router.post('/register', userController.registerUser);
//Login
router.post('/login', userController.loginUser);
//FindUser
router.get('/:userId', userController.verifyUserExist);

export default router;
