<template>
  <div id="businessOpportunityLogList">
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
import { getListByCommand } from '@/api/operationLog/businessOpportunityLogList';
export default {
  name: 'businessOpportunityLogList',
  inject: ['common'],
  components: {
    headerTitle,
    searchForm,
    PageTable,
  },
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
          type: 'dataPicker',
          label: '操作时间起',
          labelWidth: '100px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'startTime',
            placeholder: '请选择开始时间',
          },
        },
        {
          type: 'dataPicker',
          label: '操作时间止',
          labelWidth: '100px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'endTime',
            placeholder: '请选择结束时间',
          },
        },
        {
          type: 'input',
          label: '商机编号',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'busiId',
          },
        },
        {
          type: 'select',
          label: '操作类型',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'operationType',
            filterable: true,
            options: this.common().operationType,
          },
        },
        {
          type: 'input',
          label: '操作人',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'updateUser',
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
          label: '商机编号',
          prop: 'busiId',
          align: 'center',
        },
        {
          label: '操作类型',
          prop: 'operationType',
          align: 'center',
        },
        {
          label: '操作人',
          prop: 'updateUser',
          align: 'center',
        },
        {
          label: '操作时间',
          prop: 'updateDate',
          align: 'center',
        },
      ],
    };
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
  },
  mounted() {
    this.$nextTick(() => {
      this.onSearch();
    });
  },
};
</script>

<style scoped></style>
