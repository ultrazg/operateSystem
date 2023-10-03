import api from 'util/axios';
const qs = require('qs');

/** 数据字典列表 */
export const getInvoiceList = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoice/invoiceList',
    data,
  });

/** 编辑开票页详情信息 */
export const editInvoicePage = (id) =>
  api.request({
    method: 'get',
    url: `/api/page/invoice/editInvoicePage/${id}`,
  });

/** 红票操作页面信息 */
export const editRedInvoicePage = (id) =>
  api.request({
    method: 'get',
    url: `/api/page/invoice/editRedInvoicePage/${id}`,
  });

/** 分包发票选择 */
export const getSubpackageInvoiceForInvoice = (data) =>
  api.request({
    method: 'post',
    url: '/api/subpackageInvoice/getSubpackageInvoiceForInvoice',
    data,
  });

/** 开票申请 */
export const addBlueInvoice = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoice/addBlueInvoice',
    data,
  });

/** 开票更新 */
export const updateBlueInvoice = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoice/updateBlueInvoice',
    data,
  });

/** 红票申请 */
export const addRedInvoice = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoice/addRedInvoice',
    data,
  });

/** 红票更新 */
export const updateRedInvoice = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoice/updateRedInvoice',
    data,
  });

/** 红票删除 */
export const deleteRedInvoice = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/invoice/deleteRedInvoice/${id}`,
  });
