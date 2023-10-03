import api from 'util/axios';
const qs = require('qs');

/** 待办状态下拉框 */
export const getListByCommand = (data) =>
  api.request({
    method: 'post',
    url: '/api/dealwithInfo/getListByCommand',
    data,
  });

/** 合作框架查看 */
export const cooperationFramework = (id) =>
  api.request({
    method: 'get',
    url: `/api/cooperationFramework/${id}`,
  });

/** 判断是否需要审核人 */
export const checkAudit = (data) =>
  api.request({
    method: 'post',
    url: '/api/processFlow/checkAudit',
    data,
  });

/** 获取审核人列表 */
export const getUserListByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/adminUser/getUserListByCondition',
    data,
  });

/** 处理 */
export const submitAudit = (data) =>
  api.request({
    method: 'post',
    url: '/api/processFlow/submitAudit',
    data,
  });
