<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    appendToBody
    :title="`${title}`"
    width="1250px"
    :visible.sync="dialogShow"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <div class="projectBatch">
        <span class="add-btn" @click="openDialog('projectBatch', 'add', {})">新增</span>
        <wrapper :key="'projectBatch'" :title="projectBatchTitle" :isFold="false">
          <div class="card-list scrollView">
            <div class="card-box" v-for="(item, index) in projectBatch" :key="index">
              <div class="card-head">
                <em class="iconfont icon-caiwu1" />
                <span>发票批次</span>
                <span>{{ item.batchId }}</span>
              </div>
              <div class="card-body">
                <div class="card-li">
                  <span>发票类型：</span>
                  <span>{{ item.invoiceTypeHtml }}</span>
                </div>
                <div class="card-li">
                  <span>ERP编号：</span>
                  <span>{{ item.erpNumber }}</span>
                </div>
                <div class="card-li">
                  <span>合作合同：</span>
                  <span>{{ item.contractNo }}</span>
                </div>
                <div class="card-li">
                  <span>开发票单位：</span>
                  <span>{{ item.invoiceUnit }}</span>
                </div>
                <div class="card-li">
                  <span>本批次不含税金额：</span>
                  <span>{{ item.totalTaxFreeAmount }}</span>
                </div>
                <div class="card-li">
                  <span>税率：</span>
                  <span>{{ item.taxRateDefaultHtml }}</span>
                </div>
                <div class="card-li">
                  <span>本批次税额：</span>
                  <span>{{ item.totalTaxAmount }}</span>
                </div>
                <div class="card-li">
                  <span>本批次含税价：</span>
                  <span>{{ item.totalTaxPriceAmount }}</span>
                </div>
                <div class="card-li">
                  <span>本批次发票备注说明：</span>
                  <span>{{ item.remark }}</span>
                </div>
              </div>
              <div class="card-footer">
                <span class="edit-btn btn" @click="openDialog('projectBatch', 'edit', item, index)">编辑</span>
                <span class="delete-btn btn" @click="handleDelete(index, 'projectBatch')">删除</span>
              </div>
            </div>
          </div>
        </wrapper>
      </div>
      <div class="invoiceBatch">
        <span class="add-btn" @click="openDialog('invoiceBatch', 'add', {})" v-if="projectBatch.length">新增</span>
        <wrapper :key="'invoiceBatch'" :title="invoiceBatchTitle" :isFold="false">
          <div class="card-list scrollView">
            <div class="card-box" v-for="(item, index) in invoiceBatch" :key="index">
              <div class="card-head">
                <em class="iconfont icon-caiwu1" />
                <span>发票批次</span>
                <span>{{ item.batchId }}</span>
              </div>
              <div class="card-body">
                <div class="card-li">
                  <span>虚拟发票：</span>
                  <span>{{ item.virtualTypeHtml }}</span>
                </div>
                <div class="card-li">
                  <span>开票日期：</span>
                  <span>{{ item.invoiceDate }}</span>
                </div>
                <div class="card-li">
                  <span>分包发票代码：</span>
                  <span>{{ item.invoiceCode }}</span>
                </div>
                <div class="card-li">
                  <span>分包发票号码：</span>
                  <span>{{ item.invoiceNumber }}</span>
                </div>
                <div class="card-li">
                  <span>本章发票不含税金：</span>
                  <span>{{ item.taxFreeAmount }}</span>
                </div>
                <div class="card-li">
                  <span>本章发票税额：</span>
                  <span>{{ item.taxAmount }}</span>
                </div>
                <div class="card-li">
                  <span>本章发票含税价：</span>
                  <span>{{ item.taxPriceAmount }}</span>
                </div>
              </div>
              <div class="card-footer">
                <span class="edit-btn btn" @click="openDialog('invoiceBatch', 'edit', item, index)">编辑</span>
                <span class="delete-btn btn" @click="handleDelete(index, 'invoiceBatch')">删除</span>
              </div>
            </div>
          </div>
        </wrapper>
      </div>
    </div>
    <edit :show="editshow" :data="editdata" :title="editTitle" @cancel="closeEdit" @success="successEdit" />
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import Wrapper from '@/components/wrapper';
import Edit from './Edit';
import moment from 'moment';
import { subpackageBatchAdd } from '@/api/financePay/common';
export default {
  name: 'cooperationInvoiceAdd',
  components: {
    dialogCont,
    Wrapper,
    Edit,
  },
  props: {
    data: {},
    show: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['common'],
  data() {
    return {
      scrollHeight: 'auto',
      title: '合作发票新增',
      projectBatchTitle: '项目批次信息(本批次含税价总价: 0元)',
      invoiceBatchTitle: '发票批次信息(本章发票含税价总价: 0元)',
      editshow: false,
      editdata: {},
      editTitle: '',
      projectBatch: [],
      invoiceBatch: [],
      batchId: '',
      projectBatchTotalPrice: 0,
      invoiceBatchTotalPrice: 0,
    };
  },
  computed: {
    dialogShow: {
      get() {
        return this.show;
      },
      set(v) {
        console.log('set');
      },
    },
  },
  methods: {
    openedit() {
      console.log('openedit');
      this.init();
    },

    closeedit() {
      this.canceledit();
    },
    canceledit(type) {
      this.$emit('cancel', type);
    },
    confirmedit() {
      if (!this.projectBatch.length) {
        this.$notify({
          title: '失败',
          message: '请新增项目批次信息',
          type: 'error',
          position: 'bottom-right',
        });

        return;
      }
      if (!this.invoiceBatch.length) {
        this.$notify({
          title: '失败',
          message: '请新增发票批次信息',
          type: 'error',
          position: 'bottom-right',
        });

        return;
      }
      if (this.projectBatchTotalPrice !== this.invoiceBatchTotalPrice) {
        this.$notify({
          title: '失败',
          message: '本批次含税价总价 要等于 本章发票含税价总价',
          type: 'error',
          position: 'bottom-right',
        });

        return;
      }
      const params = {
        subpackageActualList: this.invoiceBatch,
        subpackageBatchList: this.projectBatch,
      };

      console.log(params);
      subpackageBatchAdd(params).then((res) => {
        if (res.code === '200') {
          this.closeedit();
          this.$emit('success');
        }
      });
    },
    successSubmit() {
      this.closeedit();
      this.$emit('success');
    },

    // 预览
    openDialog(state, type, row, index = 0) {
      const typeTitle = type === 'add' ? '新增' : '编辑';
      const title = {
        projectBatch: `${typeTitle}项目批次信息`,
        invoiceBatch: `${typeTitle}发票批次信息`,
      };

      this.editTitle = title[state];
      this.editshow = true;
      this.editdata = {
        row,
        type,
        index,
        configType: state,
      };
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },

    successEdit(params = {}) {
      this.editshow = false;
      console.log(params);
      if (params.configType === 'projectBatch') {
        this.projectBatchSuccessEdit(params);
      } else {
        this.invoiceBatchSuccessEdit(params);
      }
    },

    init() {
      const data = moment(new Date()).format('YYYYMMDD');
      const random = Math.round(Math.random() * 999999 + 1);

      this.batchId = data + random;
      this.projectBatchTotalPrice = 0;
      this.invoiceBatchTotalPrice = 0;
      this.projectBatch = [];
      this.invoiceBatch = [];
      this.getProjectBatchTotalPrice();
      this.getInvoiceBatchTotalPrice();
    },
    handleDelete(index, type) {
      if (type === 'projectBatch') {
        this.projectBatch.splice(index, 1);
        this.getProjectBatchTotalPrice();
      } else {
        this.invoiceBatch.splice(index, 1);
        this.getInvoiceBatchTotalPrice();
      }
    },
    getProjectBatchTotalPrice() {
      this.projectBatchTotalPrice = 0;
      this.projectBatch.map((ele) => {
        this.projectBatchTotalPrice += ele.totalTaxPriceAmount;
      });
      this.projectBatchTitle = `项目批次信息(本批次含税价总价: ${this.projectBatchTotalPrice}元)`;
    },
    getInvoiceBatchTotalPrice() {
      this.invoiceBatchTotalPrice = 0;
      this.invoiceBatch.map((ele) => {
        this.invoiceBatchTotalPrice += ele.taxPriceAmount;
      });
      this.invoiceBatchTitle = `发票批次信息(本章发票含税价总价: ${this.invoiceBatchTotalPrice}元)`;
    },
    projectBatchSuccessEdit(params) {
      if (params.type === 'add') {
        this.projectBatch.push({
          batchId: this.batchId,
          ...params,
        });
      } else {
        this.projectBatch[params.index] = {
          batchId: this.batchId,
          ...params,
        };
      }
      this.getProjectBatchTotalPrice();
    },
    invoiceBatchSuccessEdit(params) {
      if (params.type === 'add') {
        this.invoiceBatch.push({
          batchId: this.batchId,
          ...params,
        });
      } else {
        this.invoiceBatch[params.index] = {
          batchId: this.batchId,
          ...params,
        };
      }
      this.getInvoiceBatchTotalPrice();
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~'>>>';

@{deep}.el-dialog__body {
  padding-right: 4px;
}

.scrollView {
  overflow: hidden;
  overflow-y: auto;
  padding-right: 10px;
  // 重写滚动条样式
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

.projectBatch,
.invoiceBatch {
  position: relative;
  min-height: 70px;
  background: #fff;
  margin-bottom: 18px;
  padding: 8px;
  box-shadow: 0px 2px 4px 0px rgba(226, 226, 226, 0.5);
  border: 1px solid;
  border-image: linear-gradient(180deg, rgba(221, 221, 221, 1), rgba(213, 213, 213, 1)) 1 1;
  /deep/ .comp-wrapper-header {
    margin-bottom: 0;
  }
  .add-btn {
    display: inline-block;
    padding: 3px 12px;
    color: #fff;
    background: linear-gradient(135deg, #f7660d 5%, #f00a00 100%);
    margin-bottom: 8px;
    cursor: pointer;
    position: absolute;
    right: 18px;
    top: 14px;
    z-index: 10;
    border-radius: 4px;
  }
  .card-list {
    display: flex;
    flex-wrap: wrap;
    max-height: 368px;
    overflow-y: auto;
    .card-box {
      border: 1px solid #eee;
      box-shadow: 1px 3px 9px 0 rgba(87, 87, 87, 0.1);
      border-radius: 5px;
      overflow: hidden;
      font-size: 14px;
      width: 24%;
      margin: 8px 8px 0 0;
      .iconfont {
        font-size: 26px;
      }
      .card-head {
        color: #424242;
        font-size: 14px;
        height: 40px;
        display: flex;
        align-items: center;
        font-weight: bold;
        background: #f5f5f5;
        padding: 0 10px;
      }
      .card-body {
        padding: 0 10px;
        .card-li {
          height: 30px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #d4ceca;
          &:last-child {
            border-bottom: none;
          }
        }
      }
      .card-footer {
        padding: 5px 0;
        text-align: right;
        .btn {
          padding: 3px 5px;
          color: #fff;
          border-radius: 4px;
          display: inline-block;
          cursor: pointer;
          &.edit-btn {
            background: #367fa9;
            margin-right: 5px;
          }
          &.delete-btn {
            background: #f78989;
          }
        }
      }
    }
  }
}
</style>
