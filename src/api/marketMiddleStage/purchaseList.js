import api from 'util/axios';
const qs = require('qs');

/** 查询采购列表2 */
export const getPurchaseListByConditions = (data) =>
  api.request({
    method: 'post',
    url: '/api/purchase/getPurchaseListByConditions',
    data,
  });

/**  商机选择列表 */
export const selectBusinessOpportunityByConditions = (data) =>
  api.request({
    method: 'post',
    url: '/api/businessOpportunity/selectBusinessOpportunityByConditions',
    data,
  });

/**  采购新增 */
export const addPurchase = (data) =>
  api.request({
    method: 'post',
    url: '/api/purchase/addPurchase',
    data,
  });

/**  采购修改 */
export const editPurchase = (data) =>
  api.request({
    method: 'put',
    url: '/api/purchase/editPurchase',
    data,
  });
/**  采购详情 */
export const getPurchaseInfoById = (id) =>
  api.request({
    method: 'POST',
    url: `/api/purchase/getPurchaseInfoById/${id}`,
  });

/**  采购删除 */
export const deletePurchase = (id) =>
  api.request({
    method: 'delete',
    url: `/api/purchase/deletePurchase/${id}`,
  });

/**  采购导出2 */
export const getExcel = (data) =>
  api.request({
    method: 'post',
    url: '/api/purchase/getExcel',
    responseType: 'blob',
    data,
  });
