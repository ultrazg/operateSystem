import api from 'util/axios';
const qs = require('qs');

/** 投标列表 */
export const selectTenderInfoByConditions = (data) =>
  api.request({
    method: 'post',
    url: '/api/tenderInfo/selectTenderInfoByConditions',
    data,
  });

/**  商机选择列表 */
export const selectBusinessOpportunityByConditions = (data) =>
  api.request({
    method: 'post',
    url: '/api/businessOpportunity/selectBusinessOpportunityByConditions',
    data,
  });

/**  投标新增 */
export const addTenderInfo = (data) =>
  api.request({
    method: 'post',
    url: '/api/tenderInfo/addTenderInfo',
    data,
  });

/**  投标修改 */
export const editTenderInfo = (data) =>
  api.request({
    method: 'put',
    url: '/api/tenderInfo/editTenderInfo',
    data,
  });
/**  投标详情 */
export const getTenderInfoById = (id) =>
  api.request({
    method: 'POST',
    url: `/api/tenderInfo/getTenderInfoById/${id}`,
  });

/**  投标删除 */
export const deleteTenderInfoById = (id) =>
  api.request({
    method: 'delete',
    url: `/api/tenderInfo/deleteTenderInfoById/${id}`,
  });

/**  投标导出 */
export const getExcel = (data) =>
  api.request({
    method: 'post',
    url: '/api/tenderInfo/getExcel',
    responseType: 'blob',
    data,
  });
