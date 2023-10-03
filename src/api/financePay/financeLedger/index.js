import api from 'util/axios';
const qs = require('qs');
/** 查询 */

export const getListByCommand = (data) =>
  api.request({
    method: 'post',
    url: '/api/financeLedger/getFinanceLedgerList',
    data,
  });

/** 预缴明细查询 */
export const getLeftList = (data) =>
  api.request({
    method: 'post',
    url: '/api/financeLedger/leftList',
    data,
  });

/** 分包明细查询 */
export const getRightList = (data) =>
  api.request({
    method: 'post',
    url: '/api/financeLedger/rightList',
    data,
  });

/** 执行列账修改 */
export const saveBatchNo = (data) =>
  api.request({
    method: 'post',
    url: '/api/financeLedger/saveBatchNo',
    data,
  });
