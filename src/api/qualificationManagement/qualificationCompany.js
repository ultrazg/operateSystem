import api from 'util/axios';
const qs = require('qs');

/** 公司资质分页列表 */
export const pagecompany = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/company/page',
    data,
  });

/** 新增公司资质 */
export const addcompany = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/company/add',
    // headers: { 'content-type': 'multipart/form-data' },
    data,
  });

/** 修改公司资质 */
export const updatecompany = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/company/update',
    // headers: { 'content-type': 'multipart/form-data' },
    data,
  });

/** 公司资质详情 */
export const detailcompany = (id) =>
  api.request({
    method: 'get',
    url: `/api/qualification/company/detail?id=${id}`,
  });

/** 删除公司资质 */
export const deletecompany = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/qualification/company/delete?id=${id}`,
  });

/** 公司资质申请 */
export const applycompany = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/company/apply',
    data,
  });

/** 公司资质信息导出 */
export const exportcompany = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/company/export',
    data,
    responseType: 'blob',
  });
