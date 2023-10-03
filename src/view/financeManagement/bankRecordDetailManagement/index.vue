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
          :operator="true"
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
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="款项性质"
                icon="iconfont icon-bianji"
                v-if="$_hasOperation(routerCode, 'edit')"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'edit',
                  })
                "
              >
                款项性质
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

    <edit :show="editshow" :data="editdata" :title="'款项性质填写'" @cancel="closeEdit" @success="successEdit" />
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import { getImportDetailList } from '@/api/financeManagement/bankRecordManagement';
export default {
  name: 'detailTable',
  inject: ['common'],
  props: {
    data: {},
  },
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
          label: '对方帐号',
          initValue: '',
          props: {
            fieldName: 'payName',
          },
        },
        {
          type: 'dataPicker',
          label: '交易开始日期',
          initValue: '',
          labelWidth: '100px',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'recordsDate',
            placeholder: '请选择交易开始日期',
          },
        },
        {
          type: 'dataPicker',
          label: '交易结束日期',
          initValue: '',
          labelWidth: '100px',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'recordeDate',
            placeholder: '请选择交易结束日期',
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
          label: '户名',
          prop: 'account',
          align: 'center',
          width: 200,
        },
        {
          label: '对方帐号',
          prop: 'payName',
          align: 'center',
          width: 200,
        },
        {
          label: '发生金额',
          prop: 'amount',
          align: 'center',
          width: 160,
        },
        {
          label: '剩余流水金额',
          prop: 'userAmount',
          align: 'center',
          width: 160,
        },
        {
          label: '交易类型',
          prop: 'payType',
          align: 'center',
          width: 160,
        },
        {
          label: '摘要',
          prop: 'remark',
          align: 'center',
          width: 160,
        },
        {
          label: '创建时间',
          prop: 'createDate',
          align: 'center',
          width: 160,
        },
        {
          label: '交易日期',
          prop: 'recordDate',
          align: 'center',
          width: 160,
        },
        {
          label: '款项标记',
          prop: 'adjustFlag',
          align: 'center',
          width: 160,
        },
        {
          label: '款项性质',
          prop: 'adjustReason',
          align: 'center',
          width: 160,
        },
        {
          label: '流水状态',
          prop: 'status',
          align: 'center',
          width: 160,
        },
        {
          label: '导入结果',
          prop: 'result',
          align: 'center',
          width: 160,
        },
      ],
      editshow: false,
      editdata: {},
      batchId: '',
    };
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    Edit,
  },
  created() {
    this.batchId = this.data && this.data.row ? this.data.row.batchID : ''; // 回款信息列表-批次号
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
          ...this.searchVal,
          batchId: this.batchId,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getImportDetailList(parames).then((res) => {
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
