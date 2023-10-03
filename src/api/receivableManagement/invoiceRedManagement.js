import api from 'util/axios';
const qs = require('qs');

/** 分页数据 */
export const page = (data) =>
  api.request({
    method: 'post',
    url: '/api/red/offset/page',
    data,
  });

/** 获取详情 */
export const detail = (id) =>
  api.request({
    method: 'get',
    url: `/api/red/offset/get?id=${id}`,
  });

/** 修改 */
export const update = (data) =>
  api.request({
    method: 'post',
    url: '/api/red/offset/update',
    data,
  });

/** 新增 */
export const add = (data) =>
  api.request({
    method: 'post',
    url: '/api/red/offset/add',
    data,
  });

/** 删除 */
export const deleteRed = (id) =>
  api.request({
    method: 'delete',
    url: `/api/red/offset/delete?id=${id}`,
  });

/** 导出 */
export const exportList = (data) =>
  api.request({
    method: 'post',
    url: '/api/red/offset/export',
    data,
    responseType: 'blob',
  });

/** 新增红冲发票批次时查询应收发票批次详情接口 */
export const getInvoiceReceivableDetails = (data) =>
  api.request({
    method: 'post',
    url: '/api/red/offset/getInvoiceReceivableDetails',
    data,
  });

/** 新增红冲发票批次时查询应收发票批次接口 */
export const getReceivableBatchInfo = (data) =>
  api.request({
    method: 'post',
    url: '/api/red/offset/getReceivableBatchInfo',
    data,
  });
