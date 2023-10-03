/* eslint-disable */
import router from 'router'
import { saveLocal, hasChild } from 'util/tool'
import { toTree } from 'util/util'
import { getuserRoleMeanList } from 'api/user'
import { Notification } from 'element-ui';
import { setTimeout } from 'timers';
import store from '@/store'
import routes, { loginRoute, biderRoute } from 'router/routers.js';

// 登录成功获取当前用户可访问的路由信息,添加路由表信息
let myMap = new Map(),
    whiteList = ['/', 'index', 'indexPage', 'updatePassword', 'error_404',
        'edit',
    ];
export const getUserRoleRouter = ({ commit, state, getters }, resData) => {
    return new Promise((resolve, reject) => {
            // let list = creatMenuByRouters(meanMap(resData.mergedPermissions))
            // function creatMenuByRouters(list) {
            //     if (list.length === 0) return;
            //     list.forEach((item, index) => {
            //         if (!hasChild(item)) {
            //             commit('setMeanOperation', { key: item.permissionCode, value: item.operation })
            //         } else {
            //             creatMenuByRouters(item.children)
            //         }
            //     })
            // }
            console.log('resData.menuFunctionSetPermissions', resData.menuFunctionSetPermissions)
            commit('setMeanOperation', resData.menuFunctionSetPermissions || {})
            let whritRouterList = Array.from(new Set(whiteList.concat(whiteList))) // whritRouterList去重
            commit('setWhritRouterList', whritRouterList)
            saveLocal('whritRouterList', whritRouterList)

            resolve()
    })
}

const subBefore = (str) => {
    let indexss = str.lastIndexOf("_");
	return str.substring(0, indexss);
}

const subAfter = (str) => {
    let indexsss = str.lastIndexOf("_")
    return str.substring(indexsss + 1, str.length);
}

function meanMap(list) {
    if (!list) return []
    let map = {}
    list.forEach(item => {
        if(map[subBefore(item)]) {
            map[subBefore(item)] = map[subBefore(item)].concat([subAfter(item)])
        } else {
            map[subBefore(item)] = [subAfter(item)]
        }
    });

    console.log('map', map)
    // let val = []
    // list.forEach(item => {
    //     let par = map[item.parentId]
    //     console.log('par', par)
    //     if (par) {
    //         (par.operation || (par.operation = [])).push(item.permissionCode.split('_')[1])
    //     } else {
    //         val.push(item)
    //     }
    // })

    return map
}