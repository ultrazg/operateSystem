import api from 'util/axios';
const qs = require('qs');

/** 分页数据 */
export const page = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/invoice/page',
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

/** 根据查询条件获取试算表分页数据 */
export const listByCondition = (data, flag) =>
  api.request({
    method: 'post',
    url: `/api/trial/balance/listByCondition?flag=${flag}`,
    data,
  });

/** 根据查询条件获取试算表分页数据 */
export const viewHisList = (params) =>
  api.request({
    method: 'post',
    // url: `/api/trial/balance/viewHisList?id=${id}`,
    url: `/api/trial/balance/viewHisList?id=${
      params.data.year ? `${params.data.id}&year=${params.data.year}` : params.data.id
    }`,
  });

/** 导出试算总表 */
export const exportList = (data) =>
  api.request({
    method: 'post',
    url: '/api/trial/balance/export?flag=1',
    data,
    // responseType: 'blob',
  });

/**  导入试算表 */
export const balanceImport = (data) =>
  api.request({
    method: 'POST',
    url: 'api/trial/balance/import',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  });
