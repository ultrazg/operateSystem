/* eslint-disable */
import axios from 'axios'
import Qs from 'qs'
import Config from '@/config'
import { Notification, MessageBox } from 'element-ui';
import promise from 'es6-promise';
import store from '@/store'
import { getLocal } from 'util/tool'
promise.polyfill();

// export const baseURL = process.env.NODE_ENV === 'development' ? Config.baseURL.dev : Config.baseURL.pro
    // const baseURL = process.env.NODE_ENV === 'development' ? process.env.API_ROOT : process.env.API_ROOT
const getRequestPrefix = () => {
    // 获取网络协议
    const protocol = window.location.protocol;
    // 获取主机名+端口号
    const domainPort = window.location.host;
    // 获取发布项目的名称
    // 获取路径
    const url = window.location.pathname;
    const webApp = url.split('/')[1];
    // http://127.0.0.1/demo
    const urlPrefix = protocol + "//" + domainPort;
    return urlPrefix;
}
function generateReqKey(config){
    const {method, url, params, data } = config;
    return [method, url, Qs.stringify(params), Qs.stringify(data)].join('&')
}
const pendingRequest = new Map();
function addPendingRequest(config){
    const requestKey = generateReqKey(config);
    config.cancelToken = config.cancelToken || new axios.CancelToken((cancel)=>{
        if(!pendingRequest.has(requestKey)){
            pendingRequest.set(requestKey,cancel)
        }
    });
}
function removePendingRequest(config){
    const requestKey = generateReqKey(config);
    if(pendingRequest.has(requestKey)){
       const cancelToken = pendingRequest.get(requestKey);
       cancelToken(requestKey);
       pendingRequest.delete(requestKey);
    }
}
export const baseURL = process.env.NODE_ENV === 'development' ? Config.baseURL.dev : getRequestPrefix()
class ApiRequest {
    // 基础
    constructor() {
        // this.baseURL = process.env.BASE_API // 默认baseURL
        this.baseURL = baseURL // 默认baseURL
    }

    // 默认配置
    getConfigInfo() {
        const config = {
            baseURL: this.baseURL,
            timeout: 60000,
            // responseType: 'json', // default IE不支持该配置项，启用后返回的数据将没有data字段
            headers: { 'content-type': 'application/json;charset=UTF-8' } // 默认头
        }
        return config
    }

    // 请求创建
    request(options) {
        const instance = axios.create()
        let newOptions = Object.assign(this.getConfigInfo(), options)
        interceptor(instance)
        return instance(newOptions)
    }
}

// 定义拦截器
const interceptor = (instance) => {
    // 请求前
    instance.interceptors.request.use(config => {
        // store.commit('setLoadingCont', true)
        const wirteList = ['getAreasByParentCode', 'selectListByParentCode']
        if(!wirteList.some(str => config.url.indexOf(str) > -1)) {
            removePendingRequest(config); // 检查是否存在重复请求
            addPendingRequest(config); // 将当前请求信息添加到 pendingRequest对象中
        }
        return config
    }, err => {
        // 关闭全局loading...
        // store.commit('setLoadingCont', false)
        return new Promise.reject(err)
    })

    // 响应后
    instance.interceptors.response.use(res => {
        removePendingRequest(res.config); // 从 pendingRequest对象中移除请求
        // 关闭全局loading...
        var time = null
        clearTimeout(time)
        time = setTimeout(() => {
            // store.commit('setLoadingCont', false)
        }, 350);
        // store.commit('setLoadingCont', false)
        if (res.data.code === '200') {
            return res.data
        } else if (res.data.code === '1000') { // 登录超时,需要重新登录
            MessageBox.alert('用户登录超时', '警告', {
                confirmButtonText: '确定',
                type: 'error',
                callback: action => {
                    // 清空登录数据
                    store.commit('user/outUserLogin')
                }
            });
        } else {
            if(!(res.data && res.status===200) || (res.request.responseType !== 'blob' && res.data.code !== '200')){
              Notification.error({
                title: '失败',
                message: res.data.message,
                position: 'bottom-right'
              });
            }
            return res.data
        }
    }, err => {
        removePendingRequest(err.config || {}); // 从 pendingRequest对象中移除请求
        if(err && err.response){
            const { data } = err.response
            Notification.error({
                title: '失败',
                message: data.message,
                position: 'bottom-right'
            });
            // 关闭全局loading...
            // store.commit('setLoadingCont', false)
            return new Promise.reject(err)
        }

    })
}

const apiCreat = new ApiRequest()

export default apiCreat