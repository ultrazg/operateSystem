import originJSONP from 'jsonp';

const jsonp = (url, data, option) => {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data); // url数据拼接

  return new Promise((resolve, reject) => {
    // resolved已完成  rejected已失败
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data); // 成功返回
      } else {
        reject(err); // 失败返回
      }
    });
  });
};

// url后面数据拼接
const param = (data) => {
  let url = '';

  for (const k in data) {
    const value = data[k] !== undefined ? data[k] : ''; // 地址不能传undefined

    url += `&${k}=${encodeURIComponent(value)}`; // `${user.name}`
  }

  return url ? url.substring(1) : '';
};

export default jsonp;
