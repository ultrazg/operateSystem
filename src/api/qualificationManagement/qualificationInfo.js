import api from 'util/axios';
const qs = require('qs');

/** 记录分页列表 */
export const pagerecord = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/record/download/page',
    data,
  });
/** 申请下载记录导出 */
export const exportrecord = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/record/download/export',
    data,
    responseType: 'blob',
  });

/** 记录详情 */
export const detailrecord = (id) =>
  api.request({
    method: 'get',
    url: `/api/qualification/record/download/detail?id=${id}`,
  });

/** 代办审批时信息详情接口 */
export const dealWithrecord = (id) =>
  api.request({
    method: 'get',
    url: `/api/qualification/record/dealWith/detail?id=${id}`,
  });

/** 下载清单 */
export const inventory = (id) =>
  api.request({
    method: 'get',
    url: `/api/qualification/record/download/inventory?id=${id}`,
  });

/** 预警提醒信息分页列表查询 */
export const pagewarning = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/record/warning/page',
    data,
  });

/** 预警信息呈现状态修改 */
export const updateDisplayStatus = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/record/warning/updateDisplayStatus',
    data,
  });

/** 预警提醒信息导出 */
export const exportwarning = (data) =>
  api.request({
    method: 'post',
    url: '/api/qualification/record/warning/export',
    data,
    responseType: 'blob',
  });
