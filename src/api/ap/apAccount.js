import api from 'util/axios';
const qs = require('qs');

/** 分页数据 */
export const page = (data) =>
  api.request({
    method: 'post',
    url: '/api/ap/getListByConditions',
    data,
  });

/** 获取详情 */
export const detail = (id) =>
  api.request({
    method: 'get',
    url: `/api/cooperation/invoice/get?id=${id}`,
  });

/** 修改 */
export const update = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/invoice/update',
    data,
  });

/** 新增 */
export const add = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/invoice/add',
    data,
  });

/** 删除 */
export const deleteInvoice = (id) =>
  api.request({
    method: 'delete',
    url: `/api/cooperation/invoice/delete?id=${id}`,
  });

/** 导出 */
export const exportList = (data) =>
  api.request({
    method: 'post',
    url: '/api/ap/export',
    data,
    responseType: 'blob',
  });

/** 导入 */
export const importInfoApi = (data) =>
  api.request({
    method: 'post',
    url: '/api/ap/import',
    data,
  });
