import api from 'util/axios';
const qs = require('qs');

/** 查询列表 */
export const getListByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/projectApproval/getListByCondition',
    data,
  });

/** 详情 */
export const detail = (data) =>
  api.request({
    method: 'get',
    url: '/api/projectApproval/page/detail',
    data,
  });

/** 详情 */
export const getProjectApproval = (id) =>
  api.request({
    method: 'get',
    url: `/api/projectApproval/${id}`,
  });

/** 保存立项申请 */
export const saveProjectApproval = (data) =>
  api.request({
    method: 'post',
    url: '/api/projectApproval/save',
    data,
  });
/** 更新立项申请 */
export const updateProjectApproval = (data) =>
  api.request({
    method: 'PUT',
    url: '/api/projectApproval/update',
    data,
  });

/** 删除 */
export const delProjectApproval = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/projectApproval/${id}`,
  });

/** 提交审核 */
export const startProcess = (data) =>
  api.request({
    method: 'post',
    url: '/api/processFlow/startProcess',
    data,
  });

/** 更新项目过程状态 */
export const updateProjectProcessStatus = (data) =>
  api.request({
    method: 'post',
    url: '/api/projectProcess/updateProjectProcessStatus',
    data,
  });
/** 获取当前项目过程详情 */
export const getProjectProcessDetailsByErpNumber = (data) =>
  api.request({
    method: 'get',
    url: `/api/projectProcess/getProjectProcessDetailsByErpNumber/${data}`,
  });

/** 获取分解列表 */
export const getSplitList = (data) =>
  api.request({
    method: 'post',
    url: '/api/splitInfo/getSplitList',
    data,
  });
/** 获取分解详情 */
export const getSplitDetail = (id) =>
  api.request({
    method: 'get',
    url: `/api/page/splitInfo/splitDetail?projectID=${id}`,
  });

/** 更新分解信息 */
export const updateSplit = (data) =>
  api.request({
    method: 'PUT',
    url: '/api/splitInfo/updateSplit',
    data,
  });
/** 新增分解信息 */
export const addSplit = (data) =>
  api.request({
    method: 'POST',
    url: '/api/splitInfo/addSplit',
    data,
  });

/** 删除分解信息 */
export const delSplit = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/splitInfo/${id}`,
  });

/** 查看合作合同 */
export const selectByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationContractTemp/selectByCondition',
    data,
  });
/** 查看合作合同详情 */
export const getCooperationContract = (id) =>
  api.request({
    method: 'get',
    url: `/api/page/cooperationContract/detail/${id}`,
  });

/** 新增合作合同金额 */
export const addCooperationContractTemp = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationContractTemp/add',
    data,
  });

/** 更新合作合同金额 */
export const updateCooperationContractTemp = (data) =>
  api.request({
    method: 'put',
    url: '/api/cooperationContractTemp/update',
    data,
  });

/** 分解子项执行(合作合同生成) */
export const splitSubEex = (data) =>
  api.request({
    method: 'POST',
    url: '/api/splitInfo/splitSubEex',
    data,
  });

/** 分解子项信息查询 */
export const splitSubHzms = (hzms) =>
  api.request({
    method: 'get',
    url: `/api/splitInfo/splitSub/${hzms}`,
  });

/** 获取商机详情 */
export const getBusinessOpportunityById = (busiId) =>
  api.request({
    method: 'post',
    url: `/api/businessOpportunity/getBusinessOpportunityById/${busiId}`,
  });

/** 协作项目合作合同新增 */
export const addCooperationContract = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationContract/v1/cooperation/add',
    data,
  });
