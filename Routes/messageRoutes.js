import express from 'express'
import { isLogin } from '../middleware/isLogin.js';
import { getmessge, messagesender } from '../Controller/Messagecontroller.js';

const router = express.Router();

router.post('/send/:id',isLogin,messagesender)
router.get('/:id' , isLogin ,getmessge)

export default router