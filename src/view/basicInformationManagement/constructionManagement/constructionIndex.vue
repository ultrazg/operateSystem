/* eslint-disable camelcase */
<template>
  <div id="constructionIndex">
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
          :hideDefaultIndex="true"
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
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import { dictionaryListByConditions } from '@/api/basicInformationManagement/constructionIndex';
export default {
  name: 'constructionIndex',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        name: '',
      },
      searchItems: [
        {
          label: '委托方名称',
          initValue: '',
          type: 'input',
          span: 12,
          props: {
            fieldName: 'name',
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
          label: '委托方编号',
          prop: 'code',
          align: 'center',
        },
        {
          label: '委托方名称',
          prop: 'name',
          align: 'center',
        },
        {
          label: '描述',
          prop: 'description',
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
          code: 'construction',
          ...this.searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      dictionaryListByConditions(parames).then((res) => {
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
  },
};
</script>

<style lang="less" scoped>
#constructionIndex {
}
</style>
