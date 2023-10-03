import api from 'util/axios';
const qs = require('qs');

/** 框架列表 */
export const getHireFrameworkList = (data) =>
  api.request({
    method: 'post',
    url: '/api/hireFramework/getHireFrameworkList',
    data,
  });

/** 承揽框架详情 */
export const hireFrameworkDetail = (id) =>
  api.request({
    method: 'get',
    url: `/api/hireFramework/${id}`,
  });

/** 新增框架列表 */
export const addHireFramework = (data) =>
  api.request({
    method: 'post',
    url: '/api/hireFramework/addHireFramework',
    data,
  });

/** 更新框架列表 */
export const updateHireFramework = (data) =>
  api.request({
    method: 'PUT',
    url: '/api/hireFramework/updateHireFramework',
    data,
  });

/** 删除承揽框架 */
export const hireFrameworkDel = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/hireFramework/${id}`,
  });
