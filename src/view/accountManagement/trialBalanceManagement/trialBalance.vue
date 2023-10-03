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
import { listByCondition, exportList } from '@/api/accountManagement/trialBalanceManagement';
export default {
  name: 'trialBalance',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        month: '',
        accountCode: '',
        costCenterSegment: '',
        projectSegment: '',
        projectName: '',
        customerSegment: '',
        openingBalance: [],
        numberOfBorrowers: [],
        numberOfLenders: [],
        closingBalance: [],
      },
      searchItems: [
        {
          type: 'input',
          label: '科目代码',
          initValue: '',
          props: {
            fieldName: 'accountCode',
            filterable: true,
          },
        },
        {
          type: 'input',
          label: '成本中心段',
          initValue: '',
          props: {
            fieldName: 'costCenterSegment',
            filterable: true,
          },
        },
        {
          type: 'input',
          label: '项目段',
          initValue: '',
          props: {
            fieldName: 'projectSegment',
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
        {
          type: 'input',
          label: '客户段',
          initValue: '',
          props: {
            fieldName: 'customerSegment',
            filterable: true,
          },
        },
        {
          type: 'inputNumberRange',
          label: '期初余额',
          initValue: '',
          props: {
            fieldName: 'openingBalance2',
            filterable: true,
          },
        },
        {
          type: 'inputNumberRange',
          label: '借方数',
          initValue: '',
          props: {
            fieldName: 'numberOfBorrowers',
            filterable: true,
          },
        },
        {
          type: 'inputNumberRange',
          label: '贷方数',
          initValue: '',
          props: {
            fieldName: 'numberOfLenders',
            filterable: true,
          },
        },
        {
          type: 'inputNumberRange',
          label: '期末结余',
          initValue: '',
          props: {
            fieldName: 'closingBalance2',
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
          label: '科目代码',
          prop: 'accountCode',
        },
        {
          label: '科目描述',
          prop: 'subjectDescription',
        },
        {
          label: '公司段',
          prop: 'companySegment',
        },
        {
          label: '成本中心段',
          prop: 'costCenterSegment',
        },
        {
          label: '专业段',
          prop: 'professionalSegment',
        },
        {
          label: '内部往来段',
          prop: 'internalTransactionSection',
        },
        {
          label: '项目段',
          prop: 'projectSegment',
        },
        {
          label: '项目名称',
          prop: 'projectName',
        },
        {
          label: '客户段',
          prop: 'customerSegment',
        },
        {
          label: '期初余额',
          prop: 'openingBalance0',
        },
        {
          label: '借方数',
          prop: 'numberOfBorrowers2',
        },
        {
          label: '贷方数',
          prop: 'numberOfLenders2',
        },
        {
          label: '期末结余',
          prop: 'closingBalance',
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
      const { openingBalance, numberOfBorrowers, numberOfLenders, closingBalance, ...searchVal } = this.searchVal;
      const parames = {
        data: {
          ...searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      if (openingBalance && openingBalance.length > 0) {
        if (openingBalance[0] !== null && openingBalance[1] !== null) {
          parames.data.openingBalance1 = openingBalance[0];
          parames.data.openingBalance2 = openingBalance[1];
        }
      }
      if (numberOfBorrowers && numberOfBorrowers.length > 0) {
        if (numberOfBorrowers[0] !== null && numberOfBorrowers[1] !== null) {
          parames.data.numberOfBorrowers1 = numberOfBorrowers[0];
          parames.data.numberOfBorrowers2 = numberOfBorrowers[1];
        }
      }
      if (numberOfLenders && numberOfLenders.length > 0) {
        if (numberOfLenders[0] !== null && numberOfLenders[1] !== null) {
          parames.data.numberOfLenders1 = numberOfLenders[0];
          parames.data.numberOfLenders2 = numberOfLenders[1];
        }
      }
      if (closingBalance && closingBalance.length > 0) {
        if (closingBalance[0] !== null && closingBalance[1] !== null) {
          parames.data.closingBalance1 = closingBalance[0];
          parames.data.closingBalance2 = closingBalance[1];
        }
      }

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
      this.$confirm('确定导出试算总表列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const { openingBalance, numberOfBorrowers, numberOfLenders, closingBalance, ...searchVal } = this.searchVal;
        const parames = {
          data: {
            ...searchVal,
          },
          pageNo: this.page.current,
          pageSize: this.page.pageSize,
          sorting: 'id desc',
        };

        if (openingBalance && openingBalance.length > 0) {
          if (openingBalance[0] !== null && openingBalance[1] !== null) {
            parames.data.openingBalance1 = openingBalance[0];
            parames.data.openingBalance2 = openingBalance[1];
          }
        }
        if (numberOfBorrowers && numberOfBorrowers.length > 0) {
          if (numberOfBorrowers[0] !== null && numberOfBorrowers[1] !== null) {
            parames.data.numberOfBorrowers1 = numberOfBorrowers[0];
            parames.data.numberOfBorrowers2 = numberOfBorrowers[1];
          }
        }
        if (numberOfLenders && numberOfLenders.length > 0) {
          if (numberOfLenders[0] !== null && numberOfLenders[1] !== null) {
            parames.data.numberOfLenders1 = numberOfLenders[0];
            parames.data.numberOfLenders2 = numberOfLenders[1];
          }
        }
        if (closingBalance && closingBalance.length > 0) {
          if (closingBalance[0] !== null && closingBalance[1] !== null) {
            parames.data.closingBalance1 = closingBalance[0];
            parames.data.closingBalance2 = closingBalance[1];
          }
        }

        exportList(parames).then((res) => {
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
