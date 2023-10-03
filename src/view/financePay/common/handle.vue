<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="false"
      :isEdit="true"
      :form.sync="form"
      @submit="submitForm"
    />
    <!-- 列账金额(合作发票) / 列账金额(预缴税) -->
    <wrapper :key="'accountAmount'" :title="'列账金额(合作发票) / 列账金额(预缴税)'" :isFold="false">
      <page-table
        ref="uploadTenderTable"
        col-align="left"
        :data="accountAmountTableData"
        :cols="tableCols"
        :selection="true"
        :operator="false"
        :showPage="true"
        :row-key="getRowKey"
        :page-current="accountAmountPage.current"
        :total="accountAmountPage.total"
        :page-size="accountAmountPage.pageSize"
        :showSummary="true"
        :summaryMethod="summaryMethod"
        @selection-change="accountAmountSelectChange"
        @current-change="onCurrentChange"
        @size-change="onPageSizeChange"
      >
      </page-table>
    </wrapper>
    <!-- 核销暂估应付 -->
    <wrapper
      :key="'writeOff'"
      :title="'核销暂估应付'"
      :isFold="false"
      v-if="form.sourceFrom === '2' || data.configType === 'add'"
    >
      <page-table
        ref="writeOffTable"
        col-align="left"
        :data="writeOffTableData"
        :cols="writeOffTableCols"
        :selection="true"
        :operator="false"
        :showPage="true"
        :row-key="getRowKey"
        :page-current="writeOffPage.current"
        :total="writeOffPage.total"
        :page-size="writeOffPage.pageSize"
        :showSummary="true"
        :summaryMethod="writeOffSummaryMethod"
        @selection-change="writeOffSelectChange"
        @current-change="onWriteOffCurrentChange"
        @size-change="onWriteOffPageSizeChange"
      >
      </page-table>
    </wrapper>

    <cooperationContract :show="peopleShow" :data="peopleData" @cancel="closeEdit" @success="successEdit" />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import cooperationContract from './cooperationContract';
import {
  invoicePayDetailListForUpdate,
  billNumberListForUpdate,
  financePay,
  paymentInfoUpdate,
  subPackageBillNumberList,
  getInvoicePayDetailList,
  paymentInfoSave,
} from '@/api/financePay/invoiceActualPayment';
export default {
  name: 'handleInfo',
  components: {
    FormItem,
    Wrapper,
    PageTable,
    cooperationContract,
  },
  props: {
    show: Boolean,
    data: {},
  },
  inject: ['common'],
  data() {
    return {
      form: {
        busiName: undefined,
        auditOpinion: undefined,
      },
      layout: [
        {
          title: '基本信息',
          formItems: [
            {
              label: '委托方',
              prop: 'consignor',
              inputType: 'select',
              span: 12,
              disabled: true,
              options: this.common().constructionCode,
              onChange: (val) => {
                // this.form.busiResource = val;
              },
            },
            {
              label: 'ERP编号',
              prop: 'erpNumber',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '项目名称',
              prop: 'projectName',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '报账单号',
              prop: 'paymentNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作合同编号',
              prop: 'contractNo',
              disabled: this.data.configType !== 'add',
              inputType: 'select',
              span: 12,
              onFocus: (val) => {
                this.peopleData = {
                  ...this.data,
                  ...this.form,
                };
                this.peopleShow = true;
                console.log('onFocus', val);
              },
            },
          ],
        },
      ],
      formRules: {
        paymentNumber: {
          required: true,
          message: '请输入报账单号',
          trigger: 'blur',
        },
        contractNo: {
          required: true,
          message: '请选择合作合同编号',
          trigger: 'change',
        },
      },
      deductionAmountTotal: 0,
      paymentAmountTotal: 0,
      accountAmountTableData: [],
      writeOffTableData: [],
      accountAmountSelection: [],
      writeOffSelection: [],
      tableCols: [
        {
          label: '列账单号',
          prop: 'billNumber',
          align: 'center',
        },
        {
          label: '列账金额',
          prop: 'businessAmount',
          align: 'center',
        },
        {
          label: '已付金额',
          prop: 'paidDeductionAmount',
          align: 'center',
        },
        {
          label: '列账余额',
          prop: 'waitDeductionAmount',
          align: 'center',
        },
        {
          label: '本次付款金额',
          prop: 'deductionAmount',
          align: 'center',
          render: (h, scope) => (
            <div class="el-input">
              {
                <div>
                  {
                    <el-input
                      class="editInput"
                      value={scope.row.deductionAmount}
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
      writeOffTableCols: [
        {
          label: '暂估应付编码',
          prop: 'payLogCode',
          align: 'center',
        },
        {
          label: '暂估应付金额',
          prop: 'splitAmount',
          align: 'center',
        },
        {
          label: '已付金额',
          prop: 'paidAmount',
          align: 'center',
        },
        {
          label: '暂估应付余额',
          prop: 'waitAmount',
          align: 'center',
        },
        {
          label: '本次核销金额',
          prop: 'paymentAmount',
          align: 'center',
          render: (h, scope) => (
            <div class="el-input">
              {
                <div>
                  {
                    <el-input
                      class="editInput"
                      value={scope.row.paymentAmount}
                      onInput={(val) => {
                        this.changePaymentAmountInput(val, scope.$index, scope);
                      }}
                    ></el-input>
                  }
                </div>
              }
            </div>
          ),
        },
        {
          label: '调整金额',
          prop: 'adjustAmount',
          align: 'center',
          render: (h, scope) => (
            <div class="el-input">
              {
                <div>
                  {
                    <el-input
                      class="editInput"
                      value={scope.row.adjustAmount}
                      onInput={(val) => {
                        this.changeAdjustAmountInput(val, scope.$index);
                      }}
                    ></el-input>
                  }
                </div>
              }
            </div>
          ),
        },
      ],
      accountAmountPage: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      writeOffPage: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      peopleShow: false,
      peopleData: {},
      selectTable: {},
    };
  },
  methods: {
    reqDetail() {
      const { row } = this.data;

      console.log(this.data);
      if (row && row.id) {
        this.form = {
          ...this.form,
          ...row,
        };
      }
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      if (!this.accountAmountSelection.length) {
        this.$notify.error({
          title: '失败',
          message: '请勾选列账金额数据',
          position: 'bottom-right',
        });

        return;
      }
      if (!this.deductionAmountTotal) {
        this.$notify.error({
          title: '失败',
          message: '本次付款金额不能为空',
          position: 'bottom-right',
        });

        return;
      }
      if (this.form.sourceFrom === '2' || this.data.configType === 'add') {
        if (!this.writeOffSelection.length) {
          this.$notify.error({
            title: '失败',
            message: '请勾选核销暂估应付数据',
            position: 'bottom-right',
          });

          return;
        }
        if (this.paymentAmountTotal !== this.deductionAmountTotal) {
          this.$notify.error({
            title: '失败',
            message: '本次付款金额 和 本次核销金额 必须一致',
            position: 'bottom-right',
          });

          return;
        }
        if (!this.paymentAmountTotal) {
          this.$notify.error({
            title: '失败',
            message: '本次核销金额不能为空',
            position: 'bottom-right',
          });

          return;
        }
      }
      const { row } = this.data;
      const invoiceActualEstimateDetailCommands = this.writeOffSelection.map((ele) => ({
        erpNumber: ele.erpNumber,
        payDetailId: ele.id,
        paymentAmount: ele.paymentAmount,
        spBatchId: ele.spBatchId,
        spSubBathId: ele.spSubBathId,
        adjustAmount: ele.adjustAmount,
        paymentBatchId: row.paymentBatchId,
      }));
      const obj = {
        contractId: this.data.configType === 'add' ? this.selectTable.id : row.contractId, // 合作合同id
        id: row.id, // 带
        status: row.status, // 带
        paymentBatchId: row.paymentBatchId, // 修改
        deductionAmount: this.deductionAmountTotal, // 本次付款金额 总和
        erpNumber: row.erpNumber, // 页面传过来erp
        paymentAmount: this.paymentAmountTotal, // 本次核销金额 总和
        paymentNumber: val.paymentNumber, // 表单 - 报账单
        sourceFrom: row.sourceFrom ? row.sourceFrom : '2',
        invoiceActualBillDetailCommands: this.accountAmountSelection.map((ele) => ({
          billNumber: ele.billNumber,
          billNumberId: ele.billNumberId,
          deductionAmount: ele.deductionAmount,
          erpNumber: ele.erpNumber,
          spBatchId: ele.batchId,
          spSubBathId: ele.subBathId,
          paymentBatchId: row.paymentBatchId,
        })), // 列账金额
        invoiceActualEstimateDetailCommands:
          row.sourceFrom === '2' || this.data.configType === 'add' ? invoiceActualEstimateDetailCommands : [], // 核销暂估应付
      };

      const api = this.data.configType === 'add' ? paymentInfoSave : paymentInfoUpdate;

      api(obj).then((res) => {
        if (res.code === '200') {
          this.$notify.success({
            title: '成功',
            message: '修改成功',
            position: 'bottom-right',
          });
          this.$emit('success');
        }
      });
    },
    // 请求某页数据
    onCurrentChange(val) {
      this.accountAmountPage.current = val;
      this.getDataAllList();
    },
    // 改变请求条数
    onPageSizeChange(val) {
      this.accountAmountPage.pageSize = val;
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      const params = {
        data: {
          paymentBatchId: this.data.row.paymentBatchId,
        },
        pageNo: this.accountAmountPage.current,
        pageSize: this.accountAmountPage.pageSize,
        sorting: 'id desc',
      };

      if (this.data.configType === 'add') {
        params.data = {
          contractId: this.selectTable.id,
        };
      }
      const api = this.data.configType === 'add' ? subPackageBillNumberList : billNumberListForUpdate;

      api(params).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.accountAmountTableData = data;
          this.accountAmountPage.total = total;
        }
      });
    },

    // 请求某页数据
    onWriteOffCurrentChange(val) {
      this.accountAmountPage.current = val;
      this.getWriteOffDataAllList();
    },
    // 改变请求条数
    onWriteOffPageSizeChange(val) {
      this.accountAmountPage.pageSize = val;
      this.onWriteOffCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getWriteOffDataAllList() {
      const params = {
        data: {
          paymentBatchId: this.data.row.paymentBatchId,
        },
        pageNo: this.writeOffPage.current,
        pageSize: this.writeOffPage.pageSize,
        sorting: 'id desc',
      };

      if (this.data.configType === 'add') {
        params.data = {
          contractId: this.selectTable.id,
        };
      }
      const api = this.data.configType === 'add' ? getInvoicePayDetailList : invoicePayDetailListForUpdate;

      api(params).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.writeOffTableData = data;
          this.writeOffPage.total = total;
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    summaryMethod(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计';

          return;
        }
        const values = data.map((item) => Number(item[column.property]));

        if (column.property === 'deductionAmount') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);

            if (!isNaN(value)) {
              return prev + curr;
            }

            return prev;
          }, 0);
          sums[index] = sums[index].toFixed(2);
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
    writeOffSummaryMethod(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计';

          return;
        }
        const values = data.map((item) => Number(item[column.property]));

        if (column.property === 'paymentAmount' || column.property === 'adjustAmount') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);

            if (!isNaN(value)) {
              return prev + curr;
            }

            return prev;
          }, 0);
          sums[index] = sums[index].toFixed(2);
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },

    // 输入本次付款金额
    changeInput(val, index, scope) {
      const waitDeductionAmount = parseFloat(scope.row.waitDeductionAmount), // 列账余额
        value = parseFloat(val); // 本次付款金额

      if (!val) {
        this.$notify.error({
          title: '失败',
          message: '本次付款金额不能为空',
          position: 'bottom-right',
        });

        return;
      }
      if (value > waitDeductionAmount) {
        this.$notify.error({
          title: '失败',
          message: '本次付款金额 不能大于 列账余额',
          position: 'bottom-right',
        });

        return;
      }
      this.$set(this.accountAmountTableData[index], 'deductionAmount', val);
      this.getAccountAmountTotal();
    },

    // 输入本次核销金额
    changePaymentAmountInput(val, index, scope) {
      const waitAmount = parseFloat(scope.row.waitAmount), // 暂估应付余额
        value = parseFloat(val); // 本次核销金额

      console.log(val, waitAmount);
      if (!val) {
        this.$notify.error({
          title: '失败',
          message: '本次核销金额不能为空',
          position: 'bottom-right',
        });

        return;
      }
      if (value > waitAmount) {
        this.$notify.error({
          title: '失败',
          message: '本次核销金额 不能大于 暂估应付余额',
          position: 'bottom-right',
        });

        return;
      }
      this.$set(this.writeOffTableData[index], 'paymentAmount', val);
      this.getPaymentAmountTotal();
    },

    // 输入调整金额
    changeAdjustAmountInput(val, index) {
      this.$set(this.writeOffTableData[index], 'adjustAmount', val);
    },

    getFormItem() {
      const id = this.data.row.erpNumber;

      financePay(id).then((res) => {
        if (res.code === '200') {
          this.$set(this.form, 'projectName', res.data.projectName);
          this.$set(this.form, 'consignor', res.data.constructions);
        }
      });
    },

    // 勾选列账金额
    accountAmountSelectChange(args) {
      this.accountAmountSelection = args;
      this.getAccountAmountTotal();
    },

    // 获取勾选列账金额合计
    getAccountAmountTotal() {
      const values = this.accountAmountSelection.map((item) => Number(item.deductionAmount));

      this.deductionAmountTotal = values.reduce((prev, curr) => {
        const value = Number(curr);

        if (!isNaN(value)) {
          return prev + curr;
        }

        return prev;
      }, 0);
    },

    // 勾选核销暂估应付
    writeOffSelectChange(args) {
      this.writeOffSelection = args;
      this.getPaymentAmountTotal();
    },

    // 获取已勾选核销暂估应付合计
    getPaymentAmountTotal() {
      const values = this.writeOffSelection.map((item) => Number(item.paymentAmount));

      this.paymentAmountTotal = values.reduce((prev, curr) => {
        const value = Number(curr);

        if (!isNaN(value)) {
          return prev + curr;
        }

        return prev;
      }, 0);
    },

    closeEdit() {
      this.peopleShow = false;
      this.peopleData = {};
    },

    successEdit(selectTable) {
      console.log('selectTable', selectTable);
      this.selectTable = selectTable;
      this.$set(this.form, 'contractNo', selectTable.contractNo);
      this.closeEdit();
      this.onCurrentChange(1);
      this.onWriteOffCurrentChange(1);
    },
  },
  created() {
    this.reqDetail();
    if (this.data.configType !== 'add') {
      this.getDataAllList();
      if (this.form.sourceFrom === '2') {
        this.getWriteOffDataAllList();
      }
    }
    this.getFormItem();
  },
};
</script>

<style scoped></style>
