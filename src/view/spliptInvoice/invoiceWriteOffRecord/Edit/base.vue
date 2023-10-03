<template>
  <div id="base">
    <FormItem ref="supplyFormItem" :layout="layout" :rules="formRules" :disabled="inputDisabled" :form.sync="form">
      <!--合同信息-->
      <template slot="writeOffInfo">
        <page-table
          ref="pageTable"
          col-align="left"
          :row-key="getRowKey"
          :showPage="false"
          :operator="false"
          :expand="true"
          :data="writeOffInfoData"
          :cols="writeOffInfoCols"
          hideDefaultIndex
        >
          <!--真实发票数据-->
          <template slot="expand" slot-scope="scope">
            <div class="expandInfo">
              <page-table
                class="childPageTable"
                ref="pageTable"
                col-align="left"
                :row-key="getRowKey"
                :showPage="false"
                :selection="false"
                :operator="false"
                :data="scope.row.realInvoiceItemList"
                :cols="realInvoiceItemCols"
              >
              </page-table>
            </div>
          </template>
        </page-table>
      </template>
    </FormItem>
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import PageTable from '@/components/page-table';
import { detailInvoiceWriteOffRecord } from '@/api/spliptInvoice/invoiceWriteOffRecord';
export default {
  name: 'writeOffInfo',
  components: {
    FormItem,
    PageTable,
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
      // isEdit: ['add', 'edit'].includes(configType),
      // isAdd: ['add'].includes(configType),
      isDetail: ['detail'].includes(configType),
      form: {},
      layout: [
        {
          title: '分包发票信息',
          formItems: [
            {
              label: '合作发票批次',
              prop: 'batchNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作发票批次名称',
              prop: 'batchName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '分包发票代码',
              prop: 'invoiceCode',
              inputType: 'input',
              span: 12,
            },
            {
              label: '分包发票号码',
              prop: 'invoiceNumber',
              inputType: 'input',
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
              label: '开票日期',
              prop: 'createTime',
              inputType: 'date',
              span: 12,
            },
            {
              label: '本章发票不含税金',
              prop: 'noTaxAmount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '本章发票税额',
              prop: 'taxAmount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '本章发票含税价',
              prop: 'invoiceAmount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '已分配金额',
              prop: 'allocationAmount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '核销状态',
              prop: 'writeOffStatus',
              inputType: 'input',
              span: 12,
            },
            {
              label: '已核销金额',
              prop: 'amountWrittenOff',
              inputType: 'input',
              span: 12,
            },
            {
              label: '待核销金额',
              prop: 'amountToBeWrittenOff',
              inputType: 'input',
              span: 12,
            },
          ],
        },
        {
          title: '关联项目核销信息',
          render: 'writeOffInfo',
        },
      ],
      formRules: {},
      editRow: false,
      writeOffInfoData: [], // 合同信息数据
      writeOffInfoCols: [
        {
          label: '合作合同名称',
          prop: 'cooperationContractName',
          width: '120px',
        },
        {
          label: '已分配金额',
          prop: 'amountAllocate',
          width: '110px',
        },
        {
          label: '成本类型',
          prop: 'costType',
          hide: true,
          render: (h, scope) => {
            const useItem = this.common().instionFeeType.filter((status) => status.id === scope.row.costType);

            return <div>{useItem && useItem[0] && useItem[0].name}</div>;
          },
        },
        {
          label: '站点名称',
          prop: 'stationName',
          hide: true,
          width: '100px',
        },
        {
          label: '站点类型',
          prop: 'stationType',
          hide: true,
          render: (h, scope) => {
            const useItem = this.common().stationType.filter((status) => status.id === scope.row.stationType);

            return <div>{useItem && useItem[0] && useItem[0].name}</div>;
          },
        },
        {
          label: '合作合同总金额(含税)',
          prop: 'totalCooperationContractAmount',
          width: '150px',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
        },
        {
          label: '承揽订单',
          prop: 'orderName',
          hide: false,
        },
        {
          label: '承揽订单金额',
          prop: 'orderAmount',
          width: '120px',
          hide: false,
        },
        {
          label: '合作比例',
          prop: 'rate',
        },
        {
          label: '对应总包金额',
          prop: 'totalPackageAmount',
          width: '120px',
        },
        {
          label: '已核销金额',
          prop: 'amountWrittenOff',
          width: '120px',
        },
        {
          label: '待核销金额',
          prop: 'amountToBeWrittenOff',
          width: '120px',
        },
      ],
      realInvoiceItemData: [], // 真实发票数据
      realInvoiceItemCols: [
        {
          label: '真实分包发票代码',
          prop: 'invoiceCode',
          width: '120px',
        },
        {
          label: '真实分包发票号码',
          prop: 'invoiceNumber',
          width: '120px',
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
          prop: 'createTime',
        },
        {
          label: '发票金额(不含税)',
          prop: 'noTaxAmount',
          width: '120px',
        },
        {
          label: '税率(%)',
          prop: 'rate',
          render: (h, scope) => {
            const d = scope.row;
            const { taxRateCode } = this.common();
            const rateItem = taxRateCode.filter((code) => code.code === d.rate);

            const html = rateItem && rateItem[0] && rateItem[0].name;

            return <div>{html}</div>;
          },
        },
        {
          label: '发票税额',
          prop: 'taxAmount',
        },
        {
          label: '发票金额(含税)',
          prop: 'invoiceAmount',
          width: '120px',
        },
        {
          label: '核销金额',
          prop: 'amountWrittenOff',
        },
        {
          label: '核销人',
          prop: 'operator',
        },
        {
          label: '核销时间',
          prop: 'writeOffTime',
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      console.log('data', this.data);
      this.inputDisabled = this.data.configType === 'detail';
      this.isDetail = ['detail'].includes(this.data.configType);
      console.log('val', this.isDetail);
      if (this.isDetail) {
        this.reqDetail();
      }
    });
  },
  watch: {
    data(val) {
      console.log('val', val);
      // this.data = val;

      this.inputDisabled = val.configType === 'detail';
      // this.isEdit = ['add', 'edit'].includes(val.configType);
      // this.isAdd = ['add'].includes(val.configType);
      this.isDetail = ['detail'].includes(val.configType);

      if (this.isDetail) {
        this.reqDetail();
      }
    },
  },
  methods: {
    // 请求数据
    reqDetail() {
      console.log('reqDetail');
      const { row } = this.data;

      if (row && row.id) {
        detailInvoiceWriteOffRecord(row.id).then((res) => {
          if (res && res.code === '200' && res.data) {
            this.form = {
              ...this.form,
              ...res.data,
            };
            this.writeOffInfoData = res.data.realInvoiceList;
            const checkInvoiceType = res.data.projectType !== '3';

            this.writeOffInfoCols[2].hide = checkInvoiceType;
            this.writeOffInfoCols[3].hide = checkInvoiceType;
            this.writeOffInfoCols[4].hide = checkInvoiceType;
            this.writeOffInfoCols[7].hide = !checkInvoiceType;
            this.writeOffInfoCols[8].hide = !checkInvoiceType;
          }
          // console.log('res.data', res.data);
        });
      }
    },

    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const param = {
        // ...val,
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      editDeviceInfo(param).then((res) => {
        if (res.code === '200') {
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
  },
  created() {
    if (this.isDetail === true) {
      this.reqDetail();
    }
  },
};
</script>

<style lang="less" scoped>
#base {
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
      .is-scrolling-right,
      .is-scrolling-left {
        overflow-x: hidden;
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
