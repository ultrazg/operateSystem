import api from 'util/axios';
const qs = require('qs');

/** 框架列表 */
export const getCooContractList = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationContract/getCooContractList',
    data,
  });

/** 合作合同详情 */
export const cooperationContractDetail = (id) =>
  api.request({
    method: 'get',
    url: `/api/page/cooperationContract/detail/${id}`,
  });

/** 新增合作合同 */
// export const addcooperationFramework = (data) =>
//   api.request({
//     method: 'post',
//     url: '/api/cooperationFramework/addCooperationFramework',
//     data,
//   });

/** 更新合作合同 */
export const updatecooperationContract = (data) =>
  api.request({
    method: 'PUT',
    url: '/api/cooperationContract/updateCooContract',
    data,
  });

/** 删除合作合同 */
export const cooperationFrameworkDel = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/cooperationContract/${id}`,
  });

/** 新增累计付款 */
export const addcooperationContractTemp = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationContractTemp/add',
    data,
  });
/** 更新累计付款 */
export const updatecooperationContractTemp = (data) =>
  api.request({
    method: 'PUT',
    url: '/api/cooperationContractTemp/update',
    data,
  });
/** 根据查询条件获取列表 */
export const selectByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationContractTemp/selectByCondition',
    data,
  });
/** 根据查询条件获取列表 */
export const delcooperationContractTemp = (id) =>
  api.request({
    method: 'post',
    url: `/api/cooperationContractTemp?id=${id}`,
  });

// 新版本
/** 根据查询条件获取列表 */
export const pageContractList = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationContract/v1/page',
    data,
  });

/** 获取详情(协作) */
export const cooContractList = (id) =>
  api.request({
    method: 'get',
    url: `/api/cooperationContract/v1/cooperate/detail/coo?id=${id}`,
  });

/** 获取详情(自建) */
export const selfContractList = (id) =>
  api.request({
    method: 'get',
    url: `/api/cooperationContract/v1/cooperate/detail/self?id=${id}`,
  });

/** 获取详情(以租代建) */
export const stationContractList = (id) =>
  api.request({
    method: 'get',
    url: `/api/cooperationContract/v1/cooperate/detail/station?id=${id}`,
  });

/** 协作/自建项目合作合同新增 */
export const addContractList = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationContract/v1/add',
    data,
  });
/** 合作合同导出 */
export const exportContract = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationContract/v1/export',
    data,
    responseType: 'blob',
  });
