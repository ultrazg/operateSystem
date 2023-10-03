import api from 'util/axios';
const qs = require('qs');

/** 框架列表 */
export const getCooperationFrameworkList = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationFramework/getCooperationFrameworkList',
    data,
  });

/** 承揽框架详情 */
export const cooperationFrameworkDetail = (id) =>
  api.request({
    method: 'get',
    url: `/api/cooperationFramework/${id}`,
  });

/** 新增框架列表 */
export const addcooperationFramework = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationFramework/addCooperationFramework',
    data,
  });

/** 更新框架列表 */
export const updatecooperationFramework = (data) =>
  api.request({
    method: 'PUT',
    url: '/api/cooperationFramework/updateCooperationFramework',
    data,
  });

/** 删除承揽框架 */
export const cooperationFrameworkDel = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/cooperationFramework/${id}`,
  });
