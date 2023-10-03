import api from 'util/axios';
const qs = require('qs');

/** 分页数据 */
export const page = (data) =>
  api.request({
    method: 'post',
    url: '/api/receivable/invoice/page',
    data,
  });

/** 分包发票选择 */
export const subpackagePage = (data) =>
  api.request({
    method: 'post',
    url: '/api/receivable/invoice/receivableWithCooperationInvoicePage',
    data,
  });

/** 获取详情 */
export const detail = (id) =>
  api.request({
    method: 'post',
    url: '/api/receivable/invoice/receivableBatchWithDetailAndBackfillList',
    data: {
      batchId: id,
    },
  });

/** 修改 */
export const update = (data) =>
  api.request({
    method: 'post',
    url: '/api/receivable/invoice/update',
    data,
  });

/** 新增 */
export const add = (data) =>
  api.request({
    method: 'post',
    url: '/api/receivable/invoice/save',
    data,
  });

/** 删除 */
export const deleteInvoice = (id) =>
  api.request({
    method: 'post',
    url: `/api/receivable/invoice/receivableInvoiceDelete?id=${id}`,
  });

/** 导出 */
export const exportList = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/invoice/export',
    data,
    responseType: 'blob',
  });

/** 应收发票回填新增列表 */
export const backfillAddList = (data) =>
  api.request({
    method: 'post',
    url: '/api/receivable/invoice/backfillAddList',
    data,
  });

/** 应收发票回填录入 */
export const backfillSave = (data) =>
  api.request({
    method: 'post',
    url: '/api/receivable/invoice/backfillSave',
    data,
  });
