import api from 'util/axios';
const qs = require('qs');

/** 小站项目分页列表 */
export const page = (data) =>
  api.request({
    method: 'post',
    url: '/api/project/station/page',
    data,
  });

// /** 获取所有城市erp编码 */
// export const getCityErp = (id) =>
//   api.request({
//     method: 'post',
//     url: `/api/project/station/getCityErp/${id}`,
//     data,
//   });

/** 新增小站项目 */
export const addStation = (data) =>
  api.request({
    method: 'post',
    url: '/api/project/station/add',
    data,
  });

/** 小站项目导入 */
export const importStation = (data) =>
  api.request({
    method: 'post',
    url: '/api/project/station/import',
    data,
  });

/** 小站导出 */
export const exportStation = (data) =>
  api.request({
    method: 'post',
    url: '/api/project/station/export',
    data,
    responseType: 'blob',
  });

/** 修改小站项目 */
export const updateStation = (data) =>
  api.request({
    method: 'post',
    url: '/api/project/station/update',
    data,
  });

/** 小站项目删除 */
export const delStation = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/project/station/${id}`,
  });

/** 小站项目详情 */
export const detail = (id) =>
  api.request({
    method: 'get',
    url: `/api/project/station/${id}`,
  });

/** 以租代建生成合作合同 */
export const addCooContract = (data) =>
  api.request({
    method: 'post',
    url: '/api/project/station/addCooContract',
    data,
  });

/** 批量拆站 */
export const batchUpdate = (data) =>
  api.request({
    method: 'post',
    url: '/api/project/station/batchUpdate',
    data,
  });
