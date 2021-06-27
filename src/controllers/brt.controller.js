const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { brtService } = require('../services');

const getBrts = catchAsync(async (req, res) => {
  const result = await brtService.queryBrts();
  res.send(result);
});

const getBrtPorLinha = catchAsync(async (req, res) => {
  const result = await brtService.queryLinhasBrt(req.params.linha);
  res.send(result);
});

const getVeiculos = catchAsync(async (req, res) => {
  const result = await brtService.veiculos(req.params.linha);
  res.send(result);
});

const getTrajeto = catchAsync(async (req, res) => {
  const result = await brtService.coordenadasDoTrajeto(req.params.linha);
  res.send(result);
});

const getTrajetoLatLong = catchAsync(async (req, res) => {
  const result = await brtService.coordenadasDoTrajeto(req.params.linha, true);
  res.send(result);
});

module.exports = {
  getBrts,
  getBrtPorLinha,
  getTrajeto,
  getTrajetoLatLong,
  getVeiculos,
};
