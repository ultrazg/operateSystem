<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
    <div class="extra-table" v-if="isAddExtra">
      <div class="btn-list">
        <span class="add-btn" @click="handleAdd">新增</span>
      </div>
      <div>
        <page-table
          ref="pageTable"
          col-align="left"
          operator-width="110"
          :data="tableData"
          :cols="tableCols"
          :hideDefaultIndex="true"
          :selection="false"
          :operator="true"
          :showPage="false"
          reserveSelection
          :row-key="getRowKey"
        >
          <template slot-scope="scope" slot="operator">
            <el-button
              type="text"
              size="small"
              title="删除"
              icon="iconfont icon-shanchu"
              @click.prevent.stop="handleDelete(scope)"
            >
              删除
            </el-button>
          </template>
        </page-table>
      </div>
    </div>
    <subcontractInvoiceSelect :show="peopleShow" :data="peopleData" @cancel="closeEdit" @success="successEdit" />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import PageTable from '@/components/page-table';
import subcontractInvoiceSelect from './subcontractInvoiceSelect';
import { getPayInfo, invoicePayManyPay } from '@/api/financePay/invoicePayManagement';
export default {
  name: 'invoicePayManagementAdd',
  components: {
    FormItem,
    PageTable,
    subcontractInvoiceSelect,
  },
  props: {
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
      form: {
        busiName: undefined,
        auditOpinion: undefined,
      },
      layout: [
        {
          title: '基础信息',
          formItems: [
            {
              label: 'ERP编号',
              prop: 'erpId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目名称',
              prop: 'projectName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目名称',
              prop: 'projectName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '开票总金额',
              prop: 'totalAmount',
              inputType: 'parseFloat',
              span: 12,
            },
            {
              label: '分包发票金额',
              prop: 'subAmount',
              inputType: 'parseFloat',
              span: 12,
            },
            {
              label: '比例',
              prop: 'rate',
              inputType: 'input',
              span: 12,
            },
            {
              label: '累计收款',
              prop: 'amount',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '核销金额',
              prop: 'paymentAmount',
              inputType: 'parseFloat',
              span: 12,
            },
            {
              label: '合作比例',
              prop: 'ratioDouble',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作模式',
              prop: 'cooperationMode',
              inputType: 'input',
              span: 12,
            },
            {
              label: '暂估应付',
              prop: 'receiveAmount',
              inputType: 'input',
              span: 12,
              append: true,
              btnIconClass: 'el-icon-plus',
              onClick: () => {
                this.receiveAmountClick();
              },
            },
            {
              label: '拆分金额',
              prop: 'splitAmount',
              inputType: 'parseFloat',
              span: 12,
              hidden: true,
            },
          ],
        },
      ],
      formRules: {},
      isAddExtra: false,
      peopleShow: false,
      peopleData: {},
      tableData: [],
      tableCols: [
        {
          label: '分包发票',
          prop: 'batchAmount',
          align: 'center',
          render: (h, scope) => (
            <div class="el-input">
              {
                <div>
                  {
                    <el-input
                      class="editInput"
                      value={scope.row.batchAmount}
                      onFocus={(val) => {
                        this.peopleData = {
                          index: scope.$index,
                          invoiceDetailId: this.data.invoiceDetailId,
                          erpNumber: this.data.erpNumber,
                        };
                        this.peopleShow = true;
                      }}
                    ></el-input>
                  }
                </div>
              }
            </div>
          ),
        },
        {
          label: '合作合同',
          prop: 'contractNo',
          align: 'center',
        },
        {
          label: '金额',
          prop: 'payAmount',
          align: 'center',
          render: (h, scope) => (
            <div class="el-input">
              {
                <div>
                  {
                    <el-input
                      class="editInput"
                      disabled={!scope.row.batchAmount}
                      value={scope.row.payAmount}
                      onInput={(val) => {
                        this.changeInput(val, scope.$index, scope);
                      }}
                    ></el-input>
                  }
                </div>
              }
            </div>
          ),
        },
      ],
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  methods: {
    reqDetail() {
      const { invoiceDetailId, erpNumber, paymentAmount } = this.data;
      const params = {
        invoiceDetailId,
        erpNumber,
      };

      getPayInfo(params).then((res) => {
        if (res.code === '200') {
          this.form = res.data;
          this.form.erpId = erpNumber;
          this.form.paymentAmount = paymentAmount;
          this.form.receiveAmount = (res.data.rate * paymentAmount).toFixed(2);
        }
      });
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { receiveAmount } = val, // 暂估应付
        { paymentAmount } = val, // 核销金额
        splitAmount = val.splitAmount ? parseFloat(val.splitAmount) : 0; // 拆分金额

      let [tableAmount, flag] = [0, true];

      if (this.isAddExtra) {
        this.tableData.forEach((ele) => {
          tableAmount += parseFloat(ele.payAmount);
        });
        tableAmount += splitAmount;
        if (tableAmount > paymentAmount) {
          flag = false;
          this.$notify.error({
            title: '失败',
            message: '拆分金额与分包发票金额不能超过核销金额',
            position: 'bottom-right',
          });
        }
      } else if (receiveAmount > paymentAmount) {
        flag = false;
        this.$notify.error({
          title: '失败',
          message: '暂估应付金额不能超过核销金额',
          position: 'bottom-right',
        });
      }
      if (!flag) {
        return;
      }
      const params = {
        relations: this.data.params,
        invoiceDetailId: this.data.invoiceDetailId,
        splitAmount,
        details: this.tableData.map((ele) => ({
          spSubBathId: ele.subBathId,
          spBatchId: ele.batchId,
          erpNumber: ele.erpNumber,
          splitAmount: ele.payAmount,
        })),
      };

      console.log(params);
      invoicePayManyPay(params, receiveAmount).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '操作成功',
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
    receiveAmountClick() {
      this.isAddExtra = !this.isAddExtra;
      const splitAmount = {
        required: true,
        message: '请输入拆分金额',
        trigger: 'blur',
      };

      this.formRules = this.isAddExtra ? { splitAmount } : {};
      this.$set(this.layout[0].formItems[10], 'btnIconClass', this.isAddExtra ? 'el-icon-minus' : 'el-icon-plus');
      this.$set(this.layout[0].formItems[11], 'hidden', !this.isAddExtra);
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    handleAdd() {
      this.tableData.push({
        batchAmount: '',
        contractNo: '',
        payAmount: '',
        subBathId: '',
        spBatchId: '',
        erpNumber: this.data.erpNumber,
      });
    },
    changeInput(val, index, scope) {
      const batchAmount = parseFloat(scope.row.batchAmount), // 分包金额
        value = parseFloat(val);

      if (value > batchAmount) {
        this.$notify.error({
          title: '失败',
          message: '输入金额不能超过分包发票金额',
          position: 'bottom-right',
        });

        return;
      }
      this.$set(this.tableData[index], 'payAmount', val);
    },
    handleDelete(scope) {
      this.tableData.splice(scope.index, 1);
    },
    closeEdit() {
      this.peopleShow = false;
      this.peopleData = {};
    },
    successEdit(selectTable) {
      console.log('selectTable', selectTable);
      const { row, index } = selectTable;

      this.tableData[index].batchAmount = row.totalTaxPriceAmount;
      this.tableData[index].contractNo = row.contractName;
      this.tableData[index].batchId = row.batchId;
      this.tableData[index].subBathId = row.subBathId;
      this.closeEdit();
    },
  },
  created() {
    this.reqDetail();
  },
};
</script>

<style scoped lang="less">
.extra-table {
  .btn-list {
    text-align: right;
    .add-btn {
      display: inline-block;
      padding: 4px 20px;
      color: #fff;
      background: linear-gradient(135deg, #f7660d 5%, #f00a00 100%);
      margin-bottom: 8px;
      cursor: pointer;
    }
  }
}
</style>
