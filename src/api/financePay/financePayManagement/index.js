import api from 'util/axios';
const qs = require('qs');

/** 查询 */
export const getFinancePayList = (data) =>
  api.request({
    method: 'post',
    url: '/api/financePay/getFinancePayList',
    data,
  });

/** 查询 */
export const getInvoiceActualPaymentList = (data) =>
  api.request({
    method: 'post',
    url: '/api/financePay/getInvoiceActualPaymentList',
    data,
  });
