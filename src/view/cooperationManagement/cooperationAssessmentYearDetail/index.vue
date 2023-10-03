<template>
  <div class="detail-table">
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
          :hideDefaultIndex="true"
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
// import Flex from '@/components/flex';
import { getListCooperationAssessmentYearByCondition } from '@/api/cooperationUnitManagement/index';
export default {
  name: 'cooperationAssessmentYearDetail',
  inject: ['common'],
  props: {
    data: {},
  },
  data() {
    return {
      loading: false,
      searchVal: {
        unitName: '',
        year: '',
      },
      searchItems: [
        {
          type: 'input',
          label: '合作单位',
          initValue: '',
          props: {
            fieldName: 'unitName',
          },
        },
        {
          type: 'dataPicker',
          label: '年份',
          initValue: '',
          labelWidth: '100px',
          props: {
            type: 'year',
            format: 'yyyy',
            fieldName: 'year',
            placeholder: '请选择年份',
          },
        },
        // {
        //   type: 'dataPicker',
        //   label: '交易结束日期',
        //   initValue: '',
        //   labelWidth: '100px',
        //   props: {
        //     type: 'date',
        //     format: 'yyyy-MM-dd',
        //     fieldName: 'recordeDate',
        //     placeholder: '请选择交易结束日期',
        //   },
        // },
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
          label: '合作单位名称',
          prop: 'unitName',
          align: 'center',
          width: 150,
        },
        {
          label: '合作区域',
          prop: 'area',
          align: 'center',
          width: 150,
        },
        {
          label: '合作专业',
          prop: 'major',
          align: 'center',
          width: 160,
        },
        {
          label: '年份',
          prop: 'year',
          align: 'center',
          width: 100,
        },
        {
          label: '月份',
          prop: 'month',
          align: 'center',
          width: 100,
        },
        {
          label: '摘要',
          prop: 'remark',
          align: 'center',
          width: 100,
        },
        {
          label: '区办考核',
          prop: 'office',
          align: 'center',
          width: 100,
        },
        {
          label: '项目管理部考核',
          prop: 'project',
          align: 'center',
          width: 160,
        },
        {
          label: '质监部考核',
          prop: 'quality',
          align: 'center',
          width: 160,
        },
        {
          label: '月度考核',
          prop: 'average',
          align: 'center',
          width: 160,
        },
        {
          label: '整改通知',
          prop: 'assessment',
          align: 'center',
          width: 100,
        },
        {
          label: '黄牌',
          prop: 'yellowAssessment',
          align: 'center',
          width: 100,
        },
        {
          label: '红牌',
          prop: 'redAssessment',
          align: 'center',
          width: 100,
        },
        {
          label: '黑牌',
          prop: 'blackAssessment',
          align: 'center',
          width: 100,
        },
        {
          label: '罚款情况',
          prop: 'rewards',
          align: 'center',
          width: 100,
        },
        {
          label: '备注',
          prop: 'remark',
          align: 'center',
          width: 100,
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
    console.log(this.data);
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
          // ...this.searchVal,
          cooperationUnitName: this.searchVal.unitName,
          year: this.searchVal.year,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getListCooperationAssessmentYearByCondition(parames).then((res) => {
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

<style scoped lang="less"></style>
