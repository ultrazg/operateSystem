/* eslint-disable camelcase */
<template>
  <div id="invoiceIndex">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        :addBtnVisible="$_hasOperation(routerCode, 'add')"
        :addTitleBtn="'开票申请'"
        @onSearch="onSearch"
        @onChange="onChange"
        @onReset="onReset"
        @onAddBtn="onAddBtn"
      />
    </header-title>
    <!-- 页面 -->
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          ref="pageTable"
          col-align="left"
          operator-width="110"
          :loading="loading"
          :hideDefaultIndex="true"
          :data="tableData"
          :cols="tableCols"
          :selection="false"
          :operator="true"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @selection-change="onSelectionChange"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          :treeProps="{ children: 'details', hasChildren: 'details.length > 0' }"
        >
          <template slot-scope="scope" slot="operator">
            <flex>
              <!-- status === 'status_0' //草稿
              status === 'status_5' //待回填
              status === 'status_6' //待收款 -->
              <span v-if="scope.row.details && scope.row.details.length">
                <el-button
                  type="text"
                  size="small"
                  title="编辑"
                  v-if="scope.row.status === 'status_0' && $_hasOperation(routerCode, 'edit')"
                  icon="iconfont icon-bianji"
                  @click.prevent.stop="onEditBtn(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  title="提交审核"
                  v-if="scope.row.status === 'status_0' && $_hasOperation(routerCode, 'audit')"
                  icon="iconfont icon-fabu"
                  @click.prevent.stop="
                    openDialog('fabu', {
                      row: { ...scope.row, businessCode: 't_apply_invoice' },
                      type: 'fabu',
                      configType: 'fabu',
                    })
                  "
                >
                  提交审核
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  title="申请作废"
                  v-if="scope.row.status === 'status_5' && $_hasOperation(routerCode, 'cancle')"
                  icon="iconfont icon-shibai"
                  @click.prevent.stop="
                    openDialog('close', {
                      row: { ...scope.row, businessCode: 't_apply_invoice' },
                      type: 'close',
                      configType: 'close',
                    })
                  "
                >
                  申请作废
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  title="红票申请"
                  v-if="scope.row.status === 'status_6' && $_hasOperation(routerCode, 'redEdit')"
                  icon="iconfont icon-xinzeng"
                  @click.prevent.stop="
                    openDialog('redAdd', {
                      row: scope.row,
                      type: 'base',
                      configType: 'redAdd',
                    })
                  "
                >
                  红票申请
                </el-button>
              </span>
            </flex>
          </template>
        </page-table>
        <div v-show="false" class="nonedata">
          <div>
            <img src="~common/images/emptyData.png" alt="" />
            <p>暂无数据，晚点再来吧</p>
          </div>
        </div>
      </div>
    </div>

    <edit :show="editshow" :data="editdata" @cancel="closeEdit" @success="successEdit"></edit>
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import { getInvoiceList } from '@/api/invoiceManager/invoiceIndex';
export default {
  name: 'invoiceIndex',
  inject: ['common'],
  data() {
    return {
      loading: false,
      dialogTitle: '',
      searchVal: {
        beginDate: '',
        billId: '',
        consignor: '',
        endDate: '',
        erpNumber: '',
        status: '',
      },
      searchItems: [
        {
          type: 'input',
          label: '开票编号',
          initValue: '',
          props: {
            fieldName: 'billId',
          },
        },
        {
          type: 'select',
          label: '委托方',
          initValue: '',
          props: {
            fieldName: 'consignor',
            filterable: true,
            options: this.common().constructionCode,
          },
        },
        {
          type: 'select',
          label: '状态',
          initValue: '',
          props: {
            fieldName: 'status',
            filterable: true,
            options: this.common().verifyStatusCode,
          },
        },
        {
          type: 'input',
          label: 'ERP编号',
          initValue: '',
          props: {
            fieldName: 'erpNumber',
          },
        },
        {
          type: 'dataPicker',
          label: '申请开始时间',
          labelWidth: '90px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'beginDate',
            placeholder: '请选择创建时间起',
          },
        },
        {
          type: 'dataPicker',
          label: '申请结束时间',
          labelWidth: '90px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'endDate',
            placeholder: '请选择创建时间止',
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      multipleSelection: [], // 选中表格数据
      tableData: [],
      tableCols: [
        {
          label: '开票编号',
          prop: 'billId',
          align: 'center',
          render: (h, scope) =>
            h(
              'span',
              {
                class: {
                  batchId: true,
                },
                on: {
                  click: () => {
                    if (scope.row.hasOwnProperty('details')) {
                      this.openDialog('detail', {
                        row: scope.row,
                        type: 'base',
                        configType: 'detail',
                      });
                    } else {
                      this.openDialog('subcontractInvoiceInfo', {
                        row: scope.row,
                        type: 'subcontractInvoiceInfo',
                        configType: 'subcontractInvoiceInfo',
                      });
                    }
                  },
                },
              },
              scope.row.hasOwnProperty('details') ? scope.row.billId : scope.row.billId,
            ),
        },
        {
          label: '委托方',
          prop: 'consignorName',
          align: 'center',
          render: (h, scope) =>
            h('span', {}, scope.row.hasOwnProperty('details') ? scope.row.consignorName : scope.row.operatorName),
        },
        {
          label: '建设主体',
          prop: 'subjectName',
          align: 'center',
          render: (h, scope) =>
            h('span', {}, scope.row.hasOwnProperty('details') ? scope.row.subjectName : scope.row.businessTypeName),
        },
        {
          label: '总额',
          prop: 'amount',
          align: 'center',
        },
        {
          label: '税率',
          prop: 'rateName',
          align: 'center',
          render: (h, scope) =>
            h('span', {}, scope.row.hasOwnProperty('details') ? scope.row.rateName : scope.row.amountTax),
        },
        {
          label: '状态',
          prop: 'statusName',
          align: 'center',
          render: (h, scope) => {
            const { invoiceStatus } = this.common();
            const statusItem = invoiceStatus.filter((status) => status.id === scope.row.status);

            return <div>{statusItem && statusItem[0] ? statusItem[0].name : ''}</div>;
          },
        },
        {
          label: '发票类型',
          prop: 'invoiceTypeName',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.hasOwnProperty('details') ? scope.row.invoiceTypeName : ''),
        },
        {
          label: '申请人',
          prop: 'applyByName',
          align: 'center',
          render: (h, scope) =>
            h('span', {}, scope.row.hasOwnProperty('details') ? scope.row.applyByName : scope.row.fundsTypeName),
        },
        {
          label: '申请时间',
          prop: 'applyTime',
          align: 'center',
          render: (h, scope) =>
            h('span', {}, scope.row.hasOwnProperty('details') ? scope.row.applyTime : scope.row.amountNTax),
        },
      ],
      editshow: false,
      editdata: {},
    };
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    Edit,
  },
  mounted() {
    this.$nextTick(() => {
      this.onSearch();
    });
  },
  methods: {
    // 重置
    onReset() {
      console.log('onReset');
    },
    onChange(val) {
      console.log('onChange');
    },
    // 搜索
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    onAddBtn() {
      this.editdata = {
        row: {},
        type: 'base',
        configType: 'add',
      };
      this.dialogTitle = '开票申请';
      this.editshow = true;
    },
    onEditBtn(rowObj) {
      this.editdata = {
        row: rowObj,
        type: 'base',
        configType: 'edit',
      };

      this.dialogTitle = '开票详情编辑';
      this.editshow = true;
    },
    // 请求某页数据
    onCurrentChange(val) {
      this.page.current = val;
      this.getDataAllList();
    },
    // 改变请求条数
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
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

      getInvoiceList(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.tableData = data.map((ele) => {
            ele.typeName = '';
            if (ele.hasOwnProperty('details')) {
              ele.details = ele.details.map((child) => {
                child.key = `${ele.id}-${child.id}`;

                return child;
              });
            }
            ele.key = `${ele.id}`;

            return ele;
          });
          this.page.total = total;
          this.loading = false;
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.key;
    },
    // 保存选中表格数据
    onSelectionChange(args) {
      // console.log(args, "选中");
      this.multipleSelection = args;
    },
    // 预览
    openDialog(state, info = {}) {
      this.editshow = true;
      this.editdata = info;
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },
    successEdit() {
      this.closeEdit();
      this.onCurrentChange(1);
    },
  },
};
</script>

<style lang="less" scoped>
#invoiceIndex {
  /deep/ .batchId {
    cursor: pointer;
    color: #4caae0;
  }
}
</style>
