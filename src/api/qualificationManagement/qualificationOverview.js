import api from 'util/axios';
const qs = require('qs');

/** 资质总览信息(整个页面) */
export const getOverview = () =>
  api.request({
    method: 'get',
    url: '/api/qualification/overview/get',
  });

/** 公司资质呈现导出 */
export const exportCompanyQualification = () =>
  api.request({
    method: 'post',
    url: '/api/qualification/overview/exportCompanyQualification',
    responseType: 'blob',
  });

/** 人员资质呈现导出 */
export const exportPersonQualification = () =>
  api.request({
    method: 'post',
    url: '/api/qualification/overview/exportPersonQualification',
    responseType: 'blob',
  });

/** 资质有效提醒导出 */
export const exportQualificationWarning = () =>
  api.request({
    method: 'post',
    url: '/api/qualification/overview/exportQualificationWarning',
    responseType: 'blob',
  });

/** 个人申请资质记录导出 */
export const exportPersonApplyDetails = () =>
  api.request({
    method: 'post',
    url: '/api/qualification/overview/exportPersonApplyDetails',
    responseType: 'blob',
  });

/** 个人申请资质记录下载 */
export const downloadPersonApplyDetails = (batchId) =>
  api.request({
    method: 'post',
    url: `/api/qualification/overview/downloadPersonApplyDetails?batchId=${batchId}`,
  });
