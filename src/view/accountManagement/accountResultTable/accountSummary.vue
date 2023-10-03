/* eslint-disable camelcase */
<template>
  <div id="trialBalanceManagement">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onChange="onChange"
        @onReset="onReset"
        @onAddBtn="onAddBtn"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '导出',
            click: () => handleExport(),
          },
        ]"
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
                >查看
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
import { excelDownload } from '@/api/basicInformationManagement/templetDownloadIndex';
import { listByCondition, exportList } from '@/api/accountManagement/accountResultTable';
export default {
  name: 'accountSummary',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        projectCode: '',
        projectName: '',
      },
      searchItems: [
        {
          type: 'input',
          label: '项目编码',
          initValue: '',
          props: {
            fieldName: 'projectCode',
            filterable: true,
          },
        },
        {
          type: 'input',
          label: '项目名称',
          initValue: '',
          props: {
            fieldName: 'projectName',
            filterable: true,
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
          prop: 'projectCode',
        },
        {
          label: '项目名称',
          prop: 'projectName',
        },
        {
          label: '业务收入累计(不含税)',
          prop: 'busIncomeTotal',
          width: '100px',
        },
        {
          label: '项目成本累计(不含税)',
          prop: 'a',
          width: '100px',
        },
        {
          label: '项目合作成本(不含税)',
          prop: 'b',
          width: '100px',
        },
        {
          label: '毛利率',
          prop: 'c',
          width: '80px',
        },
        {
          label: '工程结算',
          prop: 'projectSettle',
        },
        {
          label: '收入结转',
          prop: 'incomeBalance',
        },
        {
          label: '合同资产',
          prop: 'contractAssets',
        },
        {
          label: '应收账款借方发生额',
          prop: 'receivableBorrowers',
          width: '100px',
        },
        {
          label: '应收账款贷方发生额',
          prop: 'receivableLenders',
          width: '100px',
        },
        {
          label: '应收账款余额',
          prop: 'receivableBalance',
        },
        {
          label: '应付账款贷方发生额',
          prop: 'payableBorrowers',
          width: '100px',
        },
        {
          label: '应付账款借方发生额',
          prop: 'payableLenders',
          width: '100px',
        },
        {
          label: '应付账款余额',
          prop: 'payableBalance',
        },
        {
          label: '待匹配进项税',
          prop: 'inputTax',
        },
        {
          label: '预付账款借方发生额',
          prop: 'advanceBorrowers',
          width: '100px',
        },
        {
          label: '预付账款贷方发生额',
          prop: 'advanceLenders',
          width: '100px',
        },
        {
          label: '预付账款余额',
          prop: 'advanceBalance',
        },
        {
          label: '合同负债贷方发生额',
          prop: 'contractBorrowers',
          width: '100px',
        },
        {
          label: '合同负债借方发生额',
          prop: 'contractLenders',
          width: '100px',
        },
        {
          label: '合同负债余额',
          prop: 'contractBalance',
        },
        {
          label: '存货',
          prop: 'stock',
        },
        {
          label: '合同履约成本',
          prop: 'contractCost',
        },
        {
          label: '其他存货',
          prop: 'otherStock',
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
      console.log('onChange', val);
      this.searchVal = {
        ...val,
      };
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

      listByCondition(parames, 1).then((res) => {
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
    // 导出
    handleExport() {
      this.$confirm('确定导出核算总表列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const parames = {
          data: {
            ...this.searchVal,
          },
          pageNo: this.page.current,
          pageSize: this.page.pageSize,
          sorting: 'id desc',
        };

        exportList(parames, 1).then((res) => {
          if (res && res.code === '200') {
            this.$notify({
              title: '成功',
              message: res.data,
              type: 'success',
              position: 'bottom-right',
            });
          }
          // const fileName = '试算总表列表信息.xlsx';
          // const blob = new Blob([res], {
          //   type: 'application/vnd.ms-excel;charset=utf-8',
          // });

          // if (navigator.msSaveBlob) {
          //   navigator.msSaveBlob(blob, fileName);
          // } else {
          //   const link = document.createElement('a');

          //   link.href = URL.createObjectURL(blob);
          //   link.download = fileName;
          //   link.click();
          //   URL.revokeObjectURL(link.href);
          // }
        });
      });
    },
    // 下载模板
    handleDownLoad() {
      this.$confirm('确定下载模板信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = excelDownload;

        api('financeOutermanagement').then((res) => {
          const fileName = '模板信息.xlsx';
          const blob = new Blob([res], {
            type: 'application/vnd.ms-excel;charset=utf-8',
          });

          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName);
          } else {
            const link = document.createElement('a');

            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(link.href);
          }
        });
      });
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
#trialBalanceManagement {
}
</style>
