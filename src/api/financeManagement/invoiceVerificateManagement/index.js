import api from 'util/axios';
const qs = require('qs');

/** 查询 */
export const getListByCommand = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoiceDetailBankRelation/getListByCondition',
    data,
  });

/** 核销 */
export const toManyVerificatePass = (data) =>
  api.request({
    method: 'post',
    url: `/api/invoiceDetailBankRelation/toManyVerificatePass?ids=${data}`,
    data,
  });
