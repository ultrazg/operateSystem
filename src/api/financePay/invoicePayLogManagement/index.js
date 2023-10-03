import api from 'util/axios';
const qs = require('qs');
/** 查询 */

export const getListByCommand = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoicePayLog/getListByCondition',
    data,
  });
/** 详情查询 */
export const getPayLogListByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/invoiceDetailBankRelation/getPayLogListByCondition',
    data,
  });
