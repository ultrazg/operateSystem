<template>
  <div id="base">
    <FormItem ref="supplyFormItem" :layout="layout" :rules="formRules" :disabled="inputDisabled" :form.sync="form">
      <template slot="costInfo">
        <page-table
          ref="pageTable"
          col-align="left"
          :showPage="false"
          :operator="false"
          :expand="true"
          :data="costInfoData"
          :cols="costInfoCols"
          hideDefaultIndex
        >
          <template slot-scope="scope" slot="expand">
            <div class="expandInfo">
              <page-table
                class="childPageTable"
                ref="pageTable"
                col-align="left"
                :showPage="false"
                :selection="false"
                :operator="false"
                :data="expandTableData"
                :cols="expandTableCols"
              >
              </page-table>
              <template slot-scope="sonScope" slot="operator">
                <flex>
                  <el-button
                    type="text"
                    size="small"
                    title="编辑"
                    icon="iconfont icon-bianji"
                    v-if="!scope.row.editRow"
                    @click.prevent.stop="
                      expendAction('edit', {
                        index: scope.index,
                        sonIndex: sonScope.index,
                        data: sonScope.row,
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
                      expendAction('save', {
                        index: scope.index,
                        sonIndex: sonScope.index,
                        data: sonScope.row,
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
                      expendAction('del', {
                        index: scope.index,
                        sonIndex: sonScope.index,
                        data: sonScope.row,
                      })
                    "
                  >
                    删除
                  </el-button>
                </flex>
              </template>
              <div
                class="flexRow flexCenter addRow"
                @click="
                  () =>
                    addRow({
                      index: scope.index,
                      data: scope.row,
                    })
                "
              >
                <span class="iconfont icon-jiahao" />
                <span class="text">添加数据</span>
              </div>
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
import otherBtnList from '@/components/headerTitle/otherBtnList';
import Flex from '@/components/flex';
import { detailInvoiceWriteOffRecord } from '@/api/spliptInvoice/invoiceWriteOffRecord';
export default {
  name: 'writeOffInfo',
  components: {
    FormItem,
    PageTable,
    // Flex,
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
      form: {},
      layout: [
        {
          title: '成本信息',
          formItems: [
            {
              label: '成本总金额',
              prop: 'totalAmount',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '已报销总金额',
              prop: '?',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '剩余报销金额',
              prop: '?',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '已付款金额',
              prop: 'amountPaid',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '待付款金额',
              prop: 'amountWaitPaid',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
          ],
        },
        {
          title: '',
          render: 'costInfo',
        },
      ],
      formRules: {
        // no: { required: true, message: "请输入公告名称", trigger: "blur" },
        // address: { required: true, message: "请输入公告号", trigger: "blur" },
        // buildArea: {
        //   required: true,
        //   message: "请选择公告类型",
        //   trigger: "blur",
        // },
      },
      editRow: false,
      costInfoData: [
        { costType: '安全生产费' },
        { costType: '差旅费' },
        { costType: '项目人工费' },
        { costType: '房屋租赁及物业管理费' },
        { costType: '材料费' },
        { costType: '设备仪表租赁费' },
        { costType: '公司人工成本费' },
        { costType: '车辆使用费及其他' },
        { costType: '折旧与摊销费' },
        { costType: '业务费' },
        { costType: '通信费' },
        { costType: '办公费' },
        { costType: '税金规费' },
      ],
      costInfoCols: [
        {
          label: '成本类型',
          prop: 'costType',
        },
        {
          label: '成本金额',
          prop: 'costAmount',
        },
        {
          label: '已报销金额',
          prop: '?',
        },
        {
          label: '剩余报销金额',
          prop: '?',
        },
        {
          label: '已付款金额',
          prop: 'amountPaid',
        },
        {
          label: '待付款金额',
          prop: 'amountWaitPaid',
        },
      ],
      expandTableData: [],
      expandTableCols: [
        {
          label: '报销金额',
          prop: '?',
        },
        {
          label: '报销人',
          prop: '?',
        },
        {
          label: '报销时间',
          prop: '?',
        },
        {
          label: '附件',
          prop: '?',
        },
        {
          label: '已付款金额',
          prop: 'amountPaid',
        },
        {
          label: '待付款金额',
          prop: 'amountWaitPaid',
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
      console.log('watch监控');

      if (this.isDetail) {
        this.reqDetail();
      }
    },
  },
  methods: {
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
            this.expandTableData = res.data.realInvoiceList;
          }
          console.log('res.data', res.data);
        });
      }
    },
    addRow() {
      console.log('addRow');
      if (this.editRow) {
        this.$notifyError('请先保存当前新增行数据再进行添加操作');

        return;
      }

      this.editRow = true;
      const list = {
        editRow: this.editRow,
      };

      this.invoiceTableData.unshift(list);
      this.invoiceTableData.splice(1, 0);
    },
    // tableAction(type, row) {
    //   console.log('row', row);
    // if (type === 'edit') {
    //   this.invoiceTableData[row.index] = {
    //     ...this.invoiceTableData[row.index],
    //     editRow: true,
    //   };
    //   this.editRow = true;
    //   this.invoiceTableData.splice(1, 0);
    //   console.log('this.invoiceTableData', this.invoiceTableData);
    // }
    // if (type === 'save') {
    //   this.tableData[index] = {
    //     ...this.tableData[index],
    //     editRow: false,
    //   };
    //   this.editRow = false;
    //   this.tableData.splice(1, 0);
    // }
    //   if (type === 'del') {
    //     this.invoiceTableData.splice(row.index, 1);
    //     this.editRow = false;
    //   }
    // },
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
