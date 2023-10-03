import api from 'util/axios';
const qs = require('qs');

/** 合作单位列表 */
export const getActualInvoiceListByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/actualInvoice/getActualInvoiceListByCondition',
    data,
  });

/** 分包发票详情 */
export const subpackageDetail = (billId) =>
  api.request({
    method: 'get',
    url: `/api/page/invoice/subpackage-detail/${billId}?type=detail`,
  });
