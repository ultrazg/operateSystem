<template>
  <div id="base">
    <otherBtnList style="margin-bottom: 12px" v-if="!inputDisabled">
      <ul class="flexRow">
        <li
          v-for="(item, index) in invoiceOtherBtnLists"
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
      ref="pageTable"
      col-align="left"
      :showPage="false"
      :operator="true"
      :row-key="getRowKey"
      :data="invoiceTableData"
      :cols="invoiceTableCols"
    >
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
    <page-table
      ref="pageTable"
      col-align="left"
      :showPage="false"
      :operator="false"
      :row-key="getRowKey"
      :data="beforeTableData"
      :cols="beforeTableCols"
    >
    </page-table>
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      labelWidth="130px"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import PageTable from '@/components/page-table';
import otherBtnList from '@/components/headerTitle/otherBtnList';
import Flex from '@/components/flex';
import { backfillAddList, backfillSave } from '@/api/receivableManagement/receivableEnter';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
    PageTable,
    otherBtnList,
    Flex,
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
      invoiceOtherBtnLists: [
        {
          label: '新增',
          click: () => this.addRow(),
        },
      ],
      invoiceTableData: [],
      invoiceTableCols: [
        {
          label: '应收发票代码',
          prop: 'invoiceCode',
          width: '120px',
          render: (h, scope) => {
            const d = scope.row;
            const html = scope.row.invoiceCode;

            if (d.editRow) {
              return (
                <div>
                  {
                    <el-input
                      class="editInput"
                      value={scope.row[scope.column.property] || ''}
                      onInput={(val) => {
                        this.changeInput(val, scope.$index, scope.column.property);
                      }}
                    ></el-input>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '应收发票号码',
          prop: 'invoiceNumber',
          width: '120px',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.invoiceNumber;

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
          label: '开票日期',
          prop: 'createTime',
          width: '120px',
          render: (h, scope) => {
            const d = scope.row;
            const html = scope.row.createTime;

            if (d.editRow) {
              return (
                <div>
                  {
                    <el-date-picker
                      class="editInput"
                      type="datetime"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      value={scope.row[scope.column.property] || ''}
                      onInput={(val) => {
                        this.changeInput(val, scope.$index, scope.column.property);
                      }}
                    ></el-date-picker>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '开票金额(含税)',
          prop: 'invoiceAmount',
          width: '130px',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.invoiceAmount;

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
          prop: 'invoiceRate',
          width: '100px',
          render: (h, scope) => {
            const d = scope.row;
            const { taxRateCode } = this.common();
            const rateItem = taxRateCode.filter((code) => code.code === d.invoiceRate);

            const html = rateItem && rateItem[0] && rateItem[0].name;

            if (d.editRow) {
              return (
                <div>
                  {
                    <el-select
                      class="editInput"
                      value={scope.row[scope.column.property] || ''}
                      onChange={(val) => {
                        this.changeSelect(val, scope.$index, scope.column.property);
                      }}
                    >
                      {taxRateCode.map((data) => (
                        <el-option label={data.name} value={data.code}></el-option>
                      ))}
                    </el-select>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '开票金额(不含税)',
          width: '130px',
          prop: 'noTaxInvoiceAmount',
        },
        {
          label: '发票类型',
          prop: 'invoiceType',
          width: '100px',
          render: (h, scope) => {
            const d = scope.row;

            const { invoiceType } = this.common();
            const invoiceItem = invoiceType.filter((code) => code.id === d.invoiceType);

            const html = invoiceItem && invoiceItem[0] && invoiceItem[0].name;

            if (d.editRow) {
              return (
                <div>
                  {
                    <el-select
                      class="editInput"
                      value={scope.row[scope.column.property] || ''}
                      onChange={(val) => {
                        this.changeSelect(val, scope.$index, scope.column.property);
                      }}
                    >
                      {invoiceType.map((data) => (
                        <el-option label={data.name} value={data.id}></el-option>
                      ))}
                    </el-select>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
      ],
      layout: [
        {
          title: '回填信息',
          formItems: [
            {
              label: '开票总金额(含税)',
              prop: 'totalInvoiceAmount',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '开票总金额(不含税)',
              prop: 'noTaxTotalInvoiceAmount',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '实际分配总金额(含税)',
              prop: 'actualTotalDistributeAmount',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '上传附件',
              prop: 'fileDTOList',
              disabled: false,
              placeholder: '支持pdf/.jpg/.png格式文件',
              limit: 5,
              accept: '.jpg, .png, .pdf, .jpeg',
              inputType: 'upload',
              params: {
                filePath: 'fileUpload',
                serviceCode: this.routerCode,
              },
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        fileDTOList: {
          required: true,
          message: '请选择上传附件',
          trigger: 'blur',
        },
      },
      beforeTableData: [],
      beforeTableCols: [
        {
          label: 'ERP 编号',
          prop: 'erpNumber',
        },
        {
          label: '承揽订单',
          prop: 'orderId',
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
          label: '实际分配金额(含税)',
          prop: 'distributeAmount',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.distributeAmount;

            if (true) {
              html = (
                <el-input-number
                  class="editInput"
                  precision={2}
                  controls={false}
                  value={scope.row[scope.column.property] || undefined}
                  min={scope.row[scope.column.property] - 0.05}
                  max={scope.row[scope.column.property] + 0.05}
                  onInput={(val) => {
                    this.changeBeforeInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input-number>
              );
            }

            return <div>{html}</div>;
          },
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
          label: '分配金额',
          prop: 'distributedAmount',
        },
      ],
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  watch: {
    data(val) {
      console.log('val', val);
      // this.data = val;
      this.inputDisabled = val.configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      // this.beforeTableData = val.row.multipleSelection;
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
    beforeTableData(val) {
      console.log('val', val);
      if (val) {
        this.$nextTick(() => {
          this.sumDistributeAmount();
        });
      }
    },
  },
  methods: {
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        backfillAddList({ batchId: row.id }).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              ...res.data,
            };
            this.beforeTableData = res.data.backfillAddReceivableDetailDTOList || [];
            this.invoiceTableData = res.data.receivableInvoiceBackfillDTOList || [];
            if (row.projectType === '3') {
              this.beforeTableCols[2].hide = false;
              this.beforeTableCols[3].hide = false;
            } else {
              this.beforeTableCols[2].hide = true;
              this.beforeTableCols[3].hide = true;
            }
          }
        });
      }
    },
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
      const { totalInvoiceAmount, actualTotalDistributeAmount } = this.form;

      if (Number(totalInvoiceAmount) !== Number(actualTotalDistributeAmount)) {
        this.$notifyError('请先确保开票总金额(含税)等于实际分配总金额(含税)');

        return;
      }
      const param = {
        ...val,
        batchId: row.id,
        backfillAddReceivableDetailDTOList: this.beforeTableData,
        receivableInvoiceBackfillDTOList: this.invoiceTableData,
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      const api = backfillSave;

      api(param).then((res) => {
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
    // 添加行
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

      this.invoiceTableData.push(list);
      this.invoiceTableData.splice(1, 0);
    },
    // 输入框改变
    changeInput(val, index, name) {
      const { invoiceRate } = this.invoiceTableData[index];

      if (name === 'invoiceAmount' && invoiceRate) {
        const { taxRateCode } = this.common();
        const rateItem = taxRateCode.filter((code) => code.code === invoiceRate);
        const taxValue = rateItem && rateItem[0] && rateItem[0].value;
        const taxRetaValue = taxValue / 100;
        const noTaxInvoiceAmount = Number(parseFloat(val || 0) / (1 + parseFloat(taxRetaValue || 0))).toFixed(2);

        this.invoiceTableData[index] = {
          ...this.invoiceTableData[index],
          noTaxInvoiceAmount,
        };
      }

      this.invoiceTableData[index] = {
        ...this.invoiceTableData[index],
        [name]: val,
      };

      this.invoiceTableData.splice(1, 0);
    },
    // 下拉框改变
    changeSelect(val, index, name, idName) {
      const item = this.invoiceTableData.map((data, i) => {
        if (i === index) {
          let addObj = {};

          if (idName && val instanceof Object) {
            addObj = {
              [idName]: val.id,
            };
          }
          const { invoiceAmount } = data;

          if (name === 'invoiceRate' && val && invoiceAmount) {
            const { taxRateCode } = this.common();
            const rateItem = taxRateCode.filter((code) => code.code === val);
            const taxValue = rateItem && rateItem[0] && rateItem[0].value;
            const noTaxInvoiceAmount = Number(
              parseFloat(invoiceAmount || 0) / (1 + parseFloat(taxValue || 0) / 100),
            ).toFixed(2);

            addObj = {
              ...addObj,
              noTaxInvoiceAmount,
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

      this.invoiceTableData = item;
      this.invoiceTableData.splice(1, 0);
    },
    // 操作表单
    tableAction(type, row) {
      const { index, id } = row;

      if (type === 'edit') {
        this.invoiceTableData[index] = {
          ...this.invoiceTableData[index],
          editRow: true,
        };
        this.editRow = true;
        this.invoiceTableData.splice(1, 0);
      }
      if (type === 'save') {
        const { invoiceCode, invoiceNumber } = this.invoiceTableData[index];

        if (!invoiceCode || !invoiceNumber) {
          this.$notifyError('请先完整输入信息:应收发票代码、应收发票号码');

          return;
        }
        this.invoiceTableData[index] = {
          ...this.invoiceTableData[index],
          editRow: false,
        };
        this.editRow = false;
        this.invoiceTableData.splice(1, 0);
        this.$nextTick(() => {
          this.sumInvoiceAmount();
        });
      }
      if (type === 'del') {
        // if (id) {
        //   this.$notifyError('该数据不可删除');

        //   return;
        // }
        this.invoiceTableData.splice(index, 1);
        this.editRow = false;
        this.$nextTick(() => {
          this.sumInvoiceAmount();
        });
      }
    },
    // 计算开票总金额(含税)、开票总金额(不含税)
    sumInvoiceAmount() {
      if (this.invoiceTableData.length === 0) {
        return;
      }
      let totalInvoiceAmount = 0;

      let noTaxTotalInvoiceAmount = 0;

      this.invoiceTableData.forEach((item) => {
        totalInvoiceAmount += parseFloat(item.invoiceAmount || 0);
        noTaxTotalInvoiceAmount += parseFloat(item.noTaxInvoiceAmount || 0);
      });
      this.form = {
        ...this.form,
        totalInvoiceAmount,
        noTaxTotalInvoiceAmount,
      };
    },

    changeBeforeInput(val, index, name) {
      if (!val) {
        return;
      }
      this.beforeTableData[index] = {
        ...this.beforeTableData[index],
        [name]: val,
      };
      this.beforeTableData.splice(1, 0);
    },
    // 计算实际分配总金额(含税)
    sumDistributeAmount() {
      if (!this.beforeTableData || this.beforeTableData.length === 0) {
        return;
      }
      let actualTotalDistributeAmount = 0;

      this.beforeTableData.forEach((item) => {
        actualTotalDistributeAmount += parseFloat(item.distributeAmount || 0);
      });
      this.form = {
        ...this.form,
        actualTotalDistributeAmount,
      };
    },
  },
  created() {
    console.log('val', this.data);
    this.inputDisabled = this.data.configType === 'detail';
    this.isEdit = ['add', 'edit'].includes(this.data.configType);
    this.isAdd = ['add'].includes(this.data.configType);
    // this.beforeTableData = this.data.row.multipleSelection;
    if (this.isAdd === false) {
      this.reqDetail();
    }
  },
};
</script>

<style lang="less" scoped>
#base {
  /deep/.comp-page-table {
    min-height: auto;
  }
}
</style>
