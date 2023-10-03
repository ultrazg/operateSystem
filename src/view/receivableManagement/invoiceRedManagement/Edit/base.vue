<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      labelWidth="130px"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    >
      <!-- 红冲发票 -->
      <template slot="receivableEnter">
        <otherBtnList v-if="data.configType !== 'detail' && form.receivableBatchId">
          <ul class="flexRow">
            <li
              v-for="(item, index) in receivableEnterBtnLists"
              :key="index"
              class="flexCenter"
              @click="
                () => {
                  item.click();
                }
              "
            >
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </otherBtnList>
        <page-table
          ref="receivableEnterTable"
          col-align="left"
          :data="receivableEnterData"
          :cols="receivableEnterCols"
          :selection="false"
          :operator="data.configType !== 'detail'"
          :showPage="false"
          :expand="false"
          operator-width="110"
          :hideDefaultIndex="true"
          reserveSelection
        >
          <template slot-scope="scope" slot="expand">
            <div class="expandInfo">
              <page-table
                class="childPageTable"
                ref="childPageTable"
                col-align="left"
                :showPage="false"
                :selection="false"
                :operator="false"
                :row-key="getRowKey"
                :data="receivableEnterData[scope.index].expandTableData"
                :cols="expandTableCols"
              >
              </page-table>
            </div>
          </template>
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="编辑"
                icon="iconfont icon-bianji"
                v-if="!scope.row.editRow"
                @click.prevent.stop="
                  tableAction('edit', {
                    index: scope.index,
                    data: scope.row,
                  })
                "
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                title="保存"
                v-if="scope.row.editRow"
                icon="iconfont icon-baocun1"
                @click.prevent.stop="
                  tableAction('save', {
                    index: scope.index,
                    data: scope.row,
                  })
                "
              >
                保存
              </el-button>
              <el-button
                type="text"
                size="small"
                title="删除"
                icon="iconfont icon-shanchu"
                @click.prevent.stop="
                  tableAction('del', {
                    index: scope.index,
                    data: scope.row,
                  })
                "
              >
                删除
              </el-button>
            </flex>
          </template>
        </page-table>
      </template>
    </FormItem>
    <invoiceRedProject
      :show="erqNumberShow"
      :data="erqNumberData"
      @cancel="closeErqNumber"
      @success="successErqNumber"
    />
    <invoiceRed :show="invoiceRedShow" :data="invoiceRedData" @cancel="closeInvoiceRed" @success="successInvoiceRed" />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import otherBtnList from '@/components/headerTitle/otherBtnList';
import invoiceRedProject from '@/view/common/receivableManagement/invoiceRedProject';
import invoiceRed from '@/view/common/receivableManagement/invoiceRed';
import { detail, add, update } from '@/api/receivableManagement/invoiceRedManagement';
export default {
  name: 'baseInfo',
  components: {
    FormItem,
    PageTable,
    Flex,
    otherBtnList,
    invoiceRedProject,
    invoiceRed,
  },
  props: {
    show: Boolean,
    data: {},
  },
  inject: ['common'],
  data() {
    const { configType } = this.data;

    return {
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {},
      layout: [
        {
          title: '发票批次信息',
          formItems: [
            {
              label: '应收发票批次',
              prop: 'receivableBatchId',
              inputType: 'input',
              span: 12,
              onFocus: () => {
                this.invoiceRedData = {
                  ...this.data,
                  ...this.form,
                };
                this.invoiceRedShow = true;
              },
            },
            {
              label: '应收发票批次名称',
              prop: 'receivableBatchName',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '委托方',
              prop: 'consignor',
              inputType: 'select',
              span: 12,
              options: this.common().constructionCode,
            },
            {
              label: '识别码',
              prop: 'identificationCode',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '发票类型',
              prop: 'invoiceType',
              inputType: 'select',
              span: 12,
              options: this.common().invoiceType,
            },
            {
              label: '项目种类',
              prop: 'projectType',
              inputType: 'select',
              span: 12,
              options: this.common().projectType,
            },
            {
              label: '实际分配金额(含税)',
              prop: 'distributionAmountTax',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '实际分配金额(不含税)',
              prop: 'distributionAmountNoTax',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '税额',
              prop: 'taxAmount',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
          ],
        },
        {
          title: '红冲发票录入',
          render: 'receivableEnter',
          formItems: [],
        },
      ],
      formRules: {
        receivableBatchId: {
          required: true,
          message: '请选择应收发票批次',
          trigger: 'blur',
        },
      },
      receivableEnterBtnLists: [
        {
          label: '新增',
          click: () => this.addHeceivableEnter(),
        },
      ],
      editRow: false,
      receivableEnterData: [],
      receivableEnterCols: [
        {
          label: '应收发票代码',
          prop: 'receivableInvoiceCode',
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.receivableInvoiceCode;

            if (d.editRow) {
              html = (
                <el-select
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onChange={(val) => {
                    this.changeSelect(val, scope.$index, scope.column.property);
                  }}
                >
                  {d.receivableNumberDtoList &&
                    d.receivableNumberDtoList.map((data) => (
                      <el-option label={data.receivableInvoiceCode} value={data.receivableInvoiceCode}></el-option>
                    ))}
                </el-select>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '应收发票号码',
          prop: 'receivableInvoiceNumber',
          align: 'center',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          width: 120,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.erpNumber;

            if (d.editRow) {
              html = (
                <el-select
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onChange={(val) => {
                    this.changeSelect(val, scope.$index, scope.column.property);
                  }}
                >
                  {isJudge.map((data) => (
                    <el-option label={data.name} value={data.id}></el-option>
                  ))}
                </el-select>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '商品种类',
          prop: 'goodsType',
        },
        {
          label: '种类描述',
          prop: 'typeDescribe',
        },
        {
          label: '承揽订单',
          prop: 'orderId',
        },
        {
          label: '合作合同名称',
          prop: '.contractName',
        },
        {
          label: '费用类型',
          prop: 'costType',
        },
        {
          label: '分包发票代码',
          prop: 'invoiceCode',
        },
        {
          label: '分包发票号码',
          prop: 'invoiceNumber',
        },
        {
          label: '发票金额(含税)',
          prop: 'distributeAmount',
        },
        {
          label: '分配金额',
          prop: 'unitName',
        },
        {
          label: '合作比例',
          prop: 'cooperationRatio',
        },
        {
          label: '对应总包金额',
          prop: 'correspondingTotalAmount',
        },
        {
          label: '实际分配金额(含税)',
          prop: 'receivableDistributeAmount',
        },
      ],
      erqNumberShow: false,
      erqNumberData: {},
      invoiceRedShow: false,
      invoiceRedData: {},
      invoiceRedTable: {},
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  watch: {
    data(val) {
      // this.data = val;
      this.inputDisabled = val.configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
  },
  methods: {
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        detail(row.id).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              ...res.data,
            };
          }
        });
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const message = configType === 'add' ? '新增成功' : '修改成功';

      if (this.receivableEnterData.length === 0) {
        this.$notifyError('请在红冲发票下先绑定对应的项目信息');

        return;
      }
      let param = {
        ...val,
      };

      let api = add;

      if (configType !== 'add') {
        api = update;
        param = {
          ...param,
          id: this.form.id,
        };
      }

      api(param).then((res) => {
        if (res && res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right',
          });
          this.$emit('success');
        }
      });
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
    addHeceivableEnter() {
      if (this.editRow) {
        this.$notifyError('请先保存当前新增行数据再进行添加操作');

        return;
      }
      // this.editRow = true;
      // const list = {
      //   editRow: this.editRow,
      // };

      // this.receivableEnterData.push(list);
      // this.receivableEnterData.splice(1, 0);
      this.erqNumberShow = true;
      this.erqNumberData = {
        batchId: this.form.receivableBatchId,
      };
    },
    getRowKey(row) {
      return row.id;
    },
    // 输入框改变
    changeInput(val, index, name) {
      this.receivableEnterData[index] = {
        ...this.receivableEnterData[index],
        [name]: val,
      };

      this.receivableEnterData.splice(1, 0);
    },
    // 下拉框改变
    changeSelect(val, index, name, idName) {
      const item = this.receivableEnterData.map((data, i) => {
        if (i === index) {
          let addObj = {};

          if (idName && val instanceof Object) {
            addObj = {
              [idName]: val.id,
            };
          }
          if (name === 'receivableInvoiceCode') {
            const options = data.receivableNumberDtoList;
            const findItem = options.filter((option) => option.receivableInvoiceCode === val);
            const receivableInvoiceNumber = findItem && findItem[0] && findItem[0].receivableInvoiceNumber;

            addObj = {
              ...addObj,
              receivableInvoiceNumber,
            };
          }

          return {
            ...data,
            [name]: val instanceof Object ? val.name : val,
            ...addObj,
          };
        }

        return data;
      });

      this.receivableEnterData = item;
    },
    // 操作表单
    tableAction(type, row) {
      const { index, id } = row;

      if (type === 'edit') {
        this.receivableEnterData[index] = {
          ...this.receivableEnterData[index],
          editRow: true,
        };
        this.editRow = true;
        this.receivableEnterData.splice(1, 0);
      }
      if (type === 'save') {
        const { fictitiousInvoice, invoiceType, createTime, invoiceCode } = this.receivableEnterData[index];

        if (!fictitiousInvoice || !invoiceType || !createTime || !invoiceCode) {
          this.$notifyError('请先完整输入信息:ERP编号、应收发票代码');

          return;
        }
        this.receivableEnterData[index] = {
          ...this.receivableEnterData[index],
          editRow: false,
        };
        this.editRow = false;
        this.receivableEnterData.splice(1, 0);
      }
      if (type === 'del') {
        if (id) {
          this.$notifyError('该数据不可删除');

          return;
        }
        this.receivableEnterData.splice(index, 1);
        this.editRow = false;
      }
    },
    closeErqNumber() {
      this.erqNumberShow = false;
      this.erqNumberData = {};
    },
    successErqNumber(erqNumberTable) {
      this.receivableEnterData.push({
        ...erqNumberTable,
        editRow: true,
      });
      this.$nextTick(() => {
        this.closeErqNumber();
      });
    },
    closeInvoiceRed() {
      this.invoiceRedShow = false;
      this.invoiceRedData = {};
    },
    successInvoiceRed(invoiceRedTable) {
      this.invoiceRedTable = invoiceRedTable;
      this.form = {
        ...this.form,
        ...invoiceRedTable,
      };
      this.$nextTick(() => {
        this.closeInvoiceRed();
      });
    },
  },
  created() {
    if (this.isAdd === false) {
      this.reqDetail();
    }
  },
};
</script>

<style lang="less" scoped>
#base {
  #PageTable {
    min-height: auto;
  }
  .comp-wrapper {
    #otherBtnList {
      margin-bottom: 10px;
    }
  }
  /deep/.comp-page-table {
    min-height: auto;
    td {
      &.el-table__expanded-cell {
        padding-left: 48px;
        padding-top: 0;
        padding-bottom: 0;
        border-right: none;
      }
    }
    &.childPageTable {
      padding: 0;
      border: 1px solid #fce8e0;
      border-top: none;
      border-right: none;
      border-bottom: none;
      margin-bottom: 0;
      th {
        background: #fff2ed;
        border-color: #fce8e0;
      }
      tbody {
        tr {
          td {
            border-color: #fce8e0;
          }
          &:nth-of-type(2n) {
            background: #fffbfa;
          }
        }
      }
    }
    .expandInfo {
      .addRow {
        height: 36px;
        background: #ffffff;
        border: 1px solid #fce8e0;
        cursor: pointer;
        .iconfont {
          font-size: 10px;
          color: #f14d51;
          margin-right: 10px;
        }
        .text {
          font-size: 12px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #ef2d32;
        }
      }
    }
  }
}
</style>
