<template>
  <div id="base">
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
          operator-width="80"
          :data="tableData"
          :cols="tableCols"
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
import { getPrePaymentRecordList } from '@/api/outermanagement/prePaymentManagement';

export default {
  name: 'baseInfo',
  components: {
    headerTitle,
    searchForm,
    PageTable,
  },
  props: {
    show: Boolean,
    data: {},
  },
  inject: ['common'],
  data() {
    return {
      searchVal: {},
      searchItems: [
        {
          type: 'input',
          label: '完税凭证号',
          labelWidth: '90px',
          initValue: '',
          props: {
            fieldName: 'taxPaymentNumber',
          },
        },
        {
          type: 'input',
          label: '税务机关',
          initValue: '',
          props: {
            fieldName: 'taxAuthority',
          },
        },
        {
          type: 'input',
          label: '税种',
          initValue: '',
          props: {
            fieldName: 'taxCategory',
          },
        },
        {
          type: 'dataPicker',
          label: '所属日期起',
          labelWidth: '90px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'taxPayableSdate',
          },
        },
        {
          type: 'dataPicker',
          label: '所属日期止',
          labelWidth: '90px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'taxPayableEdate',
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
          label: '预缴税编号',
          prop: 'prePaymentId',
        },
        {
          label: '完税凭证号',
          prop: 'taxPaymentNumber',
        },
        {
          label: '税务机关',
          prop: 'taxAuthority',
        },
        {
          label: '税种',
          prop: 'taxCategoryName',
        },
        {
          label: '所属日期起',
          prop: 'taxPayableSdate',
        },
        {
          label: '所属日期止',
          prop: 'taxPayableEdate',
        },
        {
          label: '实缴金额',
          prop: 'taxPaymentAmount',
        },
        {
          label: '创建人',
          prop: 'createUser',
        },
        {
          label: '创建时间',
          prop: 'createTime',
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.onSearch();
    });
  },
  watch: {
    data(val) {
      this.onSearch();
    },
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
    submitFormItem() {
      this.$emit('success');
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      const { row } = this.data;
      const parames = {
        data: {
          prePaymentId: row.billId,
          ...this.searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'create_time desc',
      };

      getPrePaymentRecordList(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    cancelForm() {
      this.tableData = [];
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
}
</style>
