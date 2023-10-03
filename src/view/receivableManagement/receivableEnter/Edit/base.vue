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
      <!-- 发票录入 -->
      <template slot="receivableEnter">
        <otherBtnList v-if="btnShow">
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
          :expand="true"
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
                :data="[receivableEnterData[scope.index]]"
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
      <template slot="invoiceTable">
        <page-table
          ref="pageTable"
          col-align="left"
          :showPage="false"
          :operator="false"
          :row-key="getRowKey"
          :data="invoiceTableData"
          :cols="invoiceTableCols"
        >
        </page-table>
      </template>
    </FormItem>
    <subpackageInvoice
      :show="erqNumberShow"
      :data="erqNumberData"
      :highlightCurrentRow="false"
      @cancel="closeErqNumber"
      @success="successErqNumber"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import otherBtnList from '@/components/headerTitle/otherBtnList';
import subpackageInvoice from '@/view/common/receivableManagement/subpackageInvoice';
import { detail, add, update } from '@/api/receivableManagement/receivableEnter';
export default {
  name: 'baseInfo',
  components: {
    FormItem,
    PageTable,
    Flex,
    otherBtnList,
    subpackageInvoice,
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
              prop: 'batchId',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '应收发票批次名称',
              prop: 'name',
              inputType: 'input',
              span: 12,
            },
            {
              label: '建设主体',
              prop: 'subject',
              inputType: 'select',
              disabled: true,
              span: 12,
              options: this.common().subjectCode,
            },
            {
              label: '委托方',
              prop: 'consignor',
              inputType: 'select',
              span: 12,
              options: this.common().constructionCode,
              onChange: (val) => {
                const options = this.common().constructionCode;
                const findItem = options.filter((option) => option.id === val);

                this.form = {
                  ...this.form,
                  consignor: val,
                  identificationCode: findItem[0].id,
                };
              },
            },
            {
              label: '识别码',
              prop: 'identificationCode',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '支付方式',
              prop: 'payType',
              inputType: 'select',
              span: 12,
              options: this.common().paymentType,
            },
            {
              label: '项目种类',
              prop: 'projectType',
              inputType: 'select',
              span: 12,
              options: this.common().projectType,
              onChange: (val) => {
                this.changeProjectType(val);
              },
            },
            {
              label: '成本类型',
              prop: 'costType',
              inputType: 'select',
              span: 12,
              hide: true,
              options: this.common().instionFeeType,
            },
            {
              label: '发票类型',
              prop: 'invoiceType',
              inputType: 'select',
              span: 12,
              options: this.common().invoiceType,
            },

            {
              label: '实际分配金额(含税)',
              prop: 'distributeAmount',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '税率',
              prop: 'rate',
              inputType: 'input',
              disabled: true,
              span: 12,
              options: this.common().taxRateCode,
            },
            {
              label: '税额',
              prop: 'taxAmount',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '实际分配金额(不含税)',
              prop: 'actualDistributeAmount',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
          ],
        },
        {
          title: '应收发票录入',
          render: 'receivableEnter',
          formItems: [],
        },
        {
          title: '回填信息',
          render: 'invoiceTable',
          hide: true,
          formItems: [],
        },
      ],
      formRules: {
        name: {
          required: true,
          message: '请输入应收发票批次名称',
          trigger: 'blur',
        },
        consignor: {
          required: true,
          message: '请选择委托方',
          trigger: 'blur',
        },
        invoiceType: {
          required: true,
          message: '请选择发票类型',
          trigger: 'blur',
        },
        projectType: {
          required: true,
          message: '请选择项目种类',
          trigger: 'blur',
        },
        payType: {
          required: true,
          message: '请选择支付方式',
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
          label: '商品种类',
          prop: 'goodsType',
          width: 120,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            return (
              <div>
                {
                  <el-select
                    class="editInput"
                    disabled={!d.editRow}
                    value={scope.row[scope.column.property] || ''}
                    onChange={(val) => {
                      this.changeSelect(val, scope.$index, scope.column.property);
                    }}
                  >
                    {this.common().goodsType.map((data) => (
                      <el-option label={data.name} value={data.id}></el-option>
                    ))}
                  </el-select>
                }
              </div>
            );
          },
        },
        {
          label: '种类描述',
          prop: 'typeDescribe',
          width: 120,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.typeDescribe;

            if (d.editRow) {
              html = (
                <el-input
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changeInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          width: 120,
          align: 'center',
          render: (h, scope) => {
            const html = scope.row.erpNumber;

            return <div>{html}</div>;
          },
        },
        {
          label: '承揽订单',
          prop: 'orderId',
        },
        {
          label: '承揽订单金额',
          prop: 'contractAmount',
          width: 100,
        },
        {
          label: '合作比例',
          prop: 'ratio',
        },
        {
          label: '对应总包金额',
          width: 120,
          prop: 'totalContractAmount',
        },
        {
          label: '总包已分配金额',
          prop: 'totalDistributedAmount',
          width: 120,
        },
        {
          label: '总包剩余分配金额',
          prop: 'remainderDistributeAmount',
          width: 120,
        },
        {
          label: '实际分配金额(含税)',
          prop: 'distributeAmount',
          width: 140,
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.distributeAmount;

            if (d.editRow) {
              html = (
                <el-input-number
                  class="editInput"
                  precision={2}
                  controls={false}
                  value={scope.row[scope.column.property] || undefined}
                  onInput={(val) => {
                    this.changeInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input-number>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '税率(%)',
          prop: 'rate',
        },
        {
          label: '实际分配金额(不含税)',
          prop: 'actualDistributeAmount',
          width: 120,
        },
        {
          label: '税额',
          prop: 'taxAmount',
        },
        {
          label: '分包发票代码',
          prop: 'invoiceCode',
          width: 120,
        },
      ],
      invoiceTableData: [],
      invoiceTableCols: [
        {
          label: '应收发票代码',
          prop: 'invoiceCode',
          render: (h, scope) => {
            const d = scope.row;
            const html = scope.row.invoiceCode;

            return <div>{html}</div>;
          },
        },
        {
          label: '应收发票号码',
          prop: 'invoiceNumber',
          width: '120px',
          render: (h, scope) => {
            const d = scope.row;

            const html = scope.row.invoiceNumber;

            return <div>{html}</div>;
          },
        },
        {
          label: '开票日期',
          prop: 'createTime',
          render: (h, scope) => {
            const d = scope.row;
            const html = scope.row.createTime;

            return <div>{html}</div>;
          },
        },
        {
          label: '发票金额(含税)',
          prop: 'invoiceAmount',
          render: (h, scope) => {
            const d = scope.row;

            const html = scope.row.invoiceAmount;

            return <div>{html}</div>;
          },
        },
        {
          label: '税率(%)',
          prop: 'invoiceRate',
          render: (h, scope) => {
            const d = scope.row;
            const { taxRateCode } = this.common();
            const rateItem = taxRateCode.filter((code) => code.code === d.invoiceRate);

            const html = rateItem && rateItem[0] && rateItem[0].name;

            return <div>{html}</div>;
          },
        },
        {
          label: '发票金额(不含税)',
          prop: 'noTaxInvoiceAmount',
        },
        {
          label: '发票类型',
          prop: 'invoiceType',
          render: (h, scope) => {
            const d = scope.row;

            const { invoiceType } = this.common();
            const invoiceItem = invoiceType.filter((code) => code.id === d.invoiceType);

            const html = invoiceItem && invoiceItem[0] && invoiceItem[0].name;

            return <div>{html}</div>;
          },
        },
        {
          label: '发票状态',
          prop: 'redState',
        },
      ],
      expandTableCols: [
        {
          label: '分包发票号码',
          prop: 'invoiceNumber',
        },
        {
          label: '发票类型',
          prop: 'invoiceType',
          render: (h, scope) => {
            const d = scope.row;

            const { invoiceType } = this.common();
            const invoiceItem = invoiceType.filter((code) => code.id === d.invoiceType);

            const html = invoiceItem && invoiceItem[0] && invoiceItem[0].name;

            return <div>{html}</div>;
          },
        },
        {
          label: '开票日期',
          prop: 'createDate',
        },
        {
          label: '发票金额(不含税)',
          prop: 'actualInvoiceAmount',
        },
        {
          label: '税率(%)',
          prop: 'rate',
        },
        {
          label: '发票税额',
          prop: 'taxAmount',
        },
        {
          label: '发票金额(含税)',
          prop: 'invoiceAmount',
        },
        {
          label: '合作合同名称',
          prop: 'contractName',
        },
        {
          label: '站点名称',
          prop: 'stationName',
          hide: true,
        },
        {
          label: '站点类型',
          prop: 'stationType',
          hide: true,
        },
        {
          label: '费用类型',
          prop: 'amountType',
        },
        {
          label: '分配金额',
          prop: 'distributedAmount',
        },
      ],
      erqNumberShow: false,
      erqNumberData: {},
      erqNumberIndex: -1,
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  computed: {
    btnShow() {
      let show = false;

      if (this.data.configType !== 'detail') {
        show = true;
      }
      if (this.form.projectType === '3') {
        show = this.form.projectType && this.form.consignor && this.form.costType;
      } else {
        show = this.form.consignor;
      }

      return show;
    },
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
              ...res.data.receivableInvoiceBatchDTO,
            };
            this.changeProjectType(row.projectType);
            this.receivableEnterData = res.data.receivableWithCooperationInvoiceDTOList;
            if (
              this.inputDisabled &&
              res.data.receivableInvoiceBackfillDTO &&
              res.data.receivableInvoiceBackfillDTO.length > 0
            ) {
              this.layout[2].hide = false;
              this.invoiceTableData = res.data.receivableInvoiceBackfillDTO;
            }
          }
        });
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType } = this.data;
      // const id = configType === 'add' ? '' : this.form.id;
      const message = configType === 'add' ? '新增成功' : '修改成功';

      if (this.receivableEnterData.length === 0) {
        this.$notifyError('请先在应收发票录入下绑定对应的分包发票！');

        return;
      }
      let param = {
        receivableInvoiceBatchDTO: {
          ...val,
        },
        receivableWithCooperationInvoiceDTOList: this.receivableEnterData,
      };

      let api = add;

      if (configType !== 'add') {
        api = update;
        param = {
          ...param,
          receivableInvoiceBatchDTO: {
            ...param.receivableInvoiceBatchDTO,
            id: this.form.id,
          },
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
    // 更改项目种类
    changeProjectType(projectType) {
      // 小站类型
      if (projectType === '3') {
        this.layout[0].formItems[7].hide = false;
        this.expandTableCols[9].hide = false;
        this.expandTableCols[10].hide = false;
      } else {
        this.layout[0].formItems[7].hide = true;
        this.expandTableCols[9].hide = true;
        this.expandTableCols[10].hide = true;
        this.form = {
          ...this.form,
          costType: null,
        };
      }
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
      this.erqNumberIndex = -1;
      this.erqNumberShow = true;
      this.erqNumberData = {
        consignor: this.form.consignor,
        projectType: this.form.projectType,
        costType: this.form.costType,
      };
      if (this.$refs.receivableEnterTable) {
        this.$refs.receivableEnterTable.onRowChange(this.receivableEnterData);
      }
      // this.editRow = true;
      // const list = {
      //   editRow: this.editRow,
      // };

      // this.receivableEnterData.push(list);
      // this.receivableEnterData.splice(1, 0);
    },
    getRowKey(row) {
      return row.id;
    },
    // 输入框改变
    changeInput(val, index, name) {
      const { remainderDistributeAmount, rate } = this.receivableEnterData[index];

      if (name === 'distributeAmount') {
        const checkPass = parseFloat(val || 0) > parseFloat(remainderDistributeAmount || 0);

        if (checkPass) {
          this.$notifyError('实际分配金额要小于等于“总包剩余分配金额”');

          return false;
        }
      }
      let actualDistributeAmount = 0;
      const { taxRateCode } = this.common();
      const rateFindItem = taxRateCode.filter((option) => option.name === rate);
      const rateValue = rateFindItem && rateFindItem[0] && rateFindItem[0].value;

      if (val && rateValue) {
        actualDistributeAmount = parseFloat(val || 0) / (1 + parseFloat(rateValue / 100));
      }
      this.receivableEnterData[index] = {
        ...this.receivableEnterData[index],
        [name]: val,
        actualDistributeAmount,
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
          if (name === 'goodsType') {
            const goodsOptions = this.common().goodsType;
            const findItem = goodsOptions.filter((option) => option.id === val);
            const rate = findItem && findItem[0] && findItem[0].value;
            const typeDescribe = findItem && findItem[0] && findItem[0].name;
            // 实际分配金额(含税)/(1+税率)
            const { taxRateCode } = this.common();
            const rateFindItem = taxRateCode.filter((option) => option.name === rate);
            const rateValue = rateFindItem && rateFindItem[0] && rateFindItem[0].value;

            let actualDistributeAmount = 0;

            if (data.distributeAmount && rateValue) {
              actualDistributeAmount = parseFloat(data.distributeAmount || 0) / (1 + parseFloat(rateValue / 100));
            }
            addObj = {
              ...addObj,
              rate,
              typeDescribe,
              actualDistributeAmount,
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
        const { goodsType, typeDescribe, distributeAmount } = this.receivableEnterData[index];

        if (!goodsType || !typeDescribe || !distributeAmount) {
          this.$notifyError('请先完整输入信息:商品种类、种类描述、实际分配金额(含税)');

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
    successErqNumber(subTable) {
      const targetTable = this.receivableEnterData;

      subTable.forEach((subIndex) => {
        const subFindexIndex = targetTable.findIndex((tableItem) => tableItem.invoiceCode === subIndex.invoiceCode);

        if (subFindexIndex > -1) {
          this.receivableEnterData[subFindexIndex] = {
            ...this.receivableEnterData[subFindexIndex],
            ...subIndex,
            editRow: true,
          };
        } else {
          this.receivableEnterData.push({
            ...subIndex,
            editRow: true,
          });
        }
      });
      this.editRow = true;
      this.receivableEnterData.splice(1, 0);
      this.$nextTick(() => {
        this.calculationTable();
      });
    },
    calculationTable() {
      if (this.receivableEnterData.length > 0) {
        const rate = [];

        let distributeAmount = 0;

        let taxAmount = 0;

        let actualDistributeAmount = 0;

        this.receivableEnterData.forEach((item) => {
          if (rate.indexOf(item.rate) < 0) {
            rate.push(item.rate);
          }
          distributeAmount += parseFloat(item.totalContractAmount || 0);
          taxAmount += parseFloat(item.taxAmount || 0);
          actualDistributeAmount += parseFloat(item.actualDistributeAmount || 0);
        });
        this.form = {
          ...this.form,
          rate: rate.join(','),
          distributeAmount,
          taxAmount,
          actualDistributeAmount,
        };
      }
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
