import api from 'util/axios';
const qs = require('qs');

/** 查询 */
export const getListByCommand = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoiceActualPayment/getListByCommand',
    data,
  });

/** 付款报账单号修改 */
export const updateBackFill = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoiceActualPayment/backFill',
    data,
  });

/** 驳回 */
export const invoiceActualPaymentReject = (id) =>
  api.request({
    method: 'get',
    url: `/api/invoiceActualPayment/reject/${id}`,
  });

/** 驳回 */
export const invoiceActualPaymentConfirm = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoiceActualPayment/confirm',
    data,
  });

/** 核销暂估应付 */
export const invoicePayDetailListForUpdate = (data) =>
  api.request({
    method: 'post',
    url: '/api/financePay/invoicePayDetailListForUpdate',
    data,
  });

/** 列表金额 */
export const billNumberListForUpdate = (data) =>
  api.request({
    method: 'post',
    url: '/api/financePay/billNumberListForUpdate',
    data,
  });

/** 列表金额 */
export const financePay = (id) =>
  api.request({
    method: 'get',
    url: `/api/page/financePay/toPay?erpNumber=${id}`,
  });

/** 修改付款报账 */
export const paymentInfoUpdate = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoiceActualPayment/paymentInfoUpdate',
    data,
  });

/** 新增付款报账 */
export const paymentInfoSave = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoiceActualPayment/paymentInfoSave',
    data,
  });

/** 核销暂估应付 */
export const getInvoicePayDetailList = (data) =>
  api.request({
    method: 'post',
    url: '/api/financePay/getInvoicePayDetailList',
    data,
  });

/** 列表金额 */
export const subPackageBillNumberList = (data) =>
  api.request({
    method: 'post',
    url: '/api/financePay/subPackageBillNumberList',
    data,
  });
