import api from 'util/axios';
const qs = require('qs');

/** 用户列表 */
export const getUserListByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/adminUser/getUserListByCondition',
    data,
  });

/** 添加用户 */
export const addUser = (data) =>
  api.request({
    method: 'post',
    url: '/api/adminUser/addUser',
    data,
  });

/** 获取配置角色列表 */
export const getRolesList = (username) =>
  api.request({
    method: 'get',
    url: `/api/role/listRolesByUsername/${username}`,
  });

/** 配置角色*/
export const addUserRoles = (data) =>
  api.request({
    method: 'post',
    url: '/api/role/addUserRoles',
    data,
  });

/** 修改角色 (编辑)*/
export const updateUser = (data) =>
  api.request({
    method: 'put',
    url: '/api/adminUser/updateUser',
    data,
  });

/** 禁用角色 */
export const cancelUser = (username) =>
  api.request({
    method: 'get',
    url: `/api/adminUser/cancelUser?username=${username}`,
  });

/** 启用角色 */
export const enableUser = (username) =>
  api.request({
    method: 'get',
    url: `/api/adminUser/enableUser?username=${username}`,
  });

/** 重置用户密码 */
export const resetPassword = (username) =>
  api.request({
    method: 'get',
    url: `/api/adminUser/resetPassword?username=${username}`,
  });
