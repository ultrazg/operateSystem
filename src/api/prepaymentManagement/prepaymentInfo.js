import api from 'util/axios';
const qs = require('qs');

/** 分页数据 */
export const page = (data) =>
  api.request({
    method: 'post',
    url: '/api/prepaidTax/pageQueryPrepaidTaxList',
    data,
  });

/** 分页查询承揽订单列表 */
export const pageQueryContractList = (data) =>
  api.request({
    method: 'post',
    url: '/api/prepaidTax/pageQueryContractList',
    data,
  });

/** 分页查询分包发票列表 */
export const pageQueryInvoiceList = (data) =>
  api.request({
    method: 'post',
    url: '/api/prepaidTax/pageQueryInvoiceList',
    data,
  });

/** 获取详情 */
export const detail = (id) =>
  api.request({
    method: 'post',
    url: `/api/prepaidTax/viewPrepaidTaxInfo?id=${id}`,
  });

/** 修改 */
export const update = (data) =>
  api.request({
    method: 'post',
    url: '/api/prepaidTax/editPrepaidTax',
    data,
  });

/** 新增 */
export const add = (data) =>
  api.request({
    method: 'post',
    url: '/api/prepaidTax/addPrepaidTax',
    data,
  });

/** 删除 */
export const deletePrepaidTax = (id) =>
  api.request({
    method: 'post',
    url: `/api/prepaidTax/deletePrepaidTax?id=${id}`,
  });

/** 导出 */
export const exportList = (data) =>
  api.request({
    method: 'post',
    url: '/api/prepaidTax/exportPrepaidTaxInfo',
    data,
    responseType: 'blob',
  });

/** 导入 */
export const importPrepaidTaxInfo = (data) =>
  api.request({
    method: 'post',
    url: '/api/prepaidTax/importPrepaidTaxInfo',
    data,
  });
