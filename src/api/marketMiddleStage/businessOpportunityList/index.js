import api from 'util/axios';
const qs = require('qs');

/** 待办状态下拉框 */
export const getListByCommand = (data) =>
  api.request({
    method: 'post',
    url: '/api/businessOpportunity/selectBusinessOpportunityByConditions',
    data,
  });

/** 详情 */
export const getBusinessOpportunityById = (id) =>
  api.request({
    method: 'post',
    url: `/api/businessOpportunity/getBusinessOpportunityById/${id}`,
  });

/** 删除 */
export const deleteBusinessOpportunity = (id) =>
  api.request({
    method: 'delete',
    url: `/api/businessOpportunity/deleteBusinessOpportunity/${id}`,
  });

/** 编辑 */
export const editBusinessOpportunity = (data) =>
  api.request({
    method: 'put',
    url: '/api/businessOpportunity/editBusinessOpportunity',
    data,
  });

/** 新增 */
export const addBusinessOpportunity = (data) =>
  api.request({
    method: 'post',
    url: '/api/businessOpportunity/addBusinessOpportunity',
    data,
  });

/** 提交审核 */
export const startProcess = (data) =>
  api.request({
    method: 'post',
    url: '/api/processFlow/startProcess',
    data,
  });

/** 导出 */
export const getExcel = () =>
  api.request({
    method: 'get',
    url: '/api/businessOpportunity/getExcel',
    responseType: 'blob',
  });

/** 导出 */
export const getValExcel = (data) =>
  api.request({
    method: 'POST',
    url: '/api/businessOpportunity/v1/getExcel',
    responseType: 'blob',
    data,
  });
