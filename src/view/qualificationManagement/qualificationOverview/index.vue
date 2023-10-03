/* eslint-disable camelcase */
<template>
  <div id="qualificationOverview" class="flexColumn" v-loading="loading">
    <div class="flexRow header">
      <div v-for="headerItem in headerCol" :key="headerItem.id" class="flexRow info">
        <div class="flexCenter icon"><span class="iconfont" :class="headerItem.icon" /></div>
        <div class="name">{{ headerItem.name }}</div>
        <div class="value">{{ headerItem.value }}</div>
      </div>
    </div>
    <div class="flexRow present">
      <div class="flexColumn presentInfo">
        <div class="company">
          <el-card class="box-card">
            <div slot="header" class="flexRow cardHeader">
              <div>公司资质呈现</div>
              <div
                class="flexCenter export"
                v-if="$_hasOperation(routerCode, 'export')"
                @click="() => handleExport('company', '公司资质呈现')"
              >
                <span class="iconfont icon-daochu" />
              </div>
            </div>
            <div class="flexRow infoItem">
              <page-table
                ref="pageTable"
                col-align="left"
                :data="companyTableData"
                :cols="companyTableCols"
                :selection="false"
                :operator="false"
                :showPage="false"
                reserveSelection
              >
              </page-table>
            </div>
          </el-card>
        </div>
        <div class="person">
          <el-card class="box-card">
            <div slot="header" class="flexRow cardHeader">
              <div>人员资质呈现</div>
              <div
                class="flexCenter export"
                v-if="$_hasOperation(routerCode, 'export')"
                @click="() => handleExport('person', '人员资质呈现')"
              >
                <span class="iconfont icon-daochu" />
              </div>
            </div>
            <div class="flexRow infoItem">
              <page-table
                ref="pageTable"
                col-align="left"
                :data="personTableData"
                :cols="personTableCols"
                :selection="false"
                :operator="false"
                :showPage="false"
                reserveSelection
              >
              </page-table>
            </div>
          </el-card>
        </div>
      </div>
      <div class="tipInfo">
        <el-card class="box-card">
          <div slot="header" class="flexRow cardHeader">
            <div>资质有效提醒</div>
            <div
              class="flexCenter export"
              v-if="$_hasOperation(routerCode, 'export')"
              @click="() => handleExport('tips', '资质有效提醒')"
            >
              <span class="iconfont icon-daochu" />
            </div>
          </div>
          <div
            class="flexColumn infoItem"
            v-for="tipItem in tipItems"
            :key="tipItem.name + tipItem.id"
            :class="tipItem.status === '1' && 'warn'"
          >
            <div class="name">
              <span class="status">{{ statusTypes[tipItem.status] }}</span>
              <span class="nameDetail"
                >{{ tipItem.status === '0' ? '距离有效期还有' : '已过期' }}<span class="time">{{ tipItem.time }}</span
                >天，{{ tipItem.status === '0' ? '请及时处理' : '请重新申请' }}</span
              >
            </div>
            <FormItemText :layout="tipItem.tipFormItems" labelWidth="70px" />
          </div>
        </el-card>
      </div>
    </div>
    <div class="record">
      <el-card class="box-card">
        <div slot="header" class="flexRow cardHeader">
          <div>个人申请资质记录</div>
          <div class="flexCenter export" @click="() => handleExport('record', '个人申请资质记录')">
            <span class="iconfont icon-daochu" />
          </div>
        </div>
        <div class="flexRow infoItem">
          <page-table
            ref="pageTable"
            col-align="left"
            :data="recordTableData"
            :cols="recordTableCols"
            :selection="false"
            :operator="true"
            :showPage="false"
            reserveSelection
          >
            <template slot-scope="scope" slot="operator">
              <flex>
                <el-button
                  type="text"
                  size="small"
                  title="资质清单"
                  v-if="$_hasOperation(routerCode, 'list')"
                  @click.prevent.stop="
                    openDialog('list', {
                      row: scope.row,
                      type: 'hanlde',
                      configType: 'list',
                    })
                  "
                >
                  资质清单
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  title="下载"
                  v-if="$_hasOperation(routerCode, 'download')"
                  :disabled="!(`${scope.row.applyStatus}` === '1' && scope.row.downloadStatus === '0')"
                  :class="!(`${scope.row.applyStatus}` === '1' && scope.row.downloadStatus === '0') ? 'disables' : ''"
                  @click.prevent.stop="
                    openDialog('down', {
                      row: scope.row,
                      type: 'handle',
                      configType: 'down',
                    })
                  "
                >
                  下载
                </el-button>
              </flex>
            </template>
          </page-table>
        </div>
      </el-card>
    </div>
    <edit :show="editshow" :data="editdata" @cancel="closeEdit" @success="successEdit"></edit>
  </div>
</template>

<script>
import printJS from 'print-js';

import PageTable from '@/components/page-table';
import FormItemText from '@/components/formItemText';
import Flex from '@/components/flex';
import Edit from './Edit';
import { qualificationIconTypes, statusTypes } from './utils';
import { blobToImg, imgToCanvas, watermark, readPdf } from '@/util/util';
import {
  getOverview,
  exportCompanyQualification,
  exportPersonQualification,
  exportQualificationWarning,
  exportPersonApplyDetails,
  downloadPersonApplyDetails,
} from '@/api/qualificationManagement/qualificationOverview';
import { excelDownload } from '@/api/basicInformationManagement/excelImportList';
export default {
  name: 'qualificationOverview',
  inject: ['common'],
  data() {
    return {
      loading: false,
      statusTypes,
      headerCol: [
        {
          icon: 'icon-gongsizizhi',
          id: 'companyCount',
          name: '公司资质数',
          value: '',
        },
        {
          icon: 'icon-renyuanzizhi',
          id: 'personCount',
          name: '人员资质数',
          value: '',
        },
        {
          icon: 'icon-zhonglei',
          id: 'personTypeCount',
          name: '人员资质种类',
          value: '',
        },
        {
          icon: 'icon-xiazai2',
          id: 'downloadCount',
          name: '下载次数',
          value: '',
        },
      ],
      companyTableData: [],
      companyTableCols: [
        {
          label: '资质名称',
          prop: 'name',
        },
        {
          label: '资质等级',
          prop: 'level',
        },
        {
          label: '颁发机构',
          prop: 'issuingAuthority',
        },
      ],
      personTableData: [],
      personTableCols: [
        {
          label: '资质名称',
          prop: 'name',
        },
        {
          label: '资质等级',
          prop: 'level',
        },
        {
          label: '数量',
          prop: 'count',
        },
        {
          label: '颁发机构',
          prop: 'issuingAuthority',
        },
      ],
      tipItems: [],
      tipFormItems: [
        {
          id: 'qualificationType',
          label: '资质类型',
          value: '',
          span: 12,
        },
        {
          id: 'name',
          label: '资质名称',
          value: '',
          span: 12,
        },
        {
          id: 'level',
          label: '资质等级',
          value: '',
          span: 12,
        },
        {
          id: 'personName',
          label: '姓名',
          value: '',
          span: 12,
        },
        {
          id: 'validityDate',
          label: '有效日期',
          value: '',
          span: 12,
        },
        {
          id: 'issuingAuthority',
          label: '颁发机构',
          value: '',
          span: 12,
        },
      ],
      recordTableData: [],
      recordTableCols: [
        {
          label: '申请人',
          prop: 'applyPeople',
        },
        {
          label: '申请时间',
          prop: 'applyTime',
        },
        {
          label: '申请资质类型',
          prop: 'qualificationType',
          width: 150,
          render: (h, scope) => {
            const qualificationItem = this.common().qualificationType.filter(
              (status) => status.id === scope.row.qualificationType,
            );

            if (qualificationItem && qualificationItem[0]) {
              return (
                <div class="flexRow qualificationType">
                  <div class={`icon flexCenter class${qualificationItem[0].id}`}>
                    <div class={`iconfont ${qualificationIconTypes[qualificationItem[0].id]}`} />
                  </div>
                  <div>{qualificationItem[0].name}</div>
                </div>
              );
            }

            return '';
          },
        },
        {
          label: '申请资质名称',
          prop: 'name',
          width: 150,
        },
        {
          label: '用途',
          prop: 'use',
          width: 150,
          render: (h, scope) => {
            const useItem = this.common().useType.filter((status) => status.id === scope.row.use);

            return <div>{useItem && useItem[0] && useItem[0].name}</div>;
          },
        },
        {
          label: '审批状态',
          prop: 'applyStatus',
          width: 100,
          render: (h, scope) => {
            const applyItem = this.common().approvalStatus.filter((status) => status.id === `${scope.row.applyStatus}`);

            if (applyItem && applyItem[0]) {
              return (
                <div class={`flexRow applyStatus class${applyItem[0].id}`}>
                  <div>{applyItem[0].name}</div>
                </div>
              );
            }

            return '';
          },
        },
        {
          label: '下载状态',
          prop: 'downloadStatus',
          width: 100,
          render: (h, scope) => {
            const downStatusItem = this.common().downloadStatusType.filter(
              (status) => status.id === scope.row.downloadStatus,
            );

            if (downStatusItem && downStatusItem[0]) {
              return (
                <div class={`flexRow downloadStatus class${downStatusItem[0].id}`}>
                  <div class={'flexCenter icon'}>
                    <div class="iconfont icon-check" />
                  </div>
                  <div>{downStatusItem[0].name}</div>
                </div>
              );
            }

            return '';
          },
        },
      ],
      editshow: false,
      editdata: {},
    };
  },
  components: {
    PageTable,
    FormItemText,
    Flex,
    Edit,
  },
  mounted() {
    this.$nextTick(() => {
      this.onSearch();
    });
  },
  methods: {
    // 搜索
    onSearch(val) {
      this.getDataAllList();
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      this.loading = true;

      getOverview().then((res) => {
        if (res.code === '200' && res.data && Object.keys(res.data).length > 0) {
          const { data } = res;

          this.handleHeaderCol(data);
          this.companyTableData = data.qualificationOverviewCompanyDtoList;
          this.personTableData = data.qualificationOverviewPersonDtoList;
          this.handleTipItems(data.qualificationWarningInfoDtoList);
          this.recordTableData = data.qualificationDownloadInventoryList;
          this.loading = false;
        }
      });
    },
    handleHeaderCol(data) {
      this.headerCol = this.headerCol.map((col) => ({
        ...col,
        value: data[col.id],
      }));
    },
    handleTipItems(items) {
      this.tipItems = items.map((item) => {
        const tipFormItems = this.tipFormItems.map((formItem) => {
          let value = item[formItem.id];

          if (formItem.id === 'qualificationType') {
            const qualificationItem = this.common().qualificationType.filter((status) => status.id === value);

            value = qualificationItem && qualificationItem[0] && qualificationItem[0].name;
          }

          return {
            ...formItem,
            value,
          };
        });

        return {
          ...item,
          tipFormItems,
        };
      });
    },
    // 预览
    openDialog(state, info = {}) {
      if (state === 'down') {
        // [
        //   {
        //     fileCode: '26eb78c5df8a421883714d30bd147e23',
        //     fileName: '安全生产许可证.pdf',
        //     qualificationId: 59,
        //   },
        //   // {
        //   //   fileCode: 'aa6963c2626140deac0d7433e0472aaf',
        //   //   fileName: '第1页 - 副本.jpg',
        //   //   qualificationId: 8,
        //   // },
        // ].forEach((dataItem) => {
        //   this.handleDownExport(
        //     {
        //       ...info.row,
        //       ...dataItem,
        //     },
        //     dataItem.fileCode,
        //   );
        // });

        // return;
        downloadPersonApplyDetails(info.row.id).then((res) => {
          if (res && res.code === '200') {
            if (res.data.length > 0) {
              res.data.forEach((dataItem) => {
                this.handleDownExport(
                  {
                    ...info.row,
                    ...dataItem,
                  },
                  dataItem.fileCode,
                );
              });
            }
          }
        });

        return;
      }
      this.editshow = true;
      this.editdata = info;
    },
    handleDownExport(row, dataCode) {
      excelDownload(dataCode).then((res) => {
        const reader = new FileReader();

        reader.readAsText(res, 'utf-8');

        reader.onload = () => {
          // const result = JSON.parse(reader.result);
          // 处理报错信息 JSON.parse(reader.result)拿到报错信息
          console.log('reader.result', reader.result);
          if (reader.result.indexOf('下载发生异常') > -1) {
            this.$notifyError('下载发生异常，文件不存在，请联系管理员');
          } else {
            this.getResult(row, res);
          }
        };
      });
    },
    async getResult(row, res) {
      const { fileName } = row;

      if (fileName.indexOf('pdf') > -1) {
        const useItem = this.common().useType.filter((useType) => useType.id === row.use);

        readPdf(res, {
          name: row.name,
          center: useItem && useItem[0] && useItem[0].name,
          bottom: row.applyPeople,
        });
      } else {
        const blob = new Blob([res]);

        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          const img = await blobToImg(blob);

          const canvas = imgToCanvas(img);

          const useItem = this.common().useType.filter((useType) => useType.id === row.use);
          const waterBlob = await watermark(canvas, {
            center: useItem && useItem[0] && useItem[0].name,
            bottom: row.applyPeople,
          });

          const afterName = {
            'image/png': '.png',
            'image/jpeg': '.jpg',
            'application/pdf': '.pdf',
          }[waterBlob.type];
          const fileBoldName = `${row.name}.${afterName}`;
          const fileBlob = new Blob([waterBlob]);

          const link = document.createElement('a');

          link.href = URL.createObjectURL(fileBlob);
          link.download = fileBoldName;
          link.click();
          URL.revokeObjectURL(link.href);
        }
      }
    },
    // 导出
    handleExport(type, excelFileName) {
      const api = {
        company: exportCompanyQualification,
        person: exportPersonQualification,
        tips: exportQualificationWarning,
        record: exportPersonApplyDetails,
      }[type];

      api().then((res) => {
        // console.log('res', res);
        if (res) {
          const fileName = `${excelFileName}.xlsx`;
          const blob = new Blob([res], {
            type: 'application/vnd.ms-excel;charset=utf-8',
          });

          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName);
          } else {
            const link = document.createElement('a');

            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(link.href);
          }
        }
      });
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },
    successEdit() {
      this.closeEdit();
      this.onCurrentChange(1);
    },
  },
};
</script>

<style lang="less" scoped>
#qualificationOverview {
  height: auto;
  .record {
    /deep/.comp-page-table {
      min-height: auto !important;
    }
  }

  .header {
    justify-content: space-between;
    margin-bottom: 20px;
    .info {
      padding: 26px 20px;
      width: calc(25% - 15px);
      background: #ffffff;
      border-radius: 6px;
      box-shadow: 0px 3px 10px 0px rgba(199, 199, 199, 0.51);
      align-items: center;
      box-sizing: border-box;
      position: relative;
      .icon {
        width: 32px;
        height: 32px;
        background: #ffe4d1;
        border-radius: 50%;
        box-shadow: 0px 3px 10px 0px rgba(199, 199, 199, 0.51);
        margin-right: 12px;
        .iconfont {
          font-size: 16px;
          color: #f74322;
        }
      }
      .name {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #141414;
        line-height: 20px;
        text-shadow: 0px 3px 10px 0px rgba(199, 199, 199, 0.51);
      }
      .value {
        font-size: 24px;
        font-family: DINAlternate, DINAlternate-Bold;
        font-weight: 700;
        color: #141414;
        line-height: 28px;
        text-shadow: 0px 3px 10px 0px rgba(199, 199, 199, 0.51);
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  /deep/.box-card {
    .el-card__header {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #141414;
      line-height: 14px;
      .cardHeader {
        justify-content: space-between;
        align-items: center;
        .export {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #f7660d, #f00a00 100%);
          border-radius: 2px;
          cursor: pointer;
          .iconfont {
            font-size: 10px;
            color: #fff;
          }
        }
      }
    }
    .el-card__body {
      padding: 20px;
      height: calc(100% - 61px);
      box-sizing: border-box;
      .infoItem {
        width: 100%;
        height: 100%;
        #PageTable {
          width: 100%;
          min-height: 245px;
          padding: 0;
          margin: 0;
          border: none;
          box-shadow: none;
          overflow-y: auto;
          .el-table {
            border: none;
          }
          &::-webkit-scrollbar-track-piece {
            //滚动条凹槽的颜色，还可以设置边框属性
            background-color: transparent;
          }
          &::-webkit-scrollbar {
            //滚动条的宽度
            width: 4px;
            height: 4px;
            border-radius: 2px;
            margin-right: 2px;
            position: relative;
          }
          &::-webkit-scrollbar-thumb {
            //滚动条的设置
            background: #d5d5d5;
            background-clip: padding-box;
            min-height: 28px;
          }
          &::-webkit-scrollbar-thumb:hover {
            background-color: #d5d5d5;
          }
        }
      }
    }
  }
  .present {
    justify-content: space-between;
    margin-bottom: 20px;
    height: 715px;
    .presentInfo {
      width: calc(50% - 10px);
      > div {
        height: calc(50% - 10px);
        .box-card {
          height: 100%;
        }
      }
      .company {
        margin-bottom: 20px;
      }
    }
    .tipInfo {
      height: 100%;
      width: calc(50% - 10px);
      .el-card {
        height: 100%;
        /deep/.el-card__body {
          height: calc(100% - 100px);
          overflow-y: auto;
          .infoItem {
            height: auto;
          }
          &::-webkit-scrollbar-track-piece {
            //滚动条凹槽的颜色，还可以设置边框属性
            background-color: transparent;
          }
          &::-webkit-scrollbar {
            //滚动条的宽度
            width: 4px;
            height: 4px;
            border-radius: 2px;
            margin-right: 2px;
            position: relative;
          }
          &::-webkit-scrollbar-thumb {
            //滚动条的设置
            background: #d5d5d5;
            background-clip: padding-box;
            min-height: 28px;
          }
          &::-webkit-scrollbar-thumb:hover {
            background-color: #d5d5d5;
          }
        }
        .infoItem {
          margin-bottom: 15px;
          background: #fff7ec;
          border-radius: 4px;
          position: relative;
          padding: 20px 20px 10px;
          box-sizing: border-box;
          &::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 4px;
            border-radius: 4px;
            background: #ffb550;
          }
          .name {
            margin-bottom: 14px;
            .status {
              padding: 2px 8px;
              background: #fa8a00;
              border: 1px solid #fa8a00;
              border-radius: 2px;
              font-size: 12px;
              font-family: PingFangSC, PingFangSC-Regular;
              font-weight: 400;
              text-align: left;
              color: #ffffff;
              line-height: 20px;
              margin-right: 15px;
            }
            .nameDetail {
              font-size: 16px;
              font-family: PingFangSC, PingFangSC-Regular;
              font-weight: 400;
              text-align: left;
              color: #141414;
              line-height: 20px;
              .time {
                color: #fa8a00;
                margin: 0 5px;
              }
            }
          }
          /deep/#formItemText {
            .el-form-item__label,
            .el-form-item__content {
              line-height: 20px;
            }
            .valueItem {
              line-height: 20px;
              div {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          &.warn {
            background: #fff3ec;
            &::after {
              background: #ff8250;
            }
            .name {
              .status {
                background: #ef2d32;
                border: 1px solid #ef2d32;
              }
            }
            .nameDetail {
              .time {
                color: #ef2d32;
              }
            }
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
  .record {
    // height: 500px;
    margin-bottom: 20px;
    .el-card {
      height: 100%;
    }
    /deep/.qualificationType {
      align-items: center;
      .icon {
        width: 18px;
        height: 18px;
        background: rgba(62, 129, 222, 0.2);
        border-radius: 50%;
        margin-right: 5px;
        .iconfont {
          font-size: 10px;
          color: #3e81de;
        }
        &.class1 {
          background: rgba(255, 129, 65, 0.2);
          .iconfont {
            color: #ff8141;
          }
        }
      }
    }
    /deep/.downloadStatus {
      color: #3e81de;
      align-items: center;
      .icon {
        width: 12px;
        height: 12px;
        background: #ffffff;
        border: 2px solid rgba(62, 129, 222, 0.34);
        border-radius: 50%;
        margin-right: 5px;
        .iconfont {
          color: #fff;
          font-size: 1px; /*no*/
          font-weight: normal;
        }
      }
      &.class1 {
        color: #02aa69;
        .icon {
          background: #02aa69;
          border: 2px solid #02aa69;
          border-radius: 50%;
        }
      }
    }
    /deep/.applyStatus {
      background: rgba(62, 129, 222, 0.08);
      border: 1px solid #3e81de;
      border-radius: 2px;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #3e81de;
      padding: 6px;
      display: inline-block;
      &.class1 {
        border: 1px solid #02aa69;
        color: #02aa69;
      }
      &.class2 {
        border: 1px solid #ef2d32;
        color: #ef2d32;
      }
    }
  }
}
</style>
