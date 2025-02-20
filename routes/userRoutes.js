const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/searchEmail/:userName', authController.searchEmail);
router.post('/signup', authController.signup);
router.post('/signupOAuth', authController.signupOAuth);
router.post('/login', authController.login);
router.post('/loginOAuth', authController.loginOAuth);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/verifyMail/:token', authController.verifyMail)

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.use(authController.protect);

//router.delete('/logout', authController.protects)
router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
