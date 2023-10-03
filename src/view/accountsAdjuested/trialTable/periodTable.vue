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
          <!-- <template slot-scope="scope" slot="operator">
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
              <el-button
                type="text"
                size="small"
                title="编辑"
                icon="iconfont icon-bianji"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'edit',
                  })
                "
              >
              </el-button>
            </flex>
          </template> -->
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
        // {
        //   type: 'select',
        //   label: '待办状态',
        //   initValue: 'N',
        //   props: {
        //     fieldName: 'status',
        //     filterable: true,
        //     options: this.common().dealWithStatus,
        //   },
        // },
        // {
        //   type: 'select',
        //   label: '对应业务',
        //   initValue: '',
        //   props: {
        //     fieldName: 'businessCode',
        //     filterable: true,
        //     options: this.common().businessCode,
        //   },
        // },
        {
          type: 'dataPicker',
          label: '账期',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM',
            fieldName: 'beginDate',
            placeholder: '请选择账期',
          },
        },
        {
          type: 'input',
          label: '科目代码',
          initValue: '',
          props: {
            fieldName: 'endDate',
            placeholder: '请输入',
          },
        },
        {
          type: 'input',
          label: '成本中心段',
          initValue: '',
          props: {
            fieldName: 'endDate',
            placeholder: '请输入',
          },
        },
        {
          type: 'input',
          label: '项目段',
          initValue: '',
          props: {
            fieldName: 'endDate',
            placeholder: '请输入',
          },
        },
        {
          type: 'input',
          label: '项目名称',
          initValue: '',
          props: {
            fieldName: 'endDate',
            placeholder: '请输入',
          },
        },
        {
          type: 'input',
          label: '客户段',
          initValue: '',
          props: {
            fieldName: 'endDate',
            placeholder: '请输入',
          },
        },

        {
          type: 'input',
          label: '期初余额',
          initValue: '',
          props: {
            fieldName: 'endDate',
            placeholder: '请输入',
          },
        },
        {
          type: 'input',
          label: '借方术',
          initValue: '',
          props: {
            fieldName: 'endDate',
            placeholder: '请输入',
          },
        },
        {
          type: 'input',
          label: '贷方数',
          initValue: '',
          props: {
            fieldName: 'endDate',
            placeholder: '请输入',
          },
        },
        {
          type: 'input',
          label: '期末结余',
          initValue: '',
          props: {
            fieldName: 'endDate',
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
          label: '账期',
          prop: 'statusName',
        },
        {
          label: '科目代码',
          prop: 'businessName',
        },
        {
          label: '科目描述',
          prop: 'explain',
        },
        {
          label: '公司段',
          prop: 'createTime',
        },
        {
          label: '成本中心段',
          prop: 'updateTime',
        },

        {
          label: '专业段',
          prop: 'statusName',
        },
        {
          label: '内部往来段',
          prop: 'businessName',
        },
        {
          label: '项目段',
          prop: 'explain',
        },
        {
          label: '项目名称',
          prop: 'createTime',
        },
        {
          label: '客户段',
          prop: 'updateTime',
        },
        {
          label: '期初余额',
          prop: 'businessName',
        },
        {
          label: '借方数',
          prop: 'explain',
        },
        {
          label: '贷方处',
          prop: 'createTime',
        },
        {
          label: '期末结余',
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
