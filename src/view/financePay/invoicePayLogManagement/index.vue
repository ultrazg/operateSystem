<template>
  <div class="invoicePayLogManagement">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onReset="onReset"
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
          :data="tableData"
          :cols="tableCols"
          :hideDefaultIndex="true"
          :selection="false"
          :operator="false"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          :treeProps="{ children: 'children', hasChildren: 'hasChildren' }"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
        </page-table>
        <div v-show="false" class="nonedata">
          <div>
            <img src="~common/images/emptyData.png" alt="" />
            <p>暂无数据，晚点再来吧</p>
          </div>
        </div>
      </div>
    </div>
    <edit
      :show="editshow"
      :data="editdata"
      :title="editTitle"
      :width="editWidth"
      @cancel="closeEdit"
      @success="successEdit"
    />
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Edit from './Edit/index';
import { getListByCommand } from '@/api/financePay/invoicePayLogManagement';

export default {
  name: 'invoicePayLogManagement',
  inject: ['common'],
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Edit,
  },
  data() {
    return {
      loading: false,
      searchVal: {
        erpNumber: undefined,
        beginDate: undefined,
        endDate: undefined,
      },
      searchItems: [
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
          label: '创建时间起',
          initValue: '',
          labelWidth: '90px',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'beginDate',
            placeholder: '请选择创建时间起',
          },
        },
        {
          type: 'dataPicker',
          label: '创建时间止',
          initValue: '',
          labelWidth: '90px',
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
          render: (h, scope) => h('span', {}, scope.row.hasOwnProperty('children') ? scope.row.erpNumber : ''),
        },
        {
          label: '项目名称',
          prop: 'projectName',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.hasOwnProperty('children') ? scope.row.projectName : ''),
        },
        {
          label: '付款金额',
          prop: 'actualAmount',
          align: 'center',
        },
        {
          label: '收到票据总金额',
          prop: 'billAmount',
          align: 'center',
        },
        {
          label: '暂估预付金额',
          prop: 'receiveAmount',
          align: 'center',
        },
        {
          label: '余额',
          prop: 'balanceAmount',
          align: 'center',
        },
        {
          label: '类型',
          prop: 'type',
          align: 'center',
          render: (h, scope) => h('span', {}, scope.row.hasOwnProperty('children') ? scope.row.typeName : ''),
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
      editshow: false,
      editdata: {},
      editTitle: '',
      editWidth: '900px',
    };
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
    // 搜索
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
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
        sorting: 'create_time desc',
      };

      getListByCommand(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data.map((ele) => {
            ele.typeName = '';
            if (ele.hasOwnProperty('invoicePayDtoList')) {
              ele.children = ele.invoicePayDtoList.map((child) => {
                child.key = `${ele.id}-${child.id}-${child.code}`;

                return child;
              });
              ele.typeName = ele.invoicePayDtoList[0].type === '0' ? '分包相关款' : '预缴税';
            }
            ele.key = `${ele.id}-${ele.code}`;

            return ele;
          });
          this.page.total = total;
          this.loading = false;
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      console.log(row.key);

      return row.key;
    },
    // 预览
    openDialog(state, info = {}) {
      const title = {
        detail: '项目财务详情展示',
      };
      const width = {
        detail: '950px',
      };

      this.editTitle = title[info.configType];
      this.editWidth = width[info.configType];
      this.editshow = true;
      this.editdata = info;
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },

    successEdit() {
      this.editshow = false;
      this.getDataAllList();
    },
  },
};
</script>

<style scoped lang="less">
.invoicePayLogManagement {
  /deep/ .batchId {
    cursor: pointer;
    color: #4caae0;
  }
}
</style>
