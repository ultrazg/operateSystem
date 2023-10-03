import api from 'util/axios';
const qs = require('qs');

/** 框架列表 */
export const getHireContractList = (data) =>
  api.request({
    method: 'post',
    url: '/api/hireContract/list',
    data,
  });

/** 承揽合同详情信息 */
export const hireContractDetail = (id) =>
  api.request({
    method: 'get',
    url: `/api/page/hireContract/viewIndex?id=${id}`,
  });
/** 项目详情信息 */
export const getProjectBaseInfo = (id) =>
  api.request({
    method: 'get',
    url: `/api/projectApproval/getProjectBaseInfo?erpId=${id}`,
  });

/** 新增承揽合同 */
export const addHireContract = (data) =>
  api.request({
    method: 'post',
    url: '/api/hireContract/add',
    data,
  });

/** 承揽合同更新 */
export const updateHireContract = (data) =>
  api.request({
    method: 'POST',
    url: '/api/hireContract/update',
    data,
  });

/** 承揽合同更新 */
export const hireGetListByCondition = (data) =>
  api.request({
    method: 'POST',
    url: '/api/projectApproval/hireGetListByCondition',
    data,
  });

/** 删除承揽合同 */
export const hireContractDel = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/hireContract/delete/${id}`,
  });
