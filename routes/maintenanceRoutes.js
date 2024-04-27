const express = require('express');
const maintenanceController = require('../controllers/maintenanceController');
const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(maintenanceController.getAllMaintenance)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    maintenanceController.createMaintenance
  );

router
  .route('/:id')
  .get(maintenanceController.getMaintenance)
  .patch(authController.protect, maintenanceController.updateMaintenance)
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    maintenanceController.deleteMaintenance
  );

router
  .route('/:id')
  //.get(requestController.getRequest)
  .patch(authController.protect, 
    authController.restrictTo('admin'),
    maintenanceController.updateMaintenance)
  .get(maintenanceController.getAllMaintenance)
  // .delete(
  //   authController.protect,
  //   authController.restrictTo('user'),
  //   requestController.deleteRequest
  ;
module.exports = router;
