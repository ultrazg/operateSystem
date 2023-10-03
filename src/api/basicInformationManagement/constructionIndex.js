import api from 'util/axios';
const qs = require('qs');

/** 委托方管理列表 */
export const dictionaryListByConditions = (data) =>
  api.request({
    method: 'post',
    url: '/api/dictionary/dictionaryListByConditions',
    data,
  });
