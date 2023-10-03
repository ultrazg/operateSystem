<template>
  <div class="baseInfo">
    <project-base-info :data="data" :info="info.InfoProjectBaseDtoModel" />
    <wrapper :key="'secondTable'" :title="'应付信息'" :isFold="false">
      <!-- 页面 -->
      <div class="content-view">
        <div class="Modeltable">
          <page-table
            ref="secondPageTable"
            col-align="left"
            operator-width="110"
            :data="tableData"
            :cols="tableCols"
            :selection="false"
            :operator="false"
            :hideDefaultIndex="true"
            :showSummary="false"
            :showPage="false"
            reserveSelection
            :row-key="getRowKey"
            :treeProps="{ children: 'children', hasChildren: 'hasChildren' }"
          >
          </page-table>
        </div>
      </div>
    </wrapper>
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
    />
  </div>
</template>

<script>
import projectBaseInfo from '@/view/common/projectInfo/projectBaseInfo';
import FormItem from '@/components/formItem';
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import { financeDetailInfo } from '@/api/financePay/financeprojectList';
import { getListByCommand } from '@/api/financePay/invoicePayLogManagement';
export default {
  name: 'baseInfo',
  props: {
    data: {},
  },
  components: {
    projectBaseInfo,
    FormItem,
    Wrapper,
    PageTable,
  },
  data() {
    return {
      info: {},
      inputDisabled: true,
      isEdit: false,
      isAdd: false,
      form: {},
      layout: [
        {
          title: '项目统计信息',
          formItems: [
            {
              label: '增值税',
              prop: 'zzs',
              inputType: 'input',
              span: 12,
            },
            {
              label: '教育费',
              prop: 'jys',
              inputType: 'input',
              span: 12,
            },
            {
              label: '城建税',
              prop: 'cjs',
              inputType: 'input',
              span: 12,
            },
            {
              label: '分包发票不含税额',
              prop: 'freeAmount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '分包发票税额',
              prop: 'taxAmount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '地方教育费',
              prop: 'dfjyf',
              inputType: 'input',
              span: 12,
            },
            {
              label: '分包发票合计',
              prop: 'priceAmount',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      formRules: {},
      tableData: [],
      tableCols: [
        {
          label: '批次号',
          prop: 'code',
          align: 'left',
          render: (h, scope) =>
            h(
              'span',
              {
                class: {
                  batchId: scope.row.hasOwnProperty('children'),
                },
                on: {
                  click: () => {
                    this.openDialog('detail', {
                      row: scope.row,
                      type: 'base',
                      configType: 'detail',
                    });
                  },
                },
              },
              scope.row.hasOwnProperty('children') ? scope.row.code : scope.row.erpNumber,
            ),
        },
        {
          label: 'ERP',
          prop: 'erpNumber',
          align: 'center',
        },
        {
          label: '应付金额',
          prop: 'payAmount',
          align: 'center',
          render: (h, scope) =>
            h('span', {}, scope.row.hasOwnProperty('children') ? scope.row.payAmount : scope.row.amount),
        },
        {
          label: '暂付金额',
          prop: 'receiveAmount',
          align: 'center',
          render: (h, scope) =>
            h('span', {}, scope.row.hasOwnProperty('children') ? scope.row.receiveAmount : scope.row.projectName),
        },
        {
          label: '创建人',
          prop: 'createUser',
          align: 'center',
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
          render: (h, scope) =>
            h('span', {}, scope.row.hasOwnProperty('children') ? scope.row.createDate : scope.row.createTime),
        },
      ],
    };
  },
  methods: {
    init() {
      financeDetailInfo(this.data.row.erpNumber).then((res) => {
        if (res.code === '200') {
          this.info = res.data;
          this.form = {
            ...res.data.InfoFinanceYJDtoModel,
            ...res.data.InfoSubPackageDtoModel,
          };
        }
      });
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      const parames = {
        data: {
          erpNumber: this.data.row.erpNumber,
        },
        pageNo: 1,
        pageSize: 100000,
        sorting: 'create_time desc',
      };

      getListByCommand(parames).then((res) => {
        if (res.code === '200') {
          const { data } = res.data;

          this.tableData = data.map((ele) => {
            if (ele.hasOwnProperty('invoicePayDtoList')) {
              ele.children = ele.invoicePayDtoList.map((child) => {
                child.key = `${ele.id}-${child.id}-${child.code}`;

                return child;
              });
            }
            ele.key = `${ele.id}-${ele.code}`;

            return ele;
          });
        }
      });
    },

    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.key;
    },
  },
  created() {
    this.init();
    this.getDataAllList();
  },
};
</script>

<style scoped lang="less">
.baseInfo {
  .content-view {
    /deep/ .comp-page-table {
      min-height: unset;
    }
  }
}
</style>
