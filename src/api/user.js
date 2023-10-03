import api from 'util/axios';
const qs = require('qs');

// 用户登录
export const userLogin = ({ username, password, key, captcha, loginType, certName, SignedDataB64, caLogin }) => {
  const data = qs.stringify({
    username,
    password,
    key,
    captcha,
    loginType,
    certName,
    SignedDataB64,
    caLogin,
  });

  console.log('password', password);

  return api.request({
    method: 'post',
    url: `/api/login?username=${username}&password=${password}`,
    // data,
    // headers: { 'content-type': 'application/x-www-form-urlencoded' }
  });
};

// 用户登出
export const logout = () =>
  api.request({
    method: 'get',
    url: '/api/logout',
  });
// 用户信息
export const adminUserDetail = (id) =>
  api.request({
    method: 'get',
    url: `/api/adminUser/getUserById/${id}`,
  });

// 获取目录
export const indexInfo = () =>
  api.request({
    method: 'get',
    url: '/api/indexInfo',
  });

// 服务器端验证及请求生成随机数
export const verifyCertAndGenRandom = (data) =>
  api.request({
    method: 'post',
    url: '/api/verifyCertAndGenRandom',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  });

// 获取当前用户可访问的权限
export const getuserRoleMeanList = (username) =>
  api.request({
    method: 'get',
    url: `/api/adminUser/${username}`,
  });

// 修改密码
export const updatePassword = (data) =>
  api.request({
    method: 'post',
    url: '/api/adminUser/updatePassword',
    data,
  });

// 绑定CA
export const bindCA = (data) =>
  api.request({
    method: 'post',
    url: '/api/adminUser/bindCA',
    data,
  });

// 修改密码
export const unBindCA = (data) =>
  api.request({
    method: 'post',
    url: '/api/adminUser/unBindCA',
    data,
  });

// 获取公钥
export const getPublicKey = (data) =>
  api.request({
    method: 'post',
    url: '/api/adminUser/getPublicKey',
    data,
  });
// 上传文件
export const importFile = (data) =>
  api.request({
    method: 'post',
    url: '/api/excelImport/importFile',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  });

// 投标管理-上传文件
export const uploadFile = (data) =>
  api.request({
    method: 'post',
    url: '/api/fileupload/upload',
    headers: { 'content-type': 'multipart/form-data' },
    data,
  });

/** 获取合作单位列表 */
export const getCooperationByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationDetails/getListByCondition',
    data,
  });
/** 获取合作框架合作单位列表 */
export const getCooperationUnitByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationUnit/getListByCondition',
    data,
  });
/** 获取采购项目列表 */
export const getPurchaseListByConditions = (data) =>
  api.request({
    method: 'post',
    url: '/api/purchase/getPurchaseListByConditions',
    data,
  });
/** 获取承揽框架选择列表 */
export const getHireFrameworkList = (data) =>
  api.request({
    method: 'post',
    url: '/api/hireFramework/getHireFrameworkList',
    data,
  });
/** 外经证申请-查询承揽合同列表(不分页)，用于新增修改时选择承揽合同 */
export const selectOrderInfo = (data) =>
  api.request({
    method: 'post',
    url: '/api/finance/outermanag/v1/api/financeOutermanag/selectOrderInfo',
    data,
  });
/** 获取项目选择列表 */
export const getProjectApprovalList = (data) =>
  api.request({
    method: 'post',
    url: '/api/hireContractAndProject/list',
    data,
  });
/** 获取承揽框架项目选择列表 */
export const getProjectApprovalListByCondition = (data) =>
  api.request({
    method: 'post',
    url: '/api/projectApproval/getListByCondition',
    data,
  });

/** 获取合作合同列表 */
export const getCooContractList = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperationContract/getCooContractList',
    data,
  });
/** 获取分包发票选择列表 */
export const getSubpackageInvoiceBatchListByGroup = (data) =>
  api.request({
    method: 'post',
    url: '/api/subpackageInvoice/getSubpackageInvoiceBatchListByGroup',
    data,
  });

/** 发票录入-去核销详情中-获取分配发票列表 */
export const getInvoiceList = (data) =>
  api.request({
    method: 'post',
    url: '/api/cooperation/writeOff/invoice/getInvoiceList',
    data,
  });

/** 获取合作框架绑定采购信息选择列表 */
export const getPurchaseList = (data) =>
  api.request({
    method: 'post',
    url: '/api/purchase/getPurchaseList',
    data,
  });
