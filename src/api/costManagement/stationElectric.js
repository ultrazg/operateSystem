import api from 'util/axios';
const qs = require('qs');

/** 站点统计部分 */
/**  站点电费统计列表 */
export const pageStationElectric = (data) =>
  api.request({
    method: 'POST',
    url: '/api/electricCost/getListByConditions',
    data,
  });

/**  站点电费统计导出 */
export const handleExport = (data) =>
  api.request({
    method: 'POST',
    url: '/api/electricCost/exportExcel',
    data,
    responseType: 'blob',
  });
/** 站点电费详情列表 */
export const getDetailsList = (data) =>
  api.request({
    method: 'POST',
    url: '/api/electricCost/getDetailsList',
    data,
  });

/** 站点电费详情 -- 查看 */
export const projectStation = (id) =>
  api.request({
    method: 'get',
    url: `/api/project/station/${id}`,
  });

/**  站点电费信息导入 */
export const electricInfoImport = (data) =>
  api.request({
    method: 'POST',
    url: '/api/electricCost/importExcel',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  });

/**  生成暂估应付 */
export const createPrepay = (data) =>
  api.request({
    method: 'POST',
    url: '/api/electricCost/createPrepay',
    data,
  });

/** 电费详情部分 */
/**  新增月份电费数据 */
export const addElectricCost = (data) =>
  api.request({
    method: 'POST',
    url: '/api/electricCost/addElectricCost',
    data,
  });

/**  查看月份电费数据 */
export const detailElectricCost = (id) =>
  api.request({
    method: 'POST',
    url: `/api/electricCost/detailElectricCost?id=${id}`,
  });

/**  删除月份电费数据 */
export const deleteElectricCost = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/electricCost/deleteElectricCost/${id}`,
  });

/**  编辑月份电费数据 */
export const editElectricCost = (data) =>
  api.request({
    method: 'POST',
    url: '/api/electricCost/editElectricCost',
    data,
  });

/**  站点电费详情导出 */
export const handleExportDetails = (id) =>
  api.request({
    method: 'POST',
    url: `/api/electricCost/exportExcelDetails?id=${id}`,
    responseType: 'blob',
  });

/**  站点电费详情导出 */
export const getDetails = (id) =>
  api.request({
    method: 'POST',
    url: `/api/electricCost/getDetails/${id}`,
  });
