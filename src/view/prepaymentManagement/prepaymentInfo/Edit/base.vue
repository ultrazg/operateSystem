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
    >
      <!-- 合作发票 -->
      <template slot="cooperative">
        <otherBtnList v-if="data.configType !== 'detail' && form.hireOrderId">
          <ul class="flexRow">
            <li
              v-for="(item, index) in cooperativeBtnLists"
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
          ref="cooperativeTable"
          col-align="left"
          :data="cooperativeList"
          :cols="cooperativeCols"
          :selection="false"
          :operator="data.configType !== 'detail'"
          :showPage="false"
          operator-width="110"
          :hideDefaultIndex="true"
          reserveSelection
        >
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="编辑"
                icon="iconfont icon-bianji"
                v-if="!scope.row.editRow && !scope.row.taxDetailId"
                @click.prevent.stop="
                  tableCooperativeAction('edit', {
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
                  tableCooperativeAction('save', {
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
                v-if="!scope.row.taxDetailId || data.row.auditStatus === 'verify_draft'"
                @click.prevent.stop="
                  tableCooperativeAction('del', {
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
    <subpackageInvoice
      ref="cooperativeSelect"
      :highlightCurrentRow="false"
      :show="cooperativeShow"
      :data="cooperativeData"
      @cancel="closeCooperative"
      @success="successCooperative"
    />
    <projectSelect
      ref="projectSelect"
      :highlightCurrentRow="true"
      :show="projectShow"
      :data="projectData"
      @cancel="closeProject"
      @success="successProject"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import otherBtnList from '@/components/headerTitle/otherBtnList';
import subpackageInvoice from '@/view/common/prepaymentInfo/subpackageInvoice.vue';
import projectSelect from '@/view/common/prepaymentInfo/projectSelect.vue';
import { detail, add, update } from '@/api/prepaymentManagement/prepaymentInfo';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
    otherBtnList,
    PageTable,
    Flex,
    subpackageInvoice,
    projectSelect,
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
          title: '承揽订单信息',
          formItems: [
            {
              label: '承揽订单编号',
              prop: 'hireOrderId',
              inputType: 'input',
              span: 12,
              onFocus: () => {
                this.projectData = {};
                this.projectShow = true;
              },
            },
            {
              label: 'ERP编码',
              prop: 'erpNumber',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '本次预缴税金合计',
              prop: 'totalAmount',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
          ],
        },
        {
          title: '预缴税金登记信息',
          formItems: [],
          render: 'cooperative',
        },
      ],
      formRules: {
        hireOrderId: {
          required: true,
          message: '请选择承揽订单编号',
          trigger: ['change', 'blur'],
        },
      },
      cooperativeBtnLists: [
        {
          label: '新增',
          click: () => this.addCooperative(),
        },
      ],
      cooperativeData: {},
      cooperativeIndex: -1,
      cooperativeShow: false,
      cooperativedeleList: [],
      cooperativeList: [],
      cooperativeCols: [
        {
          label: '本次预缴税金',
          prop: 'advanceTax',
          align: 'center',
          width: '100px',
          render: (h, scope) => <div>{scope.row.advanceTax && Number(scope.row.advanceTax).toFixed(2)}</div>,
        },
        {
          label: '分包发票代码',
          prop: 'subcontractInvoiceCode',
          align: 'center',
          width: '100px',
        },
        {
          label: '分包发票号码',
          prop: 'subcontractInvoiceNum',
          align: 'center',
          width: '100px',
        },
        {
          label: '分包发票金额(含税)',
          prop: 'subcontractInvoiceAmountTax',
          align: 'center',
          width: '130px',
        },
        {
          label: '分配金额',
          prop: 'subcontractInvoiceAmount',
          align: 'center',
          width: '100px',
        },
        {
          label: '合作比例',
          prop: 'cooperationRatio',
          align: 'center',
          width: '100px',
        },
        {
          label: '对应总包金额',
          prop: 'totalPkgAmount',
          align: 'center',
          width: '100px',
        },
        {
          label: '增值税预缴税款',
          prop: 'vatPrepayment',
          align: 'center',
          width: '110px',
          render: (h, scope) => {
            const d = scope.row;
            const { vatPrepayment } = scope.row;

            let html = vatPrepayment;

            if (d.editRow) {
              html = (
                <el-input-number
                  precision={2}
                  class="editInput"
                  controls={false}
                  value={scope.row[scope.column.property] || ''}
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
          label: '城建税',
          prop: 'cityTax',
          align: 'center',
          width: '100px',
          render: (h, scope) => {
            const d = scope.row;
            const { cityTax } = scope.row;

            let html = cityTax;

            if (d.editRow) {
              html = (
                <el-input-number
                  precision={2}
                  class="editInput"
                  controls={false}
                  value={scope.row[scope.column.property] || ''}
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
          label: '教育费附加',
          prop: 'eduSurcharge',
          align: 'center',
          width: '100px',
          render: (h, scope) => {
            const d = scope.row;
            const { eduSurcharge } = scope.row;

            let html = eduSurcharge;

            if (d.editRow) {
              html = (
                <el-input-number
                  precision={2}
                  class="editInput"
                  controls={false}
                  value={scope.row[scope.column.property] || ''}
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
          label: '地方教育费附加',
          prop: 'localEduSurcharge',
          align: 'center',
          width: '130px',
          render: (h, scope) => {
            const d = scope.row;
            const { localEduSurcharge } = scope.row;

            let html = localEduSurcharge;

            if (d.editRow) {
              html = (
                <el-input-number
                  precision={2}
                  class="editInput"
                  controls={false}
                  value={scope.row[scope.column.property] || ''}
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
          label: '防洪费',
          prop: 'controlFloodAmount',
          align: 'center',
          width: '100px',
          render: (h, scope) => {
            const d = scope.row;
            const { controlFloodAmount } = scope.row;

            let html = controlFloodAmount;

            if (d.editRow) {
              html = (
                <el-input-number
                  precision={2}
                  class="editInput"
                  controls={false}
                  value={scope.row[scope.column.property] || ''}
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
          label: '价格调节基金',
          prop: 'priceAdjustmentFund',
          align: 'center',
          width: '100px',
          render: (h, scope) => {
            const d = scope.row;
            const { priceAdjustmentFund } = scope.row;

            let html = priceAdjustmentFund;

            if (d.editRow) {
              html = (
                <el-input-number
                  precision={2}
                  class="editInput"
                  controls={false}
                  value={scope.row[scope.column.property] || ''}
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
          label: '个人所得税',
          prop: 'individualIncometax',
          align: 'center',
          width: '100px',
          render: (h, scope) => {
            const d = scope.row;
            const { individualIncometax } = scope.row;

            let html = individualIncometax;

            if (d.editRow) {
              html = (
                <el-input-number
                  precision={2}
                  class="editInput"
                  controls={false}
                  value={scope.row[scope.column.property] || ''}
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
          label: '企业所得税',
          prop: 'corporateIncomeTax',
          width: '100px',
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;
            const { corporateIncomeTax } = scope.row;

            let html = corporateIncomeTax;

            if (d.editRow) {
              html = (
                <el-input-number
                  precision={2}
                  class="editInput"
                  controls={false}
                  value={scope.row[scope.column.property] || ''}
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
          label: '印花税',
          prop: 'stampDuty',
          width: '100px',
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;
            const { stampDuty } = scope.row;

            let html = stampDuty;

            if (d.editRow) {
              html = (
                <el-input-number
                  precision={2}
                  class="editInput"
                  controls={false}
                  value={scope.row[scope.column.property] || ''}
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
          label: '其他税费',
          prop: 'otherTaxes',
          width: '100px',
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;
            const { otherTaxes } = scope.row;

            let html = otherTaxes;

            if (d.editRow) {
              html = (
                <el-input-number
                  precision={2}
                  class="editInput"
                  controls={false}
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changeInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input-number>
              );
            }

            return <div>{html}</div>;
          },
        },
      ],
      projectShow: false,
      projectData: {},
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
          this.form = {
            ...this.form,
            ...res.data,
            id: row.id,
          };
          this.cooperativeList = res.data.detailCommandList;
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

      if (this.cooperativeList.length === 0) {
        this.$notifyError('请先绑定对应的预缴税登记信息');

        return;
      }
      let checkEditRow = false;

      this.cooperativeList.forEach((listItem) => {
        if (listItem.editRow) {
          checkEditRow = true;
        }
      });
      if (checkEditRow) {
        this.$notifyError('请先保存新增的预缴税登记信息');

        return;
      }
      let param = {
        ...val,
        detailCommandList: [...this.cooperativeList, ...this.cooperativedeleList],
      };

      let api = add;
      // 新增采购信息

      let message = '新增成功';

      if (id) {
        param = {
          ...param,
          id: `${id}`,
        };
        message = '更新成功';
        api = update;
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
    // 绑定新合作发票
    addCooperative() {
      this.cooperativeShow = true;
      setTimeout(() => {
        if (this.$refs.cooperativeSelect) {
          this.$refs.cooperativeSelect.onRowChange(this.cooperativeList);
        }
      }, 500);
    },
    // 关闭合作发票
    closeCooperative() {
      this.cooperativeShow = false;
      this.cooperativeData = {};
    },
    // 成功绑定合作发票
    successCooperative(selectTables) {
      console.log('selectTables', selectTables);
      selectTables.forEach((selectTable) => {
        const cooperativeIndex = this.cooperativeList.findIndex(
          (listItem) => listItem.invoiceDetailId === selectTable.invoiceDetailId,
        );

        if (cooperativeIndex === -1) {
          this.cooperativeList = this.cooperativeList.concat([
            {
              ...selectTable,
              subcontractInvoiceCode: selectTable.invoiceCode,
              subcontractInvoiceNum: selectTable.invoiceNumber,
              subcontractInvoiceAmountTax: selectTable.invoiceAmount,
              subcontractInvoiceAmount: selectTable.distributeAmount,
              cooperationRatio: selectTable.ratio,
              ...this.sumTax(selectTable),
              editRow: true,
            },
          ]);
        } else if (!this.cooperativeList[cooperativeIndex].taxDetailId) {
          this.cooperativeList.splice(cooperativeIndex, 1, {
            ...selectTable,
            subcontractInvoiceCode: selectTable.invoiceCode,
            subcontractInvoiceNum: selectTable.invoiceNumber,
            subcontractInvoiceAmountTax: selectTable.invoiceAmount,
            subcontractInvoiceAmount: selectTable.distributeAmount,
            cooperationRatio: selectTable.ratio,
            ...this.sumTax(selectTable),
            editRow: true,
          });
        }
      });

      this.$nextTick(() => {
        this.closeCooperative();
      });
    },
    sumTax(table) {
      const constructionCostTaxRateOptions = {
        9: 0.02,
        3: 0.03,
      };
      const { constructionRate } = this.form;
      const { totalPkgAmount, subcontractInvoiceAmount } = table;

      if (!constructionRate) {
        return;
      }
      const taxRate = this.common().taxRateCode.filter((status) => status.name === constructionRate);
      const taxRateValue = taxRate && taxRate[0] && taxRate[0].value;
      const vatPrepayment =
        (parseFloat(totalPkgAmount || 0) - parseFloat(subcontractInvoiceAmount || 0)) /
        (1.09 * (constructionCostTaxRateOptions[Number(taxRateValue)] || 0));
      const cityTax = vatPrepayment * 0.07;
      const eduSurcharge = vatPrepayment * 0.03;
      const localEduSurcharge = vatPrepayment * 0.02;

      console.log('vatPrepayment', vatPrepayment);

      return {
        vatPrepayment,
        cityTax,
        eduSurcharge,
        localEduSurcharge,
      };
    },
    // 输入框改变
    changeInput(val, index, name) {
      this.cooperativeList[index] = {
        ...this.cooperativeList[index],
        [name]: val,
      };
      this.sumTotal(index);
      this.cooperativeList.splice(1, 0);
    },
    sumTotal(index) {
      const {
        vatPrepayment,
        cityTax,
        eduSurcharge,
        localEduSurcharge,
        controlFloodAmount,
        priceAdjustmentFund,
        individualIncometax,
        corporateIncomeTax,
        stampDuty,
        otherTaxes,
      } = this.cooperativeList[index];

      this.cooperativeList[index] = {
        ...this.cooperativeList[index],
        advanceTax:
          parseFloat(vatPrepayment || 0) +
          parseFloat(cityTax || 0) +
          parseFloat(eduSurcharge || 0) +
          parseFloat(localEduSurcharge || 0) +
          parseFloat(controlFloodAmount || 0) +
          parseFloat(priceAdjustmentFund || 0) +
          parseFloat(individualIncometax || 0) +
          parseFloat(corporateIncomeTax || 0) +
          parseFloat(stampDuty || 0) +
          parseFloat(otherTaxes || 0),
      };
      this.sumTotalAmount();
    },
    sumTotalAmount() {
      let totalAmount = 0;

      this.cooperativeList.forEach((listItem) => {
        totalAmount = parseFloat(totalAmount || 0) + parseFloat(listItem.advanceTax || 0);
      });
      this.form = {
        ...this.form,
        totalAmount,
      };
    },
    tableCooperativeAction(type, row) {
      // console.log('row', row);
      const { data } = row;

      if (type === 'edit') {
        this.cooperativeList[row.index] = {
          ...this.cooperativeList[row.index],
          editRow: true,
        };
        this.editRow = true;
        this.cooperativeList.splice(1, 0);
      }
      if (type === 'save') {
        this.handleUpdateSplit(row.index);
      }
      if (type === 'del') {
        if (data.taxDetailId) {
          this.cooperativedeleList.push({
            ...this.cooperativeList[row.index],
            webDelete: 1,
          });
        }
        this.cooperativeList.splice(row.index, 1);

        this.sumTotalAmount();
      }
    },
    // 保存
    handleUpdateSplit(index) {
      // const { fbinvoiceTotalAmount, payableTotalAmount, paymentTotalAmount, pretaxTotalAmount, id } =
      //   this.cooperativeList[index];

      // if (!fbinvoiceTotalAmount || !payableTotalAmount || !paymentTotalAmount || !pretaxTotalAmount) {
      //   this.$notifyError('请先完整输入信息:防洪费、价格调节基金、个人所得税、企业所得税、印花税、其他税费！');
      // }
      this.cooperativeList[index] = {
        ...this.cooperativeList[index],
        editRow: false,
      };
      this.editRow = false;
      this.cooperativeList.splice(1, 0);
    },
    // 关闭承揽订单
    closeProject() {
      this.projectShow = false;
      this.projectData = {};
    },
    // 成功绑定承揽订单
    successProject(selectTables) {
      console.log('selectTables', selectTables);
      this.form = {
        ...this.form,
        hireOrderId: selectTables.orderId,
        erpNumber: selectTables.erpNumber,
        constructionRate: selectTables.constructionRate,
      };
      this.$nextTick(() => {
        this.closeProject();
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
}
</style>
