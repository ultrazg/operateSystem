import api from 'util/axios';
const qs = require('qs');
/** 查询 */

export const getListByCommand = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoicePay/getListByCondition',
    data,
  });

/** 详情查询 */
export const getPayInfo = (data) =>
  api.request({
    method: 'get',
    url: `/api/invoicePay/getPayInfo?invoiceDetailId=${data.invoiceDetailId}&erpNumber=${data.erpNumber}`,
  });

/** 分包发票查询 */
export const selectContractByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/subpackageBatch/selectContractByCondition',
    data,
  });

/** 分包发票生成 */
export const invoicePayManyPay = (data, receiveAmount) =>
  api.request({
    method: 'post',
    url: `/api/invoicePay/manyPay?receiveAmount=${receiveAmount}`,
    data,
  });
