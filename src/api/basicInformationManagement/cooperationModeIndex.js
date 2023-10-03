import api from 'util/axios';
const qs = require('qs');

/** 合作模式列表 */
export const getCooperationModeListByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationMode/getCooperationModeListByCondition',
    data,
  });
