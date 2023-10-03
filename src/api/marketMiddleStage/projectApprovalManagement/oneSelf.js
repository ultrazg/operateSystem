import api from 'util/axios';
const qs = require('qs');

/** 自建项目分页列表 */
export const page = (data) =>
  api.request({
    method: 'post',
    url: '/api/project/self/page',
    data,
  });

/** 新增自建项目 */
export const addSelf = (data) =>
  api.request({
    method: 'post',
    url: '/api/project/self/add',
    data,
  });

/** 自建项目导入 */
export const importSelf = (data) =>
  api.request({
    method: 'post',
    url: '/api/project/self/import',
    data,
  });
/** 自建项目导出 */
export const exportSelf = (data) =>
  api.request({
    method: 'post',
    url: '/api/project/self/export',
    data,
    responseType: 'blob',
  });
/** 修改自建项目 */
export const updateSelf = (data) =>
  api.request({
    method: 'post',
    url: '/api/project/self/update',
    data,
  });

/** 自建项目删除 */
export const delSelf = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/project/self/${id}`,
  });

/** 自建项目详情 */
export const detail = (id) =>
  api.request({
    method: 'get',
    url: `/api/project/self/${id}`,
  });

/** 自建项目合作合同新增 */
export const addCooContract = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationContract/v1/add',
    data,
  });
