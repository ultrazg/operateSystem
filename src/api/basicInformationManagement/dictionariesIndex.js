import api from 'util/axios';
const qs = require('qs');

/** 数据字典列表 */
export const getDictionaryListCode = (data) =>
  api.request({
    method: 'post',
    url: '/api/dictionary/dictionaryListByConditions',
    data,
  });

/** 数据字典列表 */
export const dictionaryListByParentId = (data) =>
  api.request({
    method: 'post',
    url: '/api/dictionary/dictionaryListByParentId',
    data,
  });

/** 数据字典 列表的tree */
export const dictionaryList = (data) =>
  api.request({
    method: 'post',
    url: '/api/dictionary/dictionaryList',
    data,
  });

/** 数据字典 新增 */
export const dictionaryAdd = (data) =>
  api.request({
    method: 'put',
    url: '/api/dictionary',
    data,
  });

/** 数据字典 编辑 */
export const dictionaryUpdate = (data) =>
  api.request({
    method: 'put',
    url: '/api/dictionary/update',
    data,
  });

/** 数据字典 设置为不可用 */
export const disableDictionaries = (code) =>
  api.request({
    method: 'post',
    url: `/api/dictionary/disEnable/${code}`,
  });

/** 数据字典 设置为可用 */
export const enableDictionaries = (code) =>
  api.request({
    method: 'post',
    url: `/api/dictionary/enable/${code}`,
  });
/** 数据字典 删除 */
export const deleteDictionaries = (code) =>
  api.request({
    method: 'delete',
    url: `/api/dictionary/${code}`,
  });
