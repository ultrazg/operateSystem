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
      <template slot="orderId">
        <otherBtnList style="margin-bottom: 12px">
          <ul class="flexRow">
            <li
              v-for="(item, index) in orderIdOtherBtnLists"
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
        <page-table ref="pageTable" col-align="left" :showPage="false" :data="orderTableData" :cols="orderTableCols">
        </page-table>
      </template>
      <template slot="extensionInfo">
        <page-table
          ref="pageTable"
          col-align="left"
          :showPage="false"
          operator-width="90"
          :data="extensionInfoData"
          :cols="extensionInfo"
          :operator="data.configType !== 'detail'"
        >
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="编辑"
                icon="iconfont icon-bianji"
                v-if="!scope.row.editRow && scope.index === extensionInfoData.length - 1"
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
                v-if="scope.row.editRow && scope.index === extensionInfoData.length - 1"
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
            </flex>
          </template>
        </page-table>
      </template>
    </FormItem>
    <outerManagementSelect
      :show="outerManagementShow"
      :data="outerManagementData"
      :filterArray="['核销']"
      @cancel="closeouterManagement"
      @success="successouterManagement"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import PageTable from '@/components/page-table';
import otherBtnList from '@/components/headerTitle/otherBtnList';
import outerManagementSelect from '@/view/common/outerManagementSelect';
import { addExtension, editExtension, detailExtension } from '@/api/outermanagement/extensionManagement';
// import {
//   editDeviceInfo,
//   getFactorySelect,
//   roomSelectByCommand,
//   getDevModelSelect,
//   getDevTypeSelect
// } from "@/api/plan_center";

export default {
  name: 'extensionInfo',
  components: {
    FormItem,
    outerManagementSelect,
    PageTable,
    otherBtnList,
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
          title: '外经证信息',
          formItems: [
            {
              label: '外经证编号',
              prop: 'outerCode',
              inputType: 'select',
              disabled: false,
              span: 12,
              onFocus: (val) => {
                this.outerManagementData = {
                  ...this.data,
                  ...this.form,
                  reqData: {
                    excludeWriteOffs: '1',
                    backFillStatus: 1,
                  },
                };
                this.outerManagementShow = true;
              },
            },
            {
              label: '外经证名称',
              prop: 'outerName',
              disabled: true,
              inputType: 'input',

              span: 12,
            },
            {
              label: '有效期起',
              prop: 'startTime',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '有效期止',
              prop: 'endTime',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '涉税金额',
              prop: 'taxAmount',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '经办人电话',
              prop: 'operatorTel',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '经营方式',
              prop: 'modeType',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '联系人',
              prop: 'contactP',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '承揽框架名称',
              prop: 'frameworkName',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
          ],
        },
        {
          title: '绑定承揽订单',
          render: 'orderId',
        },
        {
          title: '延期信息管理',
          render: 'extensionInfo',
        },
      ],
      // 绑定承揽订单列表
      orderTableData: [],
      orderTableCols: [
        {
          label: '承揽订单',
          prop: 'contractName',
        },
        {
          label: '承揽订单编码',
          prop: 'orderId',
        },
        {
          label: '合同金额',
          prop: 'contraclAmount',
        },
        {
          label: 'ERP编码',
          prop: 'erpNumber',
        },
        {
          label: '项目名称',
          prop: 'projectName',
        },
        {
          label: '省份',
          prop: 'province',
        },
        {
          label: '地市',
          prop: 'city',
        },
        {
          label: '区/县',
          prop: 'area',
        },
      ],

      // 延期信息管理 列表
      extensionInfoData: [],
      extensionInfo: [
        {
          label: '延期申请单号',
          prop: 'FinanceDelayCode',
        },
        {
          label: '延长期起',
          prop: 'startTime',
          width: '150px',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.startTime;

            if (d.editRow) {
              html = (
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
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '延长期止',
          prop: 'endTime',
          width: '150px',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.endTime;

            if (d.editRow) {
              html = (
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
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '申请人',
          prop: 'applyUser',
        },
        {
          label: '申请时间',
          prop: 'applyTime',
        },
      ],
      outerManagementShow: false,
      outerManagementData: false,
      formRules: {},
      editRow: false,
      orderIdOtherBtnLists: [],
    };
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
    successouterManagement(selectTable) {
      console.log(selectTable);
      this.selectTable = selectTable;

      this.form = {
        ...this.form,
        outerId: selectTable.id,
        outerCode: selectTable.outerCode,
        outerName: selectTable.outerName,
        startTime: selectTable.startTime,
        endTime: selectTable.endTime,
        taxAmount: selectTable.taxAmount,
        operatorTel: selectTable.operatorTel,
        modeType: selectTable.modeType,
        contactP: selectTable.contactP,
        frameworkName: selectTable.frameworkName,
      };
      this.orderTableData = selectTable.hireOrderList;
      this.extensionInfoData = [
        ...selectTable.financeDelayList,
        {
          editRow: true,
        },
      ];
      this.editRow = true;
    },
    closeouterManagement() {
      this.outerManagementShow = false;
      // this.hireNameIndex = -1;
      this.outerManagementData = {};
    },
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    onCurrentChange(val) {
      // this.page.current = val;
      this.getDataAllList();
    },
    getDataAllList() {
      this.loading = true;
      const parames = {
        data: {
          ...this.searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      // console.log('parames', parames);
      getExtensionListByCondition(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
          this.loading = false;
        }
      });
    },
    changeInput(val, index, name) {
      this.extensionInfoData[index] = {
        ...this.extensionInfoData[index],
        [name]: val,
      };
      this.extensionInfoData.splice(1, 0);
    },
    tableAction(type, row) {
      console.log('row', row);
      if (type === 'edit') {
        this.extensionInfoData[row.index] = {
          ...this.extensionInfoData[row.index],
          editRow: true,
        };
        this.editRow = true;
        this.extensionInfoData.splice(1, 0);
      }
      if (type === 'save') {
        this.extensionInfoData[row.index] = {
          ...this.extensionInfoData[row.index],
          editRow: false,
        };
        this.editRow = false;
        this.extensionInfoData.splice(1, 0);
      }
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        detailExtension(row.id).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              ...res.data,
            };
            // 承揽订单
            // this.layout[0].formItems[0].disabled = true;
            this.orderTableData = res.data.hireList;
            // 延期记录
            this.extensionInfoData = res.data.delayDetailList;
          }
        });
      }
    },
    closeEdit() {
      this.outerManagementShow = false;
      this.outerManagementData = {};
    },
    successEdit(peopleTable) {
      this.peopleTable = peopleTable;

      this.form = {
        ...this.form,
        pmName: peopleTable.realName,
        pm: peopleTable.username,
      };
      this.closeEdit();
    },

    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);

      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const lastData = this.extensionInfoData[this.extensionInfoData.length - 1];
      const { startTime, endTime } = lastData;

      if (!startTime) {
        this.$notifyError('请先输入延长期起数据');

        return;
      }
      if (!endTime) {
        this.$notifyError('请先输入延长期止数据');

        return;
      }
      if (this.editRow) {
        this.$notifyError('请先保存当前新增行数据再进行添加操作');

        return;
      }
      const param = {
        ...val,
        outerCode: val.outerCode,
        id: val.id,
        startTime,
        endTime,
      };

      let message = '新增成功';

      let api = addExtension;

      if (id) {
        param.id = this.form.id;
        message = '修改成功';
        api = editExtension;
      }
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
  /deep/.comp-page-table {
    min-height: auto;
  }
}
</style>
