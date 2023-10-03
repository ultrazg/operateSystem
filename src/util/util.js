/* eslint-disable */
// import Cookies from 'js-cookie'
// import Config from '@/config'
import {
  hasChild,
  getLocal
} from './tool'
import store from '@/store'
export const TOKEN_KEY = 'token'

// 设置用户登录信息保存时间
// export const setToken = username => {
//     Cookies.set('username', username, { expires: Config.cookieExpires || 1 })
// }

// // 获取token
// export const getToken = () => {
//     const token = Cookies.get(TOKEN_KEY);
//     const ret = (token ? token : false)
//     return ret
// }


/**
 * @description 路由匹配map项
 */
const permissionCodeMap = {
  // 待办信息列表
    // 待办信息
  'dealwithInfo': (parentCode, permissionCode) => require(`../view/dealwithInfoManagement/dealwithInfo/index.vue`).default,
  // 中台管理
  // 单位信息管理
  'cooperationUnitManagement': (parentCode, permissionCode) => require(`../view/cooperationManagement/${camelCase(permissionCode)}/index.vue`).default,
  // 合作信息管理
  'cooperationDetailsManagement': (parentCode, permissionCode) => require(`../view/cooperationManagement/${camelCase(permissionCode)}/index.vue`).default,
  // 人员资质管理
  'cooperationQlicationManagement': (parentCode, permissionCode) => require(`../view/cooperationManagement/${camelCase(permissionCode)}/index.vue`).default,
  // 单位月度报告评估
  'cooperationAssessmentManagement': (parentCode, permissionCode) => require(`../view/cooperationManagement/${camelCase(permissionCode)}/index.vue`).default,
  // 单位年度报告评估
  'cooperationAssessmentYearDetail': (parentCode, permissionCode) => require(`../view/cooperationManagement/${camelCase(permissionCode)}/index.vue`).default,
  // 合作发票录入
  'subpackageBatchManagement': (parentCode, permissionCode) => require(`../view/spliptInvoice/${camelCase(permissionCode)}/index.vue`).default,
  // 发票核销记录
  'invoiceWriteOffRecord': (parentCode, permissionCode) => require(`../view/${camelCase(parentCode)}/${camelCase(permissionCode)}/index.vue`).default,
    // 应收发票查询
  'actualInvoiceManagement': (parentCode, permissionCode) => require(`../view/invoiceManager/${camelCase(permissionCode)}/index.vue`).default,
   // 承揽框架
  'hireFramework': (parentCode, permissionCode) => require(`../view/marketMiddleStage/${camelCase(permissionCode)}/index.vue`).default,
    // 项目管理
  'businessOpportunityList': (parentCode, permissionCode) => require(`../view/marketMiddleStage/${camelCase(permissionCode)}/index.vue`).default,
    // 合作框架
  'cooperationFramework': (parentCode, permissionCode) => require(`../view/marketMiddleStage/${camelCase(permissionCode)}/index.vue`).default,
    // 承揽合同
  'hirecontractList': (parentCode, permissionCode) => require(`../view/marketMiddleStage/${camelCase(permissionCode)}/index.vue`).default,
  // 项目管理
  'projectApprovalManagement': (parentCode, permissionCode) => require(`../view/marketMiddleStage/${camelCase(permissionCode)}/index.vue`).default,
  // 项目管理
  'contractList': (parentCode, permissionCode) => require(`../view/marketMiddleStage/${camelCase(permissionCode)}/index.vue`).default,
  // 市场中台-投标管理
  'tenderInfoList': (parentCode, permissionCode) => require(`../view/marketMiddleStage/${camelCase(permissionCode)}/tenderInfoListIndex.vue`).default,
  //商机使用日志列表
  'businessOpportunityLogList': (parentCode, permissionCode) => require(`../view/operationLog/${camelCase(permissionCode)}/index.vue`).default,
  //账务回款-回款查询
  'bankRecordManagement': (parentCode, permissionCode) => require(`../view/financeManagement/${camelCase(permissionCode)}/index.vue`).default,
  //投标信息日志列表
  'tenderInfoLogList': (parentCode, permissionCode) => require(`../view/operationLog/${camelCase(permissionCode)}/index.vue`).default,
  //账务回款-流水信息查询
  'bankRecordDetailManagement': (parentCode, permissionCode) => require(`../view/financeManagement/${camelCase(permissionCode)}/index.vue`).default,
  //账务回款-回款核销
  'invoiceVerificateManagement': (parentCode, permissionCode) => require(`../view/financeManagement/${camelCase(permissionCode)}/index.vue`).default,
  //账务回款-回款匹配
  'bankRecordInvoiceManagement': (parentCode, permissionCode) => require(`../view/financeManagement/${camelCase(permissionCode)}/index.vue`).default,
  //账务应付-付款明细确认
  'invoiceActualPayment': (parentCode, permissionCode) => require(`../view/financePay/${camelCase(permissionCode)}/index.vue`).default,
  // 市场中台-采购管理
 'purchaseList': (parentCode, permissionCode) => require(`../view/marketMiddleStage/${camelCase(permissionCode)}/purchaseListIndex.vue`).default,
  //账务应付-业务付款记录
 'financePayManagement': (parentCode, permissionCode) => require(`../view/financePay/${camelCase(permissionCode)}/index.vue`).default,
  //账务应付-暂估应付明细
  'invoicePayLogManagement': (parentCode, permissionCode) => require(`../view/financePay/${camelCase(permissionCode)}/index.vue`).default,
  //基础信息-用户管理
  'userManagement': (parentCode, permissionCode) => require(`../view/basicInformationManagement/${camelCase(permissionCode)}/userManagementIndex.vue`).default,
  //基础信息-委托方管理
  'constructionManagement': (parentCode, permissionCode) => require(`../view/basicInformationManagement/${camelCase(permissionCode)}/constructionIndex.vue`).default,
  //基础信息-模板下载列表
  'templetDownloadManagement': (parentCode, permissionCode) => require(`../view/basicInformationManagement/${camelCase(permissionCode)}/templetDownloadIndex.vue`).default,
  //基础信息-Excel导入列表
  'excelImportList': (parentCode, permissionCode) => require(`../view/basicInformationManagement/${camelCase(permissionCode)}/excelImportListIndex.vue`).default,
  //基础信息-合作模式管理
  'cooperationModeManagement': (parentCode, permissionCode) => require(`../view/basicInformationManagement/${camelCase(permissionCode)}/cooperationModeIndex.vue`).default,
  //基础信息-角色管理
  'roleManagement': (parentCode, permissionCode) => require(`../view/basicInformationManagement/${camelCase(permissionCode)}/roleManagementIndex.vue`).default,
  //基础信息-权限管理
  'resourcesManagement': (parentCode, permissionCode) => require(`../view/basicInformationManagement/${camelCase(permissionCode)}/resourcesIndex.vue`).default,
  //基础信息-字典管理
  'dictionariesManagement': (parentCode, permissionCode) => require(`../view/basicInformationManagement/${camelCase(permissionCode)}/dictionariesIndex.vue`).default,
  //应用发票管理-应用发票申请
  'invoiceManagerList': (parentCode, permissionCode) => require(`../view/invoiceManager/${camelCase(permissionCode)}/invoiceIndex.vue`).default,
  //账务应付-生成暂估应付
 'invoicePayManagement': (parentCode, permissionCode) => require(`../view/financePay/${camelCase(permissionCode)}/index.vue`).default,
  //账务应付-财务列账确认
 'financeLedger': (parentCode, permissionCode) => require(`../view/financePay/${camelCase(permissionCode)}/index.vue`).default,
  //外经证管理-预缴税金管理
  'prePaymentManagement': (parentCode, permissionCode) => require(`../view/outermanagement/${camelCase(permissionCode)}/index.vue`).default,
  //外经证管理-外经证核销查询
  'financeOuterWriteOff': (parentCode, permissionCode) => require(`../view/outermanagement/${camelCase(permissionCode)}/index.vue`).default,
  //外经证管理-外经证申请
  'financeOuterManagement': (parentCode, permissionCode) => require(`../view/outermanagement/${camelCase(permissionCode)}/index.vue`).default,
  //外经证管理-延期管理
   'extensionManagement': (parentCode, permissionCode) => require(`../view/outermanagement/${camelCase(permissionCode)}/index.vue`).default,
  //外经证管理-核销管理
   'writeOffManagement': (parentCode, permissionCode) => require(`../view/outermanagement/${camelCase(permissionCode)}/index.vue`).default,
  //账务应付-项目财务统计
  'financeprojectList': (parentCode, permissionCode) => require(`../view/financePay/${camelCase(permissionCode)}/index.vue`).default,
  //资质管理-资质总览
  'qualificationOverview': (parentCode, permissionCode) => require(`../view/qualificationManagement/${camelCase(permissionCode)}/index.vue`).default,
  //资质管理-公司资质
  'qualificationCompany': (parentCode, permissionCode) => require(`../view/qualificationManagement/${camelCase(permissionCode)}/index.vue`).default,
  //资质管理-人员资质
  'qualificationPersonel': (parentCode, permissionCode) => require(`../view/qualificationManagement/${camelCase(permissionCode)}/index.vue`).default,
  //资质管理-信息记录管理
  'qualificationInfo': (parentCode, permissionCode) => require(`../view/qualificationManagement/${camelCase(permissionCode)}/index.vue`).default,
 //收入成本管理-自建项目成本
 'selfCost': (parentCode, permissionCode) => require(`../view/costManagement/${camelCase(permissionCode)}/index.vue`).default,
 //收入成本管理-以租代建电费管理
 'stationElectric': (parentCode, permissionCode) => require(`../view/costManagement/${camelCase(permissionCode)}/index.vue`).default,
 //收入成本管理-以租代建服务费统计
 'stationService': (parentCode, permissionCode) => require(`../view/costManagement/${camelCase(permissionCode)}/index.vue`).default,
  //应收发票管理-应收发票录入
  'receivableEnter': (parentCode, permissionCode) => require(`../view/receivableManagement/${camelCase(permissionCode)}/index.vue`).default,
  //应收发票管理-发票红冲管理
  'invoiceRedManagement': (parentCode, permissionCode) => require(`../view/receivableManagement/${camelCase(permissionCode)}/index.vue`).default,
  //预缴税管理-预缴税管理
  'prepaymentInfo': (parentCode, permissionCode) => require(`../view/prepaymentManagement/${camelCase(permissionCode)}/index.vue`).default,
  //核算台账管理-核算表管理
  'accountResultTable': (parentCode, permissionCode) => require(`../view/accountManagement/${camelCase(permissionCode)}/index.vue`).default,
  //核算台账管理-试算表管理
  'trialBalanceManagement': (parentCode, permissionCode) => require(`../view/accountManagement/${camelCase(permissionCode)}/index.vue`).default,
  //核算台账管理-导出管理
  'accountResultExport': (parentCode, permissionCode) => require(`../view/accountManagement/${camelCase(permissionCode)}/index.vue`).default,
  //核算台账管理-项目成本管理
  'trialCost': (parentCode, permissionCode) => require(`../view/accountManagement/accountCostManagement/index.vue`).default,
  //核算台账管理-导出管理
  'apAccount': (parentCode, permissionCode) => require(`../view/ap/${camelCase(permissionCode)}/index.vue`).default,
  //核算台账管理-导出管理
  'apDetail': (parentCode, permissionCode) => require(`../view/ap/${camelCase(permissionCode)}/index.vue`).default,
}
/**
 * @description icon名字提取
 */
const getName = (name) => name && name.trim().split(" ")[1]
/**
 * @description 根据路由创建左侧菜单
 */
 export const creatMenuByRouters = (routers, menuList) => {
  console.log('menuList', menuList)
  // // 应收发票管理
  // menuList.push({
  //   level0: [{id: 1, permissionCode: 'receivableManagement', permissionIco: "iconfont icon-daiban", permissionName: '应收发票管理'}],
  //   level1: [{id: 11, permissionCode: 'receivableEnter', permissionIco: "iconfont icon-daiban", permissionName: '应收发票录入'}, {id: 12, permissionCode: 'invoiceRedManagement', permissionIco: "iconfont icon-daiban", permissionName: '发票红冲管理'}],
  // })
  // 项目成本管理
  // menuList.forEach(menuItem => {
  //   const menuCode = menuItem.level0[0].permissionCode
  //   if(menuCode === 'accountManagement') {
  //     menuItem.level1.push({id: 74, permissionCode: 'accountCostManagement', permissionIco: "iconfont icon-daiban", permissionName: '项目成本管理'})
  //   }
  // })
  if (!menuList) return
  let resRouteList = [{
    path: '/',
    name: '/',
    meta: {
        title: "首页",
        icon: "icon-shouye1"
    },
    redirect: '/index/indexPage'
  }];
  // 后台返回的路由数据
  menuList.forEach((item, index) => {
    let currentMenuRouteList = [];
    // 一级菜单属性
    // const { permissionCode, permissionIco, permissionName } = item.level0[0];
    // parentCode = permissionCode;
    // 一级菜单配置
    let parentMenu = {
      path: `/${camelCase(item.level0[0].permissionCode)}`,
      name: camelCase(item.level0[0].permissionCode),
      component: require(`../components/mainView/main.vue`).default,
      meta: {
          title: item.level0[0].permissionName,
          icon: getName(item.level0[0].permissionIco),
          code: item.level0[0].permissionCode,
      },
    };
    // 循环二级菜单
    if (item.level1 && item.level1.length > 0) {
      item.level1.forEach(levelMenuList => {
        const {
          permissionCode,
          permissionName,
        } = levelMenuList;
        // 将对应code转为驼峰式写法
        const permissionRouteName = camelCase(permissionCode);
        // 匹配路由Map项，匹配成功则用匹配项文件路径、匹配不成功则默认用test文件路径
        let pathRoute = permissionCodeMap[permissionRouteName] ?
        permissionCodeMap[permissionRouteName](item.level0[0].permissionCode, permissionCode) :
        require(`../view/indexPage/indexPage.vue`).default;
        currentMenuRouteList.push({
          path: `${permissionRouteName}`,
          name: `${permissionRouteName}`,
          component: pathRoute,
          meta: {
              title: `${permissionName}`,
              icon: '',
          code: permissionCode,
          }
        })
      })
      // 二级菜单配置赋值到一级菜单children
      parentMenu.children = currentMenuRouteList
    }
    // 添加生成好的路由放置路由列表
    resRouteList.push(parentMenu)
  })
  console.log('resRouteList', resRouteList)
  return resRouteList
 }

 /**
 * @description 动态加载模板文件
 */
const lazyLoading = (name) =>{
  return () => Promise.resolve(require(name).default)
}

 /**
 * @description 导出面包屑路径
 */
export const createBreadcrumb = (list) => {
  let arr = list.map(item => {
    let obj = {}
    obj.meta = item.meta
    obj.name = item.name
    obj.path = item.path

    return obj
  })

  store.commit('setBreadcrumbItem', arr)
}
 /**
 * @description _连接符转驼峰
 */
 const camelCase = (string) => {
	// var rmsPrefix = /^-/;//匹配以-开头的字符串
	// var rdashAlpha = /-([a-z])/g;//全局匹配-后面的小写字母
	// var rdashAlpha = /-([A-Z])/g;//全局匹配-后面的大写字母
	// var rdashAlpha = /-([A-z])/g;//全局匹配-后面的小写字母和大写字母
	var rdashAlpha = /[_-]([A-z\d])/gu;//全局匹配-字符(数字、大写字母、小写字母)比如 -q  -qwer只能匹配到-q  -qw-er可以匹配到-q  -e(匹配-后的第一个字符)
	return string.replace(rdashAlpha, (all, letter) => {
		// console.log(all, letter)//all是-和后面的第一个字符，比如：-q ，letter是去掉-只剩下-后的第一个字符
		return letter.toUpperCase();
	});
}

/**
 * @description 判断当前角色权限是否在当前路由中
 */
const hasInList = (name, operation) => {
  if (operation.some(i => i === name)) return true
  else return false
}


/**
 * @description 根据权限表生成树结构
 */
export const toTree = (data) => {
  if (!data) return []
  let map = {}
  data.forEach(item => {
    map[item.id] = item
  })

  let val = []
  data.forEach(item => {
    let par = map[item.parentId]
    if (par) {
      (par.children || (par.children = [])).push(item)
      if (!item.checked) {
        par['isCheck'] = false
      } else {
        if (!item.hasOwnProperty('children')) item['isCheck'] = true
      }
      if (par.parentId !== 0 && !par.isCheck && par.hasOwnProperty('isCheck')) {
        map[par.parentId]['isCheck'] = false
      }
    } else {
      if (item.checked) item['isCheck'] = true
      val.push(item)
    }
  })
  console.log('val')
  return val
}



// 根据权限表构造树结构
export class CheckTreeData {
  constructor ({
    permissionCode,
    status,
    frontFlag
  }) {
    this.permissionCode = permissionCode;
    this.status = status;
    this.frontFlag = frontFlag;
  }
}


// 判断当前页面是否存在缓存
export const hasLocalData = (pageName) => {
  const data = getLocal('menuTags')
  if (data) {
    return data.some(item => item.name === pageName)
  } else {
    return false
  }
}

export const loadJS = (url, callback) => {
  var script = document.createElement('script'),
    fn = callback;
  script.type = 'text/javascript';
  // IE
  if (script.readyState) {
    script.onreadystatechange = () => {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        fn();
      }
    };
  } else {
    // 其他浏览器
    script.onload = function () {
      fn();
    };
  }
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}
// import { downloadFileCode } from '@/api/dealManagement/updatedealList';
export const handleDownloadCJTemplate = () => {
  downloadFileCode().then(res => {
    if (res.code === '200') {
      const fileCode = res.data.data[0].fileCode
      window.location.href = `/api/fileupload/download?fileCode=${fileCode}`;
    }
  })
}

export const blobToImg = (blob) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.addEventListener('load', () => {
      let img = new Image()
      img.src = reader.result
      img.addEventListener('load', () => resolve(img))
      setTimeout(() => {
        resolve(img)
      }, 500)
    })
    reader.readAsDataURL(blob)
  })
}

export const imgToCanvas = (img) => {
  let canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  let ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)
  return canvas
}

export const watermark = (canvas, text) => {
  return new Promise((resolve, reject) => {
    const { center, bottom} = text;
    let ctx = canvas.getContext('2d')
    // 设置填充字号和字体，样式
    ctx.font = "34px 微软雅黑"
    ctx.fillStyle = "#000"
    // 设置右对齐
    ctx.textAlign = 'center'
    // 在指定位置绘制文字，这里指定距离右下角20坐标的地方
    const widthCenter = canvas.width/2
    ctx.fillText(center, widthCenter, canvas.height/2)
    ctx.textAlign = 'right'
    ctx.fillText(bottom, widthCenter + canvas.width/3, canvas.height - 30)
    canvas.toBlob(blob => resolve(blob))
  })
}

import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit';
import download from "downloadjs"
import axios from 'axios'
import ttf from '@/common/fonts/YaHei.ttf'
const blobToArray = (blob) => {
  return new Promise(async (resolve, reject) => {
    var reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result);
    }; 
    reader.readAsArrayBuffer(blob);
  })
}
export const readPdf = (file, info) => { 
  return new Promise(async (resolve, reject) => {
    const blobob = new Blob([file], { type:'application/pdf;charset=utf-8' });
    const existingPdfBytes = await blobToArray(blobob);
    // // 将arraybuffer数据转成pdf文档
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    // 自定义字体挂载
    axios({method: 'get', url: ttf, responseType: 'blob'}).then(async(res) => {
      const fontBytes = await blobToArray(res.data);
      pdfDoc.registerFontkit(fontkit)
      const customFont = await pdfDoc.embedFont(fontBytes);
      const pages = pdfDoc.getPages()
      const { center, bottom} = info
      for (let i = 0; i < pages.length; i++) {
          const noPage = pages[i]
          const { width, height } = noPage.getSize()
          const centerWidth = (width / 2.5)
          noPage.drawText(center, {
            x: centerWidth,
            y: height / 2,
            size: 20,
            font: customFont,
            //使用上面定义好的内置字体 font:customFont 
            color: rgb(0,0,0),
            opacity: 0.8,
          })
          const deepWidth = (centerWidth / 1.5)
          noPage.drawText(bottom, {
            x: centerWidth + deepWidth + (deepWidth / 2),
            y: 10,
            size: 20,
            font: customFont,
            //使用上面定义好的内置字体 font:customFont 
            color: rgb(0,0,0),
            opacity: 0.8,
        })
      }
      //5. 保存pdf文件的unit64Arrary文件流
      const pdfBytes = await pdfDoc.save();
      download(pdfBytes, `${info.name}.pdf`, "application/pdf");     //下载带水印的pdf
    })

  })
}

export const filterRepeat = (arr, key = 'id') => {
  var obj = {};
   arr = arr.reduce(function (item, next) {
     obj[next[key]] ? '' : obj[next[key]] = true && item.push(next);
     return item;
   }, []);
   return arr
}