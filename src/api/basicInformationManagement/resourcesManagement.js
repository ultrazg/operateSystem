import api from 'util/axios';
const qs = require('qs');

/** 模板下载列表 */
export const listAllPermissions = () =>
  api.request({
    method: 'get',
    url: '/api/role/listAllPermissions',
  });
