import api from 'util/axios';
const qs = require('qs');

/** 预缴税金列表 */
export const getWriteOffListByCommand = (data) =>
  api.request({
    method: 'post',
    url: '/api/financeOutermanag/getWriteOffListByCommand',
    data,
  });
