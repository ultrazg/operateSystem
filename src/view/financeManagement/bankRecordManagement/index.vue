/* eslint-disable camelcase */
<template>
  <div id="bankRecordManagement">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onChange="onChange"
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
          :selection="false"
          :operator="false"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @selection-change="onSelectionChange"
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

    <edit :show="editshow" :data="editdata" :title="'流水管理'" @cancel="closeEdit" @success="successEdit"></edit>
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Edit from './Edit';
import { getListByCommand } from '@/api/financeManagement/bankRecordManagement';
export default {
  name: 'bankRecordManagement',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        batchID: '',
        result: '',
      },
      searchItems: [
        {
          type: 'input',
          label: '批次号',
          initValue: '',
          props: {
            fieldName: 'batchID',
          },
        },
        {
          type: 'select',
          label: '执行结果',
          initValue: '',
          props: {
            fieldName: 'result',
            filterable: true,
            options: [
              {
                name: '成功',
                id: '1',
              },
              {
                name: '失败',
                id: '0',
              },
            ],
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
          label: 'Sheet名',
          prop: 'typeName',
          align: 'center',
        },
        {
          label: '批次号',
          prop: 'batchID',
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
                    this.openDialog('detail', {
                      row: scope.row,
                      type: 'base',
                      configType: 'detail',
                    });
                  },
                },
              },
              scope.row.batchID,
            ),
        },
        {
          label: '文件名称',
          prop: 'fileName',
          align: 'center',
        },
        {
          label: '执行结果',
          prop: 'resultName',
          align: 'center',
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
        },
        {
          label: '创建人',
          prop: 'createUserName',
          align: 'center',
        },
        {
          label: '备注',
          prop: 'remark',
          align: 'center',
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

      getListByCommand(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
          this.loading = false;
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
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
      this.editshow = false;
      this.getDataAllList();
    },
  },
};
</script>

<style lang="less" scoped>
#bankRecordManagement {
  /deep/ .batchId {
    cursor: pointer;
    color: #4caae0;
  }
}
</style>
