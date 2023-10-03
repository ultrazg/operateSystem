/* !
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
// import { hasValue } from 'util/tool'
const extend = () => {
  let i = 0;

  const result = {};

  for (; i < arguments.length; i++) {
    const attributes = arguments[i];

    for (const key in attributes) {
      result[key] = attributes[key];
    }
  }

  return result;
};

const decode = (s) => s && s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
const converter = function () {};

function api() {}

function set(key, value, attributes) {
  if (typeof document === 'undefined') {
    return;
  }

  attributes = extend(
    {
      path: '/',
    },
    api.defaults,
    attributes,
  );

  if (typeof attributes.expires === 'number') {
    attributes.expires = new Date(Number(new Date()) + attributes.expires * 864e5);
  }

  // We're using "expires" because "max-age" is not supported by IE
  attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

  try {
    const result = JSON.stringify(value);

    if ((/^[\{\[]/).test(result)) {
      value = result;
    }
  } catch (e) {}

  // 保存到local
  setLocal(key, value);

  // 保存到cookie
  setSaveCookie(key, value, attributes);
}

// 将set内容保存在cookie
function setSaveCookie(key, value, attributes) {
  value = converter.write ? converter.write(value, key) : encodeURIComponent(String(value)).replace(
        /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
        decodeURIComponent,
  );

  key = encodeURIComponent(String(key))
    .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
    .replace(/[\(\)]/g, escape);

  let stringifiedAttributes = '';

  for (const attributeName in attributes) {
    if (!attributes[attributeName]) {
      continue;
    }
    stringifiedAttributes += `; ${attributeName}`;
    if (attributes[attributeName] === true) {
      continue;
    }

    // Considers RFC 6265 section 5.2:
    // ...
    // 3.  If the remaining unparsed-attributes contains a %x3B (";")
    //     character:
    // Consume the characters of the unparsed-attributes up to,
    // not including, the first %x3B (";") character.
    // ...
    stringifiedAttributes += `=${attributes[attributeName].split(';')[0]}`;
  }
  // 然后将数据记录在Cookies
  document.cookie = `${key}=${value}${stringifiedAttributes}`;
}

/**
 * @description 保存localStorage
 */
const setLocal = (key, value) => {
  // window.localStorage.setItem(JSON.stringify(key), JSON.stringify(value))
  window.localStorage[key] = value;
};

/**
 * @description 获取localStorage
 */
const getLocal = (key) => {
  const localStorage = window.localStorage.getItem(key || '[]');

  return localStorage;
};

function get(key, json) {
  if (typeof document === 'undefined') {
    return;
  }

  const jar = {};
  // To prevent the for loop in the first place assign an empty array
  // in case there are no cookies at all.

  const cookies = document.cookie ? document.cookie.split('; ') : [];

  let i = 0;

  for (; i < cookies.length; i++) {
    const parts = cookies[i].split('=');

    let cookie = parts.slice(1).join('=');

    if (!json && cookie.charAt(0) === '"') {
      cookie = cookie.slice(1, -1);
    }

    try {
      const name = decode(parts[0]);

      cookie = (converter.read || converter)(cookie, name) || decode(cookie);

      if (json) {
        try {
          cookie = JSON.parse(cookie);
        } catch (e) {}
      }

      jar[name] = cookie;

      if (key === name) {
        break;
      }
    } catch (e) {}
  }
  // cookie找不到的情况下，取缓存数据
  return key ? (jar[key] ? jar[key] : getLocal(key)) : jar;
}

api.set = function (key, value, attributes) {
  return set(key, value, attributes);
};
api.get = function (key) {
  return get(key, false /* read as raw */);
};
api.getDecodeURIComponent = function (key) {
  /** 因为 特殊的兼容问题所以 默认在get函数前增加一种decode反编译*/
  return decodeURIComponent(api.get(key));
};
api.getJSON = function (key) {
  return get(key, true /* read as json */);
};
api.remove = function (key, attributes) {
  set(
    key,
    '',
    extend(attributes, {
      expires: -1,
    }),
  );
};

api.defaults = {};

// api.withConverter = init;

export default api;
