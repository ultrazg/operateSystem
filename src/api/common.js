import api from 'util/axios';
const qs = require('qs');

/** 类型 */
export const typeData = () =>
  api.request({
    method: 'get',
    url: '/api/excelImport/getTypeData',
  });

/** 执行结果 */
export const resultData = () =>
  api.request({
    method: 'get',
    url: '/api/excelImport/getResultData',
  });

/** 职务 */
export const position = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=position',
  });

/** 所属生产中心 */
export const productionCenterCode = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=DEPT',
  });

/** 缴纳形式 */
export const payType = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=pay_type',
  });

/** 投标进度 */
export const tenderProgress = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=tender_progress',
  });

/** 投标结果 */
export const tenderResult = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=tender_result',
  });

/** 项目归属 */
export const projectBelong = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=project_belong',
  });

/** 购买标书方式 */
export const documentType = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=document_type',
  });

/** 投标形式 */
export const tenderType = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=tender_type',
  });

/** 是否已核销 */
export const bondIsCancel = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=true_or_false',
  });

/** 待办状态下拉框 */
export const dealWithStatus = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=dealWith_status',
  });

/** 对应业务状态下拉框 */
export const businessCode = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=business_code',
  });

/** 省份下拉框 */
export const provincialCode = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=provincial',
  });

/** 城市下拉框 */
export const selectListByParentCode = (province) =>
  api.request({
    method: 'get',
    url: `/api/dictionary/selectListByParentCode?code=${province}`,
  });

/** 区县下拉框 */
export const getAreasByParentCode = (city) =>
  api.request({
    method: 'get',
    url: `/api/dictionary/getAreasByParentCode?parentCode=${city}`,
  });

/** 获取城市erp*/
export const getcityErpByParentCode = (id) =>
  api.request({
    method: 'post',
    url: `/api/project/station/getCityErp/${id}`,
  });

/** 专业下拉框 */
export const majorCode = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=major',
  });

/** 合作单位下拉框 */
export const constructionCode = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=construction',
  });

/** 主体下拉框 */
export const subjectCode = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=subject',
  });

/** 审核状态下拉框 */
export const verifyStatusCode = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=verify_status',
  });

/** 合作级别下拉框 */
export const cooperationLevelCode = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=cooperation_level',
  });

/** 委托方下拉框 */
// export const constructionCode = () =>
// api.request({
//   method: 'get',
//   url: '/api/dictionary/selectListByParentCode?code=construction',
// });

/** 商机管理-商机来源下拉框 */
export const busiResourceCode = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=busi_resource',
  });

/** 商机管理-投标状态下拉框 */
export const tenderStateInfo = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=tender_state',
  });

/** 商机管理-是否中标下拉框 */
export const tenderWin = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=tender_win',
  });

/** 商机管理-二级专业下拉框 */
export const twoMajor = (oneMajor) =>
  api.request({
    method: 'get',
    url: `/api/dictionary/selectListByParentCode?code=${oneMajor}`,
  });

/** 商机管理-采购形式下拉框 */
export const purchaseModality = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=purchase_modality',
  });
/** 采购管理-采购形式下拉框 */
export const purchaseType = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=purchase_type',
  });

/** 商机管理-市场类型下拉框 */
export const marketType = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=market_type',
  });

/** 商机管理-商机类别下拉框 */
export const opportunityCategory = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=opportunity_category',
  });

/** 商机管理-拓展类别下拉框 */
export const expandType = () =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=expand_type',
  });

/** 项目管理-税率下拉框 */
export const dictionaryListByConditions = (data) =>
  api.request({
    method: 'post',
    url: '/api/dictionary/dictionaryListByConditions',
    data,
  });

/** 商机使用日志列表-操作类型下拉框 */
export const operationType = (data) =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=operation_type',
    data,
  });

/** 获取具体下拉框参数 */
export const getDictionary = (data) =>
  api.request({
    method: 'get',
    url: `/api/dictionary/${data}`,
  });
/** 获取最近投标信息 */
export const getTenderInfoWithCreateUser = () =>
  api.request({
    method: 'get',
    url: '/api/tenderInfo/getTenderInfoWithCreateUser',
  });
/** 获取最近商机信息 */
export const getBusinessOpportunityByCreateUser = () =>
  api.request({
    method: 'get',
    url: '/api/businessOpportunity/getBusinessOpportunityByCreateUser',
  });

/** 项目详情展示 */
export const projectDetailInfo = (id) =>
  api.request({
    method: 'get',
    url: `/api/page/projectApproval/projectDetailInfo?type=detail&projectID=${id}`,
  });
/** 项目累积金额 */
export const selectByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/projectTemp/selectByCondition',
    data,
  });
/** 合作合同 */
export const getCooContractList = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationContract/getCooContractList',
    data,
  });
/** 承揽合同 */
export const getHireContractList = (data) =>
  api.request({
    method: 'post',
    url: '/api/hireContract/list',
    data,
  });
/** 发票类型下拉框 */
export const invoiceType = (data) =>
  api.request({
    method: 'get',
    url: '/api/dictionary/selectListByParentCode?code=invoice_type',
    data,
  });

/** 新增项目金额 */
export const addProjectTemp = (data) =>
  api.request({
    method: 'post',
    url: '/api/projectTemp/add',
    data,
  });
/** 修改项目金额 */
export const updateProjectTemp = (data) =>
  api.request({
    method: 'put',
    url: '/api/projectTemp/update',
    data,
  });
/** 删除项目金额 */
export const deleteProjectTemp = (id) =>
  api.request({
    method: 'DELETE',
    url: `/api/projectTemp?id=${id}`,
  });
/** 项目金额进度 */
export const getSchedules = (erpNumber) =>
  api.request({
    method: 'get',
    url: `/api/projectTemp/getSchedules?erpNumber=${erpNumber}`,
  });
