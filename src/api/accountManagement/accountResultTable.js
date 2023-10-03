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

/** 导出核算表 */
export const exportList = (data, flag) =>
  api.request({
    method: 'post',
    url: `/api/project/balance/export?flag=${flag}`,
    data,
    // responseType: 'blob',
  });

/** 根据查询条件获取试算表分页数据 */
export const listByCondition = (data, flag) =>
  api.request({
    method: 'post',
    url: `/api/project/balance/listByCondition?flag=${flag}`,
    data,
  });

/** 查看所有账期的历史数据 */
export const viewHisList = (params) =>
  api.request({
    method: 'post',
    url: `/api/project/balance/viewHisList?id=${
      params.data.year ? `${params.data.id}&year=${params.data.year}` : params.data.id
    }`,
  });

/** 导出核算表--查看连的导出按钮 */
export const exportHis = (params) =>
  api.request({
    method: 'post',
    url: `/api/project/balance/exportHis?id=${
      params.data.year ? `${params.data.id}&year=${params.data.year}` : params.data.id
    }`,
    // data,
    responseType: 'blob',
  });
