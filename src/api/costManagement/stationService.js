import api from 'util/axios';
const qs = require('qs');

/** 以租代建服务费管理 */
/**  以租代建服务费统计列表 */
export const getListByConditions = (data) =>
  api.request({
    method: 'POST',
    url: '/api/serviceCost/getListByConditions',
    data,
  });

/**  以租代建服务费管理  站点电费统计导出 */
export const handleExport = (data) =>
  api.request({
    method: 'POST',
    url: '/api/serivceCost/export',
    data,
    responseType: 'blob',
  });

/**  获取站点成本详情 */
export const serviceCostDetails = (id) =>
  api.request({
    method: 'POST',
    url: `/api/serviceCost/serviceCostDetails/${id}`,
  });

/**  查看站点信息 */
export const stationDetails = (id) =>
  api.request({
    method: 'POST',
    url: `/api/serviceCost/stationDetails/${id}`,
  });

/**  以租代建服务费统计列表 */
export const getServiceCostDetailsList = (data) =>
  api.request({
    method: 'POST',
    url: '/api/serviceCost/getServiceCostDetailsList',
    data,
  });

/**  成本详情导出 */
export const exportDetails = (id) =>
  api.request({
    method: 'POST',
    url: `/api/serivceCost/exportDetails?id=${id}`,
    responseType: 'blob',
  });
