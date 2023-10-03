/* eslint-disable camelcase */
<template>
  <div id="distribution">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        addBtnVisible
        @onSearch="onSearch"
        @onChange="onChange"
        @onReset="onReset"
        @onAddBtn="onAddBtn"
        :otherBtnVisible="true"
        :otherBtnLists="[
          // {
          //   label: '下载模板',
          //   click: () => handleDown(),
          // },
          // {
          //   label: '模板导入',
          //   click: () =>
          //     openDialog('importInstead', {
          //       row: {},
          //       type: 'importInstead',
          //       configType: 'import',
          //     }),
          // },
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
              >
                查看
              </el-button>
              <el-button
                type="text"
                size="small"
                title="编辑"
                icon="iconfont icon-bianji"
                v-if="parseFloat(scope.row.invoiceRemainingAllocatedAmount) !== 0"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'base',
                    configType: 'edit',
                  })
                "
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                title="删除"
                icon="iconfont icon-shanchu"
                v-if="scope.row.status === '0'"
                @click.prevent.stop="
                  openDialog('delete', {
                    row: scope.row,
                    type: 'finance',
                    configType: 'delete',
                  })
                "
                >删除
              </el-button>
              <el-button
                type="text"
                size="small"
                title="发起申请"
                v-if="scope.row.status === '0'"
                icon="iconfont icon-chenggong"
                @click.prevent.stop="
                  openDialog('fabu', {
                    row: { ...scope.row, businessCode: 't_cooperation_invoice_batch' },
                    type: 'fabu',
                    configType: 'fabu',
                  })
                "
              >
                发起申请
              </el-button>
              <el-button
                type="text"
                size="small"
                title="申请作废"
                icon="iconfont icon-iconclose"
                v-if="scope.row.status === '1'"
                @click.prevent.stop="
                  openDialog('close', {
                    row: { ...scope.row, businessCode: 't_cooperation_invoice_batch' },
                    type: 'close',
                    configType: 'close',
                  })
                "
              >
                申请作废
              </el-button>
            </flex>
          </template>
        </page-table>
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
import { page, deleteInvoice, exportList } from '@/api/spliptInvoice/subpackageBatchManagement/distribution.js';
export default {
  name: 'distributionInfo',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {},
      searchItems: [
        {
          type: 'input',
          label: '合作发票批次',
          initValue: '',
          props: {
            fieldName: 'batchNumber',
          },
        },
        {
          type: 'input',
          label: '合作发票批次名称',
          labelWidth: '120px',
          props: {
            fieldName: 'batchName',
          },
        },
        {
          type: 'select',
          label: '工单状态',
          labelWidth: '80px',
          props: {
            fieldName: 'workOrderStatus',
            filterable: true,
            options: this.common().cooperationInvoiceStatus,
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
          label: '合作发票批次',
          width: '150px',
          prop: 'batchNumber',
        },
        {
          label: '合作发票批次名称',
          width: '120px',
          prop: 'batchName',
        },
        {
          label: '发票总金额(含税)',
          width: '120px',
          prop: 'totalAmount',
        },
        {
          label: '分配总金额',
          width: '100px',
          prop: 'totalAmountAllocated',
        },
        {
          label: '发票剩余分配金额',
          width: '120px',
          prop: 'invoiceRemainingAllocatedAmount',
        },
        {
          label: '项目剩余开票金额',
          hide: true,
          prop: 'remainingBillingAmountOfTheProject',
        },
        {
          label: '录入发票类型',
          prop: 'invoiceType',
          hide: true,
        },
        {
          label: '工单状态',
          prop: 'workOrderStatus',
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
      const parames = {
        data: {
          ...this.searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      page(parames).then((res) => {
        if (res && res.code === '200') {
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
      const { row } = info;

      if (state === 'delete') {
        this.$confirm('确定删除当前发票分配数据?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          const { id } = info.row;

          deleteInvoice(id).then((res) => {
            if (res && res.code === '200') {
              this.$notify({
                title: '成功',
                message: '删除发票分配数据成功',
                type: 'success',
                position: 'bottom-right',
              });
              this.getDataAllList();
            }
          });
        });

        return;
      }
      this.editshow = true;
      this.editdata = info;
    },
    // 导出
    handleExport() {
      this.$confirm('确定导出发票分配列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        exportList(this.searchVal).then((res) => {
          const fileName = '发票分配列表信息.xlsx';
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
#distribution {
}
</style>
