import api from 'util/axios';
const qs = require('qs');

/**  延期申请新增 */
export const addExtension = (data) =>
  api.request({
    method: 'POST',
    url: '/api/financeDelay/addFinanceDelay',
    data,
  });

/**  延期申请删除 */
export const deleteExtension = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/financeDelay/deleteFinanceDelay?id=${id}`,
  });

/**  延期申请详情 */
export const detailExtension = (id) =>
  api.request({
    method: 'GET',
    url: `/api/financeDelay/detailFinanceDelay?id=${id}`,
  });

/**  延期导出 */
export const getExcel = (data) =>
  api.request({
    method: 'POST',
    url: '/api/financeDelay/exportFinanceDelay',
    responseType: 'blob',
    data,
  });

/** 查询延期申请列表 */
export const getExtensionListByConditions = (data) =>
  api.request({
    method: 'POST',
    url: '/api/financeDelay/pageFinanceDelay',
    data,
  });

/**  延期申请修改 */
export const editExtension = (data) =>
  api.request({
    method: 'POST',
    url: '/api/financeDelay/updateFinanceDelay',
    data,
  });
