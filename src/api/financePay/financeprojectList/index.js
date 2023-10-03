import api from 'util/axios';
const qs = require('qs');

/** 查询 */
export const getListByCommand = (data) =>
  api.request({
    method: 'post',
    url: '/api/projectFinance/getProjectFinanceList',
    data,
  });

/** 项目基础信息 */
export const financeDetailInfo = (id) =>
  api.request({
    method: 'get',
    url: `/api/page/projectApproval/financeDetailInfo/${id}`,
  });
