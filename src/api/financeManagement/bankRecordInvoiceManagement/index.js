import api from 'util/axios';
const qs = require('qs');

/** 流水明细查询 */
export const getListByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoiceBankRecord/getListByCondition',
    data,
  });

/** 开票明细查询 */
export const invoiceDetailList = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoiceDetail/getListByCondition',
    data,
  });

/** 保存 */
export const saveBlend = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoiceDetailBankRelation/blend',
    data,
  });
