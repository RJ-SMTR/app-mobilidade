const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const brtController = require('../../controllers/brt.controller');

const router = express.Router();

router.route('/').get(brtController.getBrts);
router.route('/linha/:linha').get(brtController.getBrtPorLinha);

//veiculos
router.route('/linha/:linha/veiculo').get(brtController.getVeiculos);

//trajetos
router.route('/linha/:linha/trajeto-latlong').get(brtController.getTrajetoLatLong);
router.route('/linha/:linha/trajeto').get(brtController.getTrajeto);

module.exports = router;
