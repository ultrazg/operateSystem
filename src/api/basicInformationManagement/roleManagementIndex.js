import api from 'util/axios';
const qs = require('qs');

/** 角色管理列表 */
export const listRolesByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/role/listRolesByCondition',
    data,
  });

/** 获取配置角色tree数据 */
export const listPermissionsByRoleCode = (roleCode) =>
  api.request({
    method: 'post',
    url: `/api/role/listPermissionsByRoleCode?roleCode=${roleCode}`,
  });

/** 获取配置角色列表 */
export const getRolesList = (username) =>
  api.request({
    method: 'get',
    url: `/api/role/listRolesByUsername/${username}`,
  });

/** 配置角色--配置权限功能*/
export const addRolePermissions = (data) =>
  api.request({
    method: 'post',
    url: '/api/role/addRolePermissions',
    data,
  });

/** 配置角色--角色新增*/
export const addRole = (data) =>
  api.request({
    method: 'post',
    url: '/api/role/addRole',
    data,
  });

/** 修改角色 (编辑)*/
export const updateRole = (data) =>
  api.request({
    method: 'put',
    url: '/api/role/updateRole',
    data,
  });

/** 禁用角色 */
export const disableRole = (id) =>
  api.request({
    method: 'post',
    url: `/api/role/disableRole?id=${id}`,
  });

/** 启用角色 */
export const enableUser = (id) =>
  api.request({
    method: 'post',
    url: `/api/role/enableRole?id=${id}`,
  });

/** 删除角色 */
export const deleteRole = (id) =>
  api.request({
    method: 'delete',
    url: `/api/role/deleteRole/${id}`,
  });
