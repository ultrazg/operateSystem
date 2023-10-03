import api from 'util/axios';
const qs = require('qs');

/** 人员资质分页列表 */
export const pageperson = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/person/page',
    data,
  });

/** 新增人员资质 */
export const addperson = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/person/add',
    data,
  });

/** 修改人员资质 */
export const updateperson = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/person/update',
    data,
  });

/** 人员资质详情 */
export const detailperson = (id) =>
  api.request({
    method: 'get',
    url: `/api/qualification/person/detail?id=${id}`,
  });

/** 删除人员资质 */
export const deleteperson = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/qualification/person/delete?id=${id}`,
  });

/** 人员资质申请 */
export const applyperson = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/person/apply',
    data,
  });

/** 人员资质信息导出 */
export const exportperson = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/person/export',
    data,
    responseType: 'blob',
  });
