import api from 'util/axios';
const qs = require('qs');

/** 付款金额详情列表查询 */
export const getListByInvoiceActualPayment = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoiceActualPayment/getListByCommand',
    data,
  });

/** 批次列表查询 */
export const batchListByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/subpackageBatch/batchListByCondition',
    data,
  });

/** 项目批次列表查询 */
export const getSubpackageInvoiceBatchListByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/subpackageInvoice/getSubpackageInvoiceBatchListByCondition',
    data,
  });
/** 项目批次列表查询 */
export const getSubpackageInvoiceActualListByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/subpackageInvoice/getSubpackageInvoiceActualListByCondition',
    data,
  });

/** 合作发票新增 */
export const subpackageBatchAdd = (data) =>
  api.request({
    method: 'post',
    url: '/api/subpackageBatch/add',
    data,
  });
