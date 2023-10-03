import api from 'util/axios';
const qs = require('qs');

/** 合作单位列表 */
export const getListByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationUnit/getListByCondition',
    data,
  });
/** 合作单位编辑(含单位资质) */
export const updateCooperationUnit = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationUnit/update',
    data,
  });
/** 合作单位新增(含单位资质) */
export const saveCooperationUnit = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationUnit/save',
    data,
  });

/** 根据单位名称获取合作单位详情 */
export const getCooperationUnitByName = (name) =>
  api.request({
    method: 'get',
    url: `/api/cooperationUnitByName/${name}`,
  });
export const getCooperationUnitById = (id) =>
  api.request({
    method: 'get',
    url: `/api/cooperationUnit/${id}`,
  });

/** 根据id删除合作单位*/
export const deleteCooperationUnitById = (id) =>
  api.request({
    method: 'delete',
    url: `/api/cooperationUnit/${id}`,
  });

/** 根据id删除合作信息*/
export const deleteCooperationDetailsById = (id) =>
  api.request({
    method: 'delete',
    url: `/api/cooperationDetails/${id}`,
  });
/** 根据id删除评估信息*/
export const deleteCooperationAssessmentById = (id) =>
  api.request({
    method: 'delete',
    url: `/api/cooperationAssessment/deleteCooperationAssessment/${id}`,
  });

/** 导出单位列表 */
export const getCooperationExcel = (name) =>
  api.request({
    method: 'get',
    url: '/api/cooperationUnit/getExcel',
    responseType: 'blob',
  });

/** 导出合作信息列表 */
export const getCooperationDetailExcel = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationDetails/export',
    responseType: 'blob',
    data,
  });

/** 合作信息列表 */
export const getCooperationDetails = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationDetails/getListByCondition',
    data,
  });

/** 合作信息列表编辑 */
export const updateCooperationDetails = (data) =>
  api.request({
    method: 'put',
    url: '/api/cooperationDetails/update',
    data,
  });

/** 合作信息列表编辑 */
export const updateV1CooperationDetails = (data) =>
  api.request({
    method: 'put',
    url: `/api/cooperationDetails/v1/update?id=${data.id}&actualCooperationRatio=${data.actualCooperationRatio}`,
  });

/** 合作信息列表新增 */
export const saveCooperationDetails = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationDetails/save',
    data,
  });

/** 合作框架查看 */
export const getCooperationFrameworkDetails = (id) =>
  api.request({
    method: 'get',
    url: `/api/cooperationFramework/${id}`,
  });
/** 合作单位资质查看 */
export const getCooperationDetailsById = (id) =>
  api.request({
    method: 'get',
    url: `/api/cooperationDetails/${id}`,
  });

/** 待办状态下拉框 */
export const getListByCommand = (data) =>
  api.request({
    method: 'post',
    url: '/api/dealwithInfo/getListByCommand',
    data,
  });

/** 月度报告 */
export const getListCooperationAssessmentByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationAssessment/getListCooperationAssessmentByCondition',
    data,
  });
/** 年度报告 */
export const getListCooperationAssessmentYearByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationAssessment/getListCooperationAssessmentYearByCondition',
    data,
  });

/** 月/年评估编辑 */
export const updateCooperationAssessment = (data) =>
  api.request({
    method: 'put',
    url: '/api/cooperationAssessment/updateCooperationAssessment',
    data,
  });

/** 月评估新增 */
export const addCooperationAssessment = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationAssessment/addCooperationAssessment',
    data,
  });

/** 人员评估 */
export const getListCooperationQlicationByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationQlication/getListByCondition',
    data,
  });

/** 人员资质修改*/
export const updateCooperationQlication = (data) =>
  api.request({
    method: 'put',
    url: '/api/cooperationQlication/update',
    data,
  });
/** 人员资质修改*/
export const saveCooperationQlication = (data) =>
  api.request({
    method: 'put',
    url: '/api/cooperationQlication/save',
    data,
  });
/** 资质详情 */
export const getCooperationQlicationById = (id) =>
  api.request({
    method: 'get',
    url: `/api/cooperationQlication/${id}`,
  });
