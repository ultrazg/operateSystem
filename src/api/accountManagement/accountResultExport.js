import api from 'util/axios';
const qs = require('qs');

/** 查询列表 */
export const getList = (data) =>
  api.request({
    method: 'post',
    url: '/api/export/list',
    data,
  });

/** 下载文件 */
export const excelDownload = (fileCode) =>
  api.request({
    method: 'get',
    url: `/api/fileupload/download?fileCode=${fileCode}`,
    responseType: 'blob',
  });
