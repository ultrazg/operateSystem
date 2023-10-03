import api from '@/util/axios';

/** 首页最上面 */
export const getTopCount = () =>
  api.request({
    method: 'get',
    url: '/api/chart/getTopCount',
  });

/** 完成目标(单位:万) */
export const getDeptYearAmountInfoByYear = (year) =>
  api.request({
    method: 'get',
    url: `/api/chart/getDeptYearAmountInfoByYear/${year}`,
  });

/** 财务经营状况 */
export const getReportByMonths = (data) =>
  api.request({
    method: 'post',
    url: `/api/chart/getReportByMonths?month=${data}`,
  });

/** 财务经营状况 */
export const getReportData = (data) =>
  api.request({
    method: 'post',
    url: '/api/chart/getReportData',
    data,
  });

/** 生产中心经营总额(单位:万) */
export const getDeptYearAmountInfoByAll = () =>
  api.request({
    method: 'get',
    url: '/api/chart/getDeptYearAmountInfoByAll',
  });

/** 合作单位资质情况汇总 */
export const getUnitCountInfo = () =>
  api.request({
    method: 'get',
    url: '/api/chart/getUnitCountInfo',
  });
