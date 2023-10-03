<template>
  <div class="projectDetailShow">
    <project-base-info :data="data" :info="info.InfoProjectBaseDtoModel" :spanLength="spanLength" />
    <wrapper :key="'cumulativeAmountTable'" :title="'项目累积金额'" :isFold="false">
      <span class="add-btn" @click="handleEdit('add')" v-if="data.configType !== 'detail'">新增</span>
      <!-- 页面 -->
      <div class="content-view">
        <div class="Modeltable">
          <page-table
            ref="cumulativeAmountTable"
            col-align="left"
            operator-width="110"
            :data="amountTableData"
            :cols="amountTableCols"
            :selection="false"
            :showPage="false"
            :operator="data.configType !== 'detail'"
            :hideDefaultIndex="true"
            :showSummary="true"
            reserveSelection
            :row-key="getRowKey"
            :summaryMethod="summaryMethod"
          >
            <template slot-scope="scope" slot="operator">
              <flex>
                <el-button
                  type="text"
                  size="small"
                  title="编辑"
                  icon="iconfont icon-bianji"
                  @click.prevent.stop="handleEdit('edit', scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  title="删除"
                  icon="iconfont icon-shanchu"
                  @click.prevent.stop="handleDelete(scope.row)"
                >
                  删除
                </el-button>
              </flex>
            </template>
          </page-table>
        </div>
      </div>
    </wrapper>
    <!-- 项目统计信息 -->
    <FormItem
      ref="statisticsFormItem"
      :layout="statisticsLayout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="statisticsForm"
    />
    <wrapper :key="'workContractTable'" :title="'承揽合同'" :isFold="false">
      <!-- 页面 -->
      <div class="content-view">
        <div class="Modeltable">
          <page-table
            ref="workContractTable"
            col-align="left"
            operator-width="110"
            :data="workContractTableData"
            :cols="workContractTableCols"
            :selection="false"
            :showPage="false"
            :operator="false"
            :hideDefaultIndex="true"
            :showSummary="false"
            reserveSelection
            :row-key="getRowKey"
          >
          </page-table>
        </div>
      </div>
    </wrapper>
    <wrapper :key="'cooperativeContractTable'" :title="'合作合同'" :isFold="false">
      <!-- 页面 -->
      <div class="content-view">
        <div class="Modeltable">
          <page-table
            ref="cooperativeContractTable"
            col-align="left"
            operator-width="110"
            :data="cooperativeContractTableData"
            :cols="cooperativeContractTableCols"
            :selection="false"
            :showPage="false"
            :operator="false"
            :hideDefaultIndex="true"
            :showSummary="false"
            reserveSelection
            :row-key="getRowKey"
          >
          </page-table>
        </div>
      </div>
    </wrapper>
    <!-- 送审信息 -->
    <FormItem
      ref="submitFormItem"
      :layout="submitLayout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="submitForm"
    />

    <div class="flex-row">
      <div class="flex-row-column">
        <wrapper :key="'progress'" :title="'进度信息'" :isFold="false">
          <div class="first-progress">
            <div class="first-progress-info">
              <span>形象进度</span>
              <div>
                <span class="current-progress">{{ progressInfo['AmountVal-1'] }}</span>
                <span>/</span>
                <span>{{ progressInfo['AmountVal-2'] }}</span>
              </div>
            </div>
            <el-progress :percentage="progressInfo['AmountVal-3']" :color="'#367fa9'" :show-text="false" />
          </div>
          <div class="second-progress">
            <div class="second-progress-info">
              <span>计划进度</span>
              <div>
                <span class="current-progress">{{ progressInfo['DateVal-1'] }}</span>
                <span>/</span>
                <span>{{ progressInfo['DateVal-2'] }}</span>
              </div>
            </div>
            <el-progress :percentage="progressInfo['DateVal-3']" :color="'#ffb800'" :show-text="false" />
          </div>
        </wrapper>
      </div>
      <div class="flex-row-column">
        <!-- 财务信息 -->
        <FormItem
          ref="financeFormItem"
          :layout="financeLayout"
          :rules="formRules"
          :disabled="inputDisabled"
          :isEdit="isEdit"
          :form.sync="financeForm"
        />
      </div>
    </div>

    <edit
      :show="editshow"
      :data="editdata"
      :title="editTitle"
      :width="editWidth"
      @cancel="closeEdit"
      @success="handleSuccess"
    />
  </div>
</template>

<script>
import projectBaseInfo from '@/view/common/projectInfo/projectBaseInfo';
import FormItem from '@/components/formItem';
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import {
  projectDetailInfo,
  selectByCondition,
  getCooContractList,
  getHireContractList,
  deleteProjectTemp,
  getSchedules,
} from '@/api/common';
export default {
  name: 'projectDetailShow',
  inject: ['common'],
  props: {
    data: {},
    spanLength: {
      type: Number,
      default: 8,
    },
    amountShowProgress: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    projectBaseInfo,
    FormItem,
    Wrapper,
    PageTable,
    Flex,
    Edit,
  },
  data() {
    return {
      info: {},
      inputDisabled: true,
      isEdit: false,
      statisticsForm: {},
      statisticsLayout: [
        {
          title: '项目统计信息',
          formItems: [
            {
              label: '承揽合同额',
              prop: 'hireContractAmount',
              inputType: 'inputNumber',
              span: this.spanLength,
            },
            {
              label: '送审金额',
              prop: 'submitMoney',
              inputType: 'input',
              span: this.spanLength,
            },
            {
              label: '定案金额',
              prop: 'verdictAmount',
              inputType: 'inputNumber',
              span: this.spanLength,
            },
            {
              label: '审定金额',
              prop: 'authorizeAmount',
              inputType: 'inputNumber',
              span: this.spanLength,
            },
            {
              label: '审减率',
              prop: 'reductionRate',
              inputType: 'input',
              span: this.spanLength,
            },
            {
              label: '合作合同额',
              prop: 'cooperationContractAmount',
              inputType: 'inputNumber',
              span: this.spanLength,
            },
            {
              label: '合作单位数',
              prop: 'cooperationUnitCount',
              inputType: 'input',
              span: this.spanLength,
            },
          ],
        },
      ],
      submitForm: {},
      submitLayout: [
        {
          title: '送审信息',
          formItems: [
            {
              label: '送审金额',
              prop: 'submitMoney',
              inputType: 'inputNumber',
              span: this.spanLength,
            },
            {
              label: '定案总额',
              prop: 'verdictAmount',
              inputType: 'inputNumber',
              span: this.spanLength,
            },
            {
              label: '送审时间',
              prop: 'submitTime',
              inputType: 'input',
              span: this.spanLength,
            },
            {
              label: '施工费',
              prop: 'constructionNotCost',
              inputType: 'inputNumber',
              span: this.spanLength,
            },
            {
              label: '施工费税率',
              prop: 'constructionCostTaxRate',
              inputType: 'select',
              span: this.spanLength,
              options: this.common().taxRateCode,
            },
            {
              label: '施工税',
              prop: 'constructionMoney',
              inputType: 'inputNumber',
              span: this.spanLength,
            },
            {
              label: '材料费',
              prop: 'constructionMoney',
              inputType: 'inputNumber',
              span: this.spanLength,
            },
            {
              label: '材料费税率',
              prop: 'materialCostTaxRate',
              inputType: 'select',
              span: this.spanLength,
              options: this.common().taxRateCode,
            },
            {
              label: '材料税',
              prop: 'materialMoney',
              inputType: 'inputNumber',
              span: this.spanLength,
            },
            {
              label: '总施工费',
              prop: 'constructionTotal',
              inputType: 'inputNumber',
              span: this.spanLength,
            },
            {
              label: '总材料费',
              prop: 'materialTotal',
              inputType: 'inputNumber',
              span: this.spanLength,
            },
            {
              label: '其他',
              prop: 'other',
              inputType: 'input',
              span: this.spanLength,
            },
            {
              label: '审减率',
              prop: 'reductionRate',
              inputType: 'input',
              span: this.spanLength,
            },
          ],
        },
      ],
      financeForm: {},
      financeLayout: [
        {
          title: '财务信息',
          formItems: [
            {
              label: '累计开票额',
              prop: 'invoiceAmount',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '累计回款数',
              prop: 'recordCount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '累计付款数',
              prop: 'payAmount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '累计收票额',
              prop: 'receiveAmount',
              inputType: 'inputNumber',
              span: 12,
            },
          ],
        },
      ],
      formRules: {},
      amountTableData: [],
      amountTableCols: [
        {
          label: 'ERP编码',
          prop: 'erpNumber',
          align: 'center',
        },
        {
          label: '累计已回款',
          prop: 'projectCumulativeAmount',
          align: 'center',
        },
        {
          label: '累计已开总包发票',
          prop: 'zbinvoiceTotalAmount',
          align: 'center',
        },
      ],
      workContractTableData: [],
      workContractTableCols: [
        {
          label: '承揽订单',
          prop: 'orderId',
          align: 'center',
          width: 200,
        },
        {
          label: 'ERP编码',
          prop: 'erpId',
          align: 'center',
          width: 200,
          render: (h, scope) =>
            h(
              'span',
              {
                class: {
                  canClick: true,
                },
                on: {
                  click: () => {
                    this.openDialog('workContractDetail', {
                      row: scope.row,
                      type: 'workContractDetail',
                      configType: 'detail',
                    });
                  },
                },
              },
              scope.row.erpId,
            ),
        },
        {
          label: '大项名称',
          prop: 'projectName',
          align: 'center',
          width: 200,
        },
        {
          label: '大项编号',
          prop: 'projectCode',
          align: 'center',
          width: 200,
        },
        {
          label: '承揽框架编号',
          prop: 'hireId',
          align: 'center',
          width: 200,
        },
        {
          label: '承揽框架',
          prop: 'hireIdName',
          align: 'center',
          width: 200,
        },
        {
          label: '单项名称',
          prop: 'orderName',
          align: 'center',
          width: 200,
        },
        {
          label: '记税方式',
          prop: 'taxTypeName',
          align: 'center',
          width: 200,
        },
        {
          label: '合同总额',
          prop: 'contractAmount',
          align: 'center',
          width: 200,
        },
        {
          label: '施工费',
          prop: 'construction',
          align: 'center',
          width: 200,
        },
        {
          label: '施工税',
          prop: 'constructionTax',
          align: 'center',
          width: 200,
        },
        {
          label: '施工费税率',
          prop: 'constructionRateName',
          align: 'center',
          width: 200,
        },
        {
          label: '施工费合计',
          prop: 'constructionAll',
          align: 'center',
          width: 200,
        },
        {
          label: '材料费',
          prop: 'material',
          align: 'center',
          width: 200,
        },
        {
          label: '材料税',
          prop: 'materialTax',
          align: 'center',
          width: 200,
        },
        {
          label: '材料费税率',
          prop: 'materialRateName',
          align: 'center',
          width: 200,
        },
        {
          label: '总材料费',
          prop: 'materialAll',
          align: 'center',
          width: 200,
        },
        {
          label: '安全生产费',
          prop: 'security',
          align: 'center',
          width: 200,
        },
        {
          label: '签订日期',
          prop: 'signDate',
          align: 'center',
          width: 200,
        },
        {
          label: '合同状态名称',
          prop: 'contractStatusName',
          align: 'center',
          width: 200,
        },
        {
          label: '备注',
          prop: 'remark',
          align: 'center',
          width: 200,
        },
      ],
      cooperativeContractTableData: [],
      cooperativeContractTableCols: [
        {
          label: '合同名称',
          prop: 'contractName',
          align: 'center',
          width: 200,
        },
        {
          label: '合同编号',
          prop: 'contractNo',
          align: 'center',
          width: 200,
          render: (h, scope) =>
            h(
              'span',
              {
                class: {
                  canClick: true,
                },
                on: {
                  click: () => {
                    this.openDialog('cooperativeContractDetail', {
                      row: scope.row,
                      type: 'cooperativeContractDetail',
                      configType: 'detail',
                    });
                  },
                },
              },
              scope.row.contractNo,
            ),
        },
        {
          label: '合同状态',
          prop: 'contractStatus',
          align: 'center',
          width: 200,
        },
        {
          label: '合同类型',
          prop: 'contractType',
          align: 'center',
          width: 200,
        },
        {
          label: '合同金额',
          prop: 'contractAll',
          align: 'center',
          width: 200,
        },
        {
          label: '累计已收分包发票',
          prop: 'fbinvoiceTotalAmount',
          align: 'center',
          width: 200,
        },
        {
          label: '累计已收预缴税票',
          prop: 'pretaxTotalAmount',
          align: 'center',
          width: 200,
        },
        {
          label: '累计应付款',
          prop: 'payableTotalAmount',
          align: 'center',
          width: 200,
        },
        {
          label: '累计付款',
          prop: 'paymentTotalAmount',
          align: 'center',
          width: 200,
        },
        {
          label: '主体',
          prop: 'subject',
          align: 'center',
          width: 200,
        },
        {
          label: '计税方式',
          prop: 'taxType',
          align: 'center',
          width: 200,
        },
        {
          label: 'ERP编号',
          prop: 'erpId',
          align: 'center',
          width: 200,
        },
        {
          label: '订单编号',
          prop: 'orderId',
          align: 'center',
          width: 200,
        },
        {
          label: '文件数',
          prop: 'documents',
          align: 'center',
          width: 200,
        },
        {
          label: '存档日期',
          prop: 'documentDate',
          align: 'center',
          width: 200,
        },
        {
          label: '施工费合计',
          prop: 'constructionAll',
          align: 'center',
          width: 200,
        },
        {
          label: '施工费',
          prop: 'construction',
          align: 'center',
          width: 200,
        },
        {
          label: '施工税率',
          prop: 'constructionRate',
          align: 'center',
          width: 200,
        },
        {
          label: '施工税',
          prop: 'constructionTax',
          align: 'center',
          width: 200,
        },
        {
          label: '总材料费',
          prop: 'materialAll',
          align: 'center',
          width: 200,
        },
        {
          label: '材料费',
          prop: 'material',
          align: 'center',
          width: 200,
        },
        {
          label: '材料费税率',
          prop: 'materialRate',
          align: 'center',
          width: 200,
        },
        {
          label: '材料税',
          prop: 'materialTax',
          align: 'center',
          width: 200,
        },
        {
          label: '预缴税',
          prop: 'provisionalTax',
          align: 'center',
          width: 200,
        },
        {
          label: '其他费用',
          prop: 'other',
          align: 'center',
          width: 200,
        },
        {
          label: '设计单位',
          prop: 'design',
          align: 'center',
          width: 200,
        },
        {
          label: '创建人',
          prop: 'createPeople',
          align: 'center',
          width: 200,
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
          width: 200,
        },
        {
          label: '安全生产费',
          prop: 'security',
          align: 'center',
          width: 200,
        },
        {
          label: '备注',
          prop: 'remark',
          align: 'center',
          width: 200,
        },
        {
          label: '签订日期',
          prop: 'signDate',
          align: 'center',
          width: 200,
        },
        {
          label: '审核状态',
          prop: 'statusName',
          align: 'center',
          width: 200,
        },
      ],
      progressInfo: {},
      editshow: false,
      editdata: {},
      editTitle: '',
      editWidth: '900px',
      accountProgress: {
        paySchedule: '0%',
        paybackSchedule: '0%',
      },
    };
  },
  methods: {
    init() {
      projectDetailInfo(this.data.row.id).then((res) => {
        if (res.code === '200') {
          this.info = res.data;
          this.statisticsForm = res.data.InfoProjectTotalDtoModel;
          this.submitForm = res.data.InfoExamineDtoModel;
          this.financeForm = res.data.InfoFinancialDtoModel;

          const amountProgress = res.data.InfoProgressDtoModel['AmountVal-3'];
          const dataProgress = res.data.InfoProgressDtoModel['DateVal-3'];
          const firstProgress = amountProgress.substring(0, amountProgress.length - 1);
          const secondProgress = dataProgress.substring(0, dataProgress.length - 1);

          this.progressInfo = {
            ...res.data.InfoProgressDtoModel,
            'AmountVal-3': parseFloat(firstProgress) > 100 ? 100 : parseFloat(firstProgress),
            'DateVal-3': parseFloat(secondProgress) > 100 ? 100 : parseFloat(secondProgress),
          };
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    // 预览
    openDialog(state, info = {}) {
      const title = {
        workContractDetail: '承揽合同详情',
        cooperativeContractDetail: '合同合作查看',
        editProjectAmount: `${info.configType === 'add' ? '新增' : '修改'}项目金额`,
      };
      const width = {
        workContractDetail: '1150px',
        cooperativeContractDetail: '1150px',
        editProjectAmount: '1150px',
      };

      this.editTitle = title[info.type];
      this.editWidth = width[info.type];
      this.editshow = true;
      this.editdata = info;
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },

    handleSuccess(type) {
      this.editshow = false;
      if (type === 'editProjectAmount') {
        this.getAccountTable();
      }
    },
    summaryMethod(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          const { paybackSchedule, paySchedule } = this.accountProgress;

          sums[index] = this.amountShowProgress ? `回款进度:${paybackSchedule},付款进度:${paySchedule}` : '合计';

          return;
        }
        const values = data.map((item) => Number(item[column.property]));

        if (column.property === 'projectCumulativeAmount' || column.property === 'zbinvoiceTotalAmount') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);

            if (!isNaN(value)) {
              return prev + curr;
            }

            return prev;
          }, 0);
          sums[index] = sums[index].toFixed(2);
          this.totalMoney = sums[index];
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },

    getAccountTable() {
      const params = {
        data: {
          erpNumber: this.data.row.erpNumber,
        },
        pageNo: 1,
        pageSize: 10000,
        sorting: 'id desc',
      };

      selectByCondition(params).then((res) => {
        if (res.code === '200') {
          const { data } = res.data;

          this.amountTableData = data;
        }
      });
    },

    getContractTableData() {
      const params = {
        data: {
          erpId: this.data.row.erpNumber,
        },
        pageNo: 1,
        pageSize: 10000,
        sorting: 'id desc',
      };

      getCooContractList(params).then((res) => {
        if (res.code === '200') {
          const { data } = res.data;

          this.cooperativeContractTableData = data;
        }
      });
    },

    getWorkContractTableData() {
      const params = {
        data: {
          erpId: this.data.row.erpNumber,
        },
        pageNo: 1,
        pageSize: 10000,
        sorting: 'id desc',
      };

      getHireContractList(params).then((res) => {
        if (res.code === '200') {
          const { data } = res.data;

          this.workContractTableData = data;
        }
      });
    },

    handleEdit(type, row = {}) {
      this.openDialog('editProjectAmount', {
        row: {
          ...row,
          erpNumber: this.info.InfoProjectBaseDtoModel.erpNumber,
          projectID: this.info.InfoProjectBaseDtoModel.projectID,
        },
        type: 'editProjectAmount',
        configType: type,
      });
    },

    // 删除项目累积金额
    handleDelete(row) {
      this.$confirm('确定删除项目金额?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deleteProjectTemp(row.id).then((res) => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right',
            });
            this.getAccountTable();
          }
        });
      });
    },

    getAccountProgress() {
      return new Promise((resolve) => {
        getSchedules(this.data.row.erpNumber).then((res) => {
          if (res.code === '200') {
            this.accountProgress = res.data;
          }
          resolve();
        });
      });
    },
  },
  created() {
    this.init();
    this.getContractTableData();
    this.getWorkContractTableData();
    if (this.amountShowProgress) {
      this.getAccountProgress().then(() => {
        this.getAccountTable();
      });
    } else {
      this.getAccountTable();
    }
  },
};
</script>

<style scoped lang="less">
.projectDetailShow {
  .comp-page-table {
    min-height: unset;
  }
  .flex-row {
    display: flex;
    justify-content: space-between;
    &-column {
      width: 49.5%;
    }
  }
  .first-progress,
  .second-progress {
    color: #333;
    margin: 15px 0;
    .first-progress-info,
    .second-progress-info {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      .current-progress {
        font-weight: bold;
      }
    }
  }

  /deep/ .canClick {
    cursor: pointer;
    color: #4caae0;
  }
  .comp-wrapper {
    position: relative;
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
    top: 7px;
    z-index: 10;
    border-radius: 4px;
  }
}
</style>
