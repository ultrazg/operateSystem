import api from 'util/axios';
const qs = require('qs');

/**  核销申请新增 */
export const addWriteOff = (data) =>
  api.request({
    method: 'post',
    url: '/api/financeCancel/addFinanceCancel',
    data,
  });

/**  核销申请删除 */
export const deleteWriteOff = (id) =>
  api.request({
    method: 'delete',
    url: `/api/financeCancel/deleteFinanceCancel?id=${id}`,
  });

/**  核销申请详情 */
export const deatilWriteOff = (id) =>
  api.request({
    method: 'get',
    url: `/api/financeCancel/detailFinanceCancel?id=${id}`,
  });

/**  外经证核销列表导出 */
export const getExcel = (data) =>
  api.request({
    method: 'post',
    url: '/api/financeCancel/exportFinanceCancel',
    responseType: 'blob',
    data,
  });

/** 查询核销申请列表 */
export const getwriteOffListByConditions = (data) =>
  api.request({
    method: 'post',
    url: '/api/financeCancel/pageFinanceCancel',
    data,
  });

/**  核销申请修改 */
export const editWriteOff = (data) =>
  api.request({
    method: 'post',
    url: '/api/financeCancel/updateFinanceCancel',
    data,
  });
