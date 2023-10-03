import api from 'util/axios';
const qs = require('qs');

/** Excel导入列表 */
export const getExcelImportLst = (data) =>
  api.request({
    method: 'post',
    url: '/api/excelImport/list',
    data,
  });

/** Excel下载功能 */
export const excelDownload = (fileCode) =>
  api.request({
    method: 'get',
    url: `/api/fileupload/download?fileCode=${fileCode}`,
    responseType: 'blob',
  });
