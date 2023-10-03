/* eslint-disable camelcase */
<template>
  <div id="resultTable">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        addBtnVisible
        :addTitleBtn="'立项申请'"
        :otherBtnLists="[
          {
            label: '导出',
            hide: !$_hasOperation(routerCode, 'export'),
            click: () => handleExport(),
          },
        ]"
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
        >
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="查看"
                icon="iconfont icon-yulan"
                @click.prevent.stop="
                  openDialog('detail', {
                    row: scope.row,
                    type: 'base',
                    configType: 'detail',
                  })
                "
              >
              </el-button>
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
import { listInstancesByCondition } from '@/api/accountsAdjuested/resultTable';
export default {
  name: 'resultTable',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        status: 'N',
        businessCode: undefined,
        startTime: undefined,
        endTime: undefined,
      },
      searchItems: [
        {
          type: 'input',
          label: '项目编码',
          initValue: '',
          props: {
            fieldName: 'name',
            placeholder: '请输入',
          },
        },
        {
          type: 'input',
          label: '项目名称',
          initValue: '',
          props: {
            fieldName: 'name',
            placeholder: '请输入',
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
          label: '项目编码',
          prop: 'statusName',
        },
        {
          label: '项目名称',
          prop: 'businessName',
        },
        {
          label: '业务收入累计(不含税)',
          prop: 'explain',
        },
        {
          label: '工程结算',
          prop: 'createTime',
        },
        {
          label: '收入结账',
          prop: 'updateTime',
        },
        {
          label: '合同资产',
          prop: 'updateTime',
        },
        {
          label: '应收账款借方发生额',
          prop: 'explain',
        },
        {
          label: '应收账款贷方发生额',
          prop: 'createTime',
        },
        {
          label: '应收账款余额',
          prop: 'updateTime',
        },
        {
          label: '应收账款借方发生额',
          prop: 'updateTime',
        },

        {
          label: '应收账款余额',
          prop: 'updateTime',
        },
        {
          label: '预付账款借方发生额',
          prop: 'explain',
        },
        {
          label: '预付账款贷方发生额',
          prop: 'createTime',
        },
        {
          label: '预付账款余额',
          prop: 'updateTime',
        },
        {
          label: '合同负债借方发生额',
          prop: 'updateTime',
        },

        {
          label: '合同负债贷方发生额',
          prop: 'explain',
        },
        {
          label: '合同负债余额',
          prop: 'createTime',
        },
        {
          label: '存贷',
          prop: 'updateTime',
        },
        {
          label: '合同履约成本',
          prop: 'updateTime',
        },
        {
          label: '其它存货',
          prop: 'updateTime',
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
      this.closeEdit();
      this.onCurrentChange(1);
    },
  },
};
</script>

<style lang="less" scoped>
#resultTable {
}
</style>
