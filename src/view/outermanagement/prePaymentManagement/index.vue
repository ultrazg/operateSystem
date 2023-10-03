/* eslint-disable camelcase */
<template>
  <div id="prePaymentManagement">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        addBtnVisible
        :addTitleBtn="'预缴完税回填导入'"
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
          operator-width="80"
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
                title="查看预缴税发票"
                icon="iconfont icon-yulan"
                v-if="scope.row.recordFlag === '1'"
                @click.prevent.stop="
                  openDialog('detail', {
                    row: scope.row,
                    type: 'base',
                    configType: 'detail',
                  })
                "
              >
                查看预缴税发票
              </el-button>
              <el-button
                type="text"
                size="small"
                title="预缴税打印"
                icon="iconfont icon-dayin1"
                v-if="scope.row.recordFlag === '0'"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'edit',
                  })
                "
              >
                预缴税打印
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
import { getListByCommand } from '@/api/outermanagement/prePaymentManagement';
export default {
  name: 'prePaymentManagement',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {},
      searchItems: [
        {
          type: 'input',
          label: 'ERP编号',
          initValue: '',
          props: {
            fieldName: 'erpNumber',
          },
        },
        {
          type: 'input',
          label: '项目名称',
          initValue: '',
          props: {
            fieldName: 'projectName',
          },
        },
        {
          type: 'dataPicker',
          label: '创建时间起',
          labelWidth: '90px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'ascriptionSTime',
            placeholder: '请选择创建时间起',
          },
        },
        {
          type: 'dataPicker',
          label: '创建时间止',
          labelWidth: '90px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'ascriptionETime',
            placeholder: '请选择创建时间止',
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
          label: '是否回填',
          prop: 'recordFlagName',
        },
        {
          label: '预缴税编号',
          prop: 'billId',
        },
        {
          label: 'ERP编码',
          prop: 'erpNumber',
          render: (h, scope) => {
            const text = scope.row.projectBaseInfoDto.erpNumber;

            return <div>{{ text }}</div>;
          },
        },
        {
          label: '项目名称',
          prop: 'createTime',
          render: (h, scope) => {
            const text = scope.row.projectBaseInfoDto.projectName;

            return <div>{{ text }}</div>;
          },
        },
        {
          label: '建设单位',
          prop: 'updateTime',
          render: (h, scope) => {
            const text = scope.row.projectBaseInfoDto.constructionsName;

            return <div>{{ text }}</div>;
          },
        },
        {
          label: '所属时间起',
          prop: 'ascriptionSTime',
        },
        {
          label: '所属时间止',
          prop: 'ascriptionETime',
        },
        {
          label: '销售额',
          prop: 'salesVolume',
        },
        {
          label: '扣除金额',
          prop: 'deduction',
        },
        {
          label: '税额',
          prop: 'taxAmount',
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
        type: 'import',
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
#prePaymentManagement {
}
</style>
