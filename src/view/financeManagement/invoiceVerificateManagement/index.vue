/* eslint-disable camelcase */
<template>
  <div id="invoiceVerificateManagement">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        :addBtnVisible="$_hasOperation(routerCode, 'edit')"
        :addTitleBtn="'核销'"
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
          :selection="true"
          :operator="false"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          :hideDefaultIndex="true"
          :selectable="handleSelectable"
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
import { getListByCommand, toManyVerificatePass } from '@/api/financeManagement/invoiceVerificateManagement';
export default {
  name: 'invoiceVerificateManagement',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        paymentTime: '',
        erpNumber: '',
      },
      searchItems: [
        {
          type: 'dataPicker',
          label: '回款时间',
          initValue: '',
          labelWidth: '100px',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'paymentTime',
            placeholder: '请选择回款时间',
          },
        },
        {
          type: 'input',
          label: 'ERP编号',
          initValue: '',
          props: {
            fieldName: 'erpNumber',
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
          label: 'ERP编号',
          prop: 'erpNumber',
          align: 'center',
        },
        {
          label: '项目名称',
          prop: 'projectName',
          align: 'center',
        },
        {
          label: '勾兑金额',
          prop: 'paymentAmount',
          align: 'center',
        },
        {
          label: '状态',
          prop: 'statusName',
          align: 'center',
        },
        {
          label: '勾兑人',
          prop: 'paymentPeople',
          align: 'center',
        },
        {
          label: '勾兑时间',
          prop: 'paymentTime',
          align: 'center',
        },
        {
          label: '核销人',
          prop: 'verificateUser',
          align: 'center',
        },
        {
          label: '核销时间',
          prop: 'verificateTime',
          align: 'center',
        },
      ],
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
      console.log(args, '选中');
      this.multipleSelection = args;
    },
    handleSelectable(row, index) {
      return row.status === 'status_10';
    },
    onAddBtn() {
      console.log(this.multipleSelection);
      if (!this.multipleSelection.length) {
        this.$notify.error({
          title: '错误',
          message: '请勾选核销通过的数据',
        });

        return;
      }
      this.$confirm('确定核销通过?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const ids = this.multipleSelection.map((ele) => ele.id).join();

        toManyVerificatePass(ids).then((res) => {
          if (res.code === '200') {
            this.$message({
              type: 'success',
              message: '核销成功!',
            });
            this.$refs.pageTable.getPageTable();
            this.getDataAllList();
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
#invoiceVerificateManagement {
}
</style>
