import api from 'util/axios';
const qs = require('qs');

/** 预缴税金列表 */
export const getListByCommand = (data) =>
  api.request({
    method: 'post',
    url: '/api/prePayment/getListByCommand',
    data,
  });
/** 预缴税表格打印页面信息 */
export const prePaymentPrintPage = (id) =>
  api.request({
    method: 'get',
    url: `/api/page/financeOutermanag/prePaymentPrintPage/${id}`,
  });

/** 预缴税发票列表 */
export const getPrePaymentRecordList = (data) =>
  api.request({
    method: 'post',
    url: '/api/prePaymentRecord/getListByCommand',
    data,
  });
