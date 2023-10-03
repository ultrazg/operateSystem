import api from 'util/axios';
const qs = require('qs');

/** 发票分页数据 */
export const page = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/invoice/page',
    data,
  });

/** 获取发票详情 */
export const detail = (id) =>
  api.request({
    method: 'get',
    url: `/api/cooperation/invoice/get?id=${id}`,
  });

/** 修改 */
export const update = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/invoice/update',
    data,
  });

/** 新增 */
export const add = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/invoice/add',
    data,
  });

/** 删除 */
export const deleteInvoice = (id) =>
  api.request({
    method: 'delete',
    url: `/api/cooperation/invoice/delete?id=${id}`,
  });

/** 导出 */
export const exportList = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/invoice/export',
    data,
    responseType: 'blob',
  });

/** 发票详情页合同列表数据 */
export const contractList = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/invoice/contractList',
    data,
  });

/** 合同信息中根据费用类型获取相应剩余开票金额 */
export const getFee = (data) =>
  api.request({
    method: 'get',
    url: `/api/cooperation/invoice/fee/get?type=${data.type}&id=${data.id}`,
  });

/** 合同信息中根据erp编号获取承揽订单 */
export const getErpNumber = (erpNumber) =>
  api.request({
    method: 'get',
    url: ` /api/cooperation/invoice/hireContract/get?erpNumber=${erpNumber}`,
  });
