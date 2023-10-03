import api from 'util/axios';
const qs = require('qs');

/** 查询发票核销详情 */
export const detailInvoiceWriteOffRecord = (id) =>
  api.request({
    method: 'get',
    url: `/api/invoice/writeOff/record/detail?id=${id}`,
  });

/**  发票核销导出 */
export const handleExport = (data) =>
  api.request({
    method: 'POST',
    url: '/api/invoice/writeOff/record/export',
    responseType: 'blob',
    data,
  });

/** 查询发票核销列表 */
export const getAllInvoiceList = (data) =>
  api.request({
    method: 'POST',
    url: '/api/invoice/writeOff/record/page',
    data,
  });
