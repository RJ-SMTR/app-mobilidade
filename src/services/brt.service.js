/* eslint-disable no-console */
// const httpStatus = require('http-status');
const axios = require('axios').default;
// const ApiError = require('../utils/ApiError');
const moment = require('moment');
const linhasBrt = require('../data/linhas-brt');
const trajetosBrt = require('../data/trajetos-brt');
const pontosBrt = require('../data/pontos-brt');

const axiosInstance = axios.create({
  baseURL: 'http://webapibrt.rio.rj.gov.br/api/v1/brt',
});

const queryBrts = async (field = '', value = '') => {
  const brts = await axiosInstance.get('/');

  console.log(field, value);
  return field && value
    ? brts.data.veiculos.filter((v) => v.velocidade > 5 && v[field] === value)
    : brts.data.veiculos.filter((v) => v.velocidade > 5);
};

const queryLinhasBrt = async (linha) => {
  const brts = await axiosInstance.get('/');
  const trajetosDaLinha = trajetosBrt.filter((t) => t.numero === linha);
  return {
    linha: linhasBrt.filter((l) => l.numero === linha),
    veiculos: brts.data.veiculos.filter((v) => v.velocidade > 5 && v.linha === linha),
    trajetos: trajetosDaLinha[0].trajetos.map((t) => ({
      sentido: t.sentido,
      strokeColor: t.sentido === 'ida' ? '#FF0000' : '#000',
      kmTrajeto: t.kmTrajeto,
      tempoMedioViagem: t.tempoMedioViagem,
      coordinates: t.way.coordinates,
      way: t.way.coordinates.map((w) => ({ latitude: w[1], longitude: w[0] })),
    })),
  };
};

const veiculos = async (linha) => {
  const brts = await axiosInstance.get('/');
  return brts.data.veiculos.filter((v) => {
    const agora = moment();
    const ultimaAtualizacao = moment(v.dataHora);
    const idadeDaPosicao = agora.diff(ultimaAtualizacao, 'minutes');
    console.log(idadeDaPosicao);
    return v.linha === linha && idadeDaPosicao <= 10;
  });
  // return brts.data.veiculos.filter((v) => v.velocidade > 5 && v.linha === linha);
};

// trajetos

const _getTrajetosDalinha = (linha) => {
  const trajetosDaLinha = trajetosBrt.filter((t) => t.numero === linha);
  return trajetosDaLinha[0];
};

const _formatCoordinates = (coordinates, latlongLabel) => {
  return latlongLabel ? coordinates.map((w) => ({ lat: w[1], lng: w[0] })) : coordinates;
};

const coordenadasDoTrajeto = async (linha, latlongLabel = false) => {
  const trajeto = _getTrajetosDalinha(linha);

  return trajeto.trajetos.map((t) => ({
    sentido: t.sentido,
    strokeColor: t.sentido === 'ida' ? '#FF0000' : '#333FFF',
    kmTrajeto: t.kmTrajeto,
    tempoMedioViagem: t.tempoMedioViagem,
    coordinates: _formatCoordinates(t.way.coordinates, latlongLabel),
  }));
};

const linhasDoPonto = async (ponto) => {

  return pontosBrt.filter(p => p.codigoDoPonto === ponto)

}

module.exports = {
  queryBrts,
  queryLinhasBrt,
  coordenadasDoTrajeto,
  veiculos,
  linhasDoPonto,
};
