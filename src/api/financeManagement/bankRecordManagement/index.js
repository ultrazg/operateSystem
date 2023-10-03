import api from 'util/axios';
const qs = require('qs');

/** 查询 */
export const getListByCommand = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoiceBankRecord/importResult',
    data,
  });

/** 流水查询 */
export const getImportDetailList = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoiceBankRecord/importDetailList',
    data,
  });

/** 款项性质填写查询 */
export const writeAdjustReason = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoiceBankRecord/writeAdjustReason',
    data,
  });
