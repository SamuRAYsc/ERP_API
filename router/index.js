const Router = require('express').Router;
const userController = require('../controllers/userController.js');
const fileController = require('../controllers/fileController.js');
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');

const router = new Router();

router.post('/signup', body('id').isEmail(), body('password').isLength({min:4, max:30}), userController.registration);
router.post('/signin', userController.login);
router.post('/signin/new_token', userController.refresh);
router.get('/info', authMiddleware, userController.getInfo);
router.get('/logout', authMiddleware, userController.logout);


router.post('/file/upload', authMiddleware, fileController.upload);
router.get('/file/list', authMiddleware, fileController.list);
router.delete('/file/delete/:id', authMiddleware, fileController.delete);
router.get('/file/:id', authMiddleware, fileController.getFileInfo);
router.get('/file/download/:id', authMiddleware, fileController.download);
router.put('/file/update/:id', authMiddleware, fileController.updateFile);


module.exports = router;