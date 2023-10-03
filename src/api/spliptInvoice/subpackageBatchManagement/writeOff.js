import api from 'util/axios';
const qs = require('qs');

/** 发票分页数据 */
export const page = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/writeOff/invoice/page',
    data,
  });

/** 获取发票核销详情 */
export const detail = (id) =>
  api.request({
    method: 'get',
    url: `/api/cooperation/writeOff/invoice/get?id=${id}`,
  });

/** 修改 */
export const update = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/writeOff/invoice/update',
    data,
  });

/** 新增 */
export const add = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/writeOff/invoice/add',
    data,
  });

/** 删除 */
export const deleteInvoice = (id) =>
  api.request({
    method: 'delete',
    url: `/api/cooperation/writeOff/invoice/delete?id=${id}`,
  });

/** 导出 */
export const exportList = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/writeOff/invoice/export',
    data,
    responseType: 'blob',
  });

/** 详情中-获取分配发票列表 */
export const getInvoiceList = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/writeOff/invoice/getInvoiceList',
    data,
  });
