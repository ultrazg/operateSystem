import api from 'util/axios';
const qs = require('qs');

/** 外经证列表 */
export const getListByCommand = (data) =>
  api.request({
    method: 'post',
    url: '/api/financeOutermanag/getListByCommand',
    data,
  });
/** 外经证新增 */
export const save = (data) =>
  api.request({
    method: 'post',
    url: '/api/financeOutermanag/save',
    data,
  });
/** 外经证更新 */
export const update = (data) =>
  api.request({
    method: 'post',
    url: '/api/financeOutermanag/update',
    data,
  });
/** 详情页信息 */
export const detailPage = (id) =>
  api.request({
    method: 'get',
    url: `/api/page/financeOutermanag/detailPage/${id}`,
  });
/** 确认外经证 */
export const submit = (id) =>
  api.request({
    method: 'get',
    url: `/api/financeOutermanag/submit/${id}`,
  });
/** 外经证打印 */
export const detailPrintPage = (id) =>
  api.request({
    method: 'get',
    url: `/api/page/financeOutermanag/detailPrintPage/${id}`,
  });
/** 外经证删除 */
export const deletefinanceOutermanag = (id) =>
  api.request({
    method: 'get',
    url: `/api/financeOutermanag/${id}`,
  });
/** 回填附件上传 */
export const fileupload = (data) =>
  api.request({
    method: 'post',
    url: '/api/fileupload/upload',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  });

/** 提交回执 */
export const receiptInfoBatchUpdate = (data) =>
  api.request({
    method: 'post',
    url: '/api/financeOutermanag/receiptInfoBatchUpdate',
    data,
  });

// 新版本

/** 外经证导入 */
export const importOutermanag = (data) =>
  api.request({
    method: 'post',
    url: '/api/finance/outermanag/v1/api/financeOutermanag/import',
    data,
  });

/** 外经证导出 */
export const exportOutermanag = (data) =>
  api.request({
    method: 'post',
    url: '/api/finance/outermanag/v1/api/financeOutermanag/export',
    data,
    responseType: 'blob',
  });

/** 外经证列表 */
export const pageOutermanag = (data) =>
  api.request({
    method: 'post',
    url: '/api/finance/outermanag/v1/api/financeOutermanag/page',
    data,
  });

/** 删除 */
export const deleteOutermanag = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/finance/outermanag/v1/api/financeOutermanag/deleteById?id=${id}`,
  });

/** 外经证新增 */
export const saveOutermanag = (data) =>
  api.request({
    method: 'post',
    url: '/api/finance/outermanag/v1/api/financeOutermanag/save',
    data,
  });

/** 外经证修改 */
export const updateOutermanag = (data) =>
  api.request({
    method: 'post',
    url: '/api/finance/outermanag/v1/api/financeOutermanag/update',
    data,
  });

/** 获取外经证详情 */
export const detailOutermanag = (id) =>
  api.request({
    method: 'get',
    url: `/api/finance/outermanag/v1/api/financeOutermanag/detail?id=${id}`,
  });

/** 外经证回填 */
export const backFillOutermanag = (data) =>
  api.request({
    method: 'post',
    url: '/api/finance/outermanag/v1/api/financeOutermanag/backFill',
    data,
  });
