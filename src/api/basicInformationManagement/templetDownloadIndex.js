import api from 'util/axios';
const qs = require('qs');

/** 模板下载列表 */
export const getExcelList = () =>
  api.request({
    method: 'get',
    url: '/api/excel/list',
  });

/** 模板下载 */
export const excelDownload = (fileName) =>
  api.request({
    method: 'get',
    url: `/api/excelExport/exportFile?fileName=${fileName}`,
    responseType: 'blob',
  });
