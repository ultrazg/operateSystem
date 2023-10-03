import api from 'util/axios';
const qs = require('qs');

/** 查询 */
export const getListByCommand = (data) =>
  api.request({
    method: 'post',
    url: '/api/tenderInfo/selectTenderInfoLogByConditions',
    data,
  });
