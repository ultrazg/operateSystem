<template>
  <div id="base">
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onReset="onReset"
        :otherBtnVisible="true"
      />
    </header-title>
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
        @current-change="onCurrentChange"
        @size-change="onPageSizeChange"
        :showPage="false"
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
</template>

<script>
import moment from 'moment';
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import { viewHisList } from '@/api/accountManagement/trialBalanceManagement';

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
    const { configType } = this.data;

    return {
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      searchVal: {
        year: '',
      },
      searchItems: [
        {
          type: 'dataPicker',
          label: '账期',
          initValue: '',
          props: {
            type: 'year',
            format: 'yyyy',
            fieldName: 'year',
            placeholder: '请选择开始时间',
            pickerOptions: {
              disabledDate(time) {
                // return new Date('2020') > time.getTime() || time.getTime() > Date.now();
                return moment(new Date('2020')) > time.getTime() || time.getTime() > moment(new Date());
              },
            },
          },
        },
      ],
      form: {},
      loading: false,
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      tableCols: [
        {
          label: '账期',
          prop: 'month',
        },
        {
          label: '期初余额',
          prop: 'openingBalance',
        },
        {
          label: '借方数',
          prop: 'numberOfBorrowers',
        },
        {
          label: '贷方数',
          prop: 'numberOfLenders',
        },
        {
          label: '期末结余',
          prop: 'closingBalance',
        },
      ],
    };
  },
  watch: {
    data(val) {
      this.inputDisabled = val.configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
  },
  methods: {
    // 搜索
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    // 重置
    onReset() {
      console.log('onReset');
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
      const { row } = this.data;
      const parames = {
        data: {
          ...this.searchVal,
          id: row.id,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      viewHisList(parames).then((res) => {
        if (res.code === '200') {
          // const { data, total } = res.data;
          this.tableData = res.data;
          // this.page.total = total;
          this.loading = false;
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        this.form = {
          ...this.form,
          ...row,
        };
      }
    },
    cancelForm() {
      this.form = {};
      this.$emit('cancel');
    },
  },
  created() {
    this.getDataAllList();
  },
};
</script>

<style lang="less" scoped>
#base {
}
</style>
