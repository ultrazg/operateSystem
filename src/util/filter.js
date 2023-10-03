/* eslint-disable */
import{ selectListByParentCode, getAreasByParentCode, getDictionary,getcityErpByParentCode } from '@/api/common';
//获取下一级数据

const getCode = (code, type = 'city', callBack) => {
  if (!code || code === 'null') {
    return [];
  }

  return new Promise((resolve, reject) => {
    let api = selectListByParentCode
    if(type === 'area') {
      api = getAreasByParentCode;
    }
    console.log('type', type)
    api(code)
      .then((res) => {
        if (res && res.code === '200') {
          let codeData = [];

          codeData = res.data.map((item) => ({
            ...item,
           name: item.name || item.areaName,
             id: item.code || item.areaCode,

          }));
          // console.log('eee',item);
          callBack && callBack(codeData)
          resolve(codeData);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const getCodeV1 = (code, type = 'city') => {
  if (!code || code === 'null') {
    return [];
  }

  return new Promise((resolve, reject) => {
    let api = getcityErpByParentCode
   
    // if(type === 'area') {
    //   api = getAreasByParentCode;
    // }
    // if(type === 'cityErp'){
    //   api= getcityErpByParentCode;
    // }

    console.log('type', type)
    
    api(code)
      .then((res) => {
        if (res && res.code === '200') {
          let codeData = [];

          codeData = res.data.map((item) => ({
            ...item,
            name: item.cityName +" "+"("+ item.cityErp +")"|| item.areaName,
            id: item.cityCode || item.areaCode,
            erp:item.cityErp || item.cityErp,
          }));
          console.log('codeData',codeData);
          resolve(codeData);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
//获取下拉框具体数据
const getDictionaryData = (code) => {
  if (!code || code === 'null') {
    return [];
  }

  return new Promise((resolve, reject) => {
    getDictionary(code)
      .then((res) => {
        if (res && res.code === '200') {

          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
// 错误提示
import { Notification } from 'element-ui';
const notifyError = (message) => {
  return Notification.error({
    title: '失败',
    message,
    position: 'bottom-right',
  });
};

const deepMerge = (obj1, obj2) => {
  let key;
  for (key in obj2) {
    // 如果target(也就是obj1[key])存在，且是对象的话再去调用deepMerge，否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
    // 如果obj2[key]没有值或者值不是对象，此时直接替换obj1[key]
    obj1[key] =
      obj1[key] &&
        obj1[key].toString() === "[object Object]" &&
        (obj2[key] && obj2[key].toString() === "[object Object]") ?
        deepMerge(obj1[key], obj2[key]) :
        (obj1[key] = obj2[key]);
  }
  return obj1;
};

export {
  getCode,
  getDictionaryData,
  notifyError,
  deepMerge,
  getCodeV1
};