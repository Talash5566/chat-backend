import express from 'express';
import { isLogin } from '../middleware/isLogin.js';
import { chattingusers, searchuser } from '../Controller/usercontroller.js';
import { startConversation } from '../Controller/Messagecontroller.js';
const router = express.Router();

router.get('/search' , isLogin , searchuser)
router.get('/currentchatters', isLogin , chattingusers)
router.post('/conversation/start/:userId', isLogin, startConversation);
export default router;