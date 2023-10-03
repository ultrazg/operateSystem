/* eslint-disable camelcase */
<template>
  <div id="writeOff">
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
                    type: 'handle',
                    configType: 'detailWriteOff',
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
                    type: 'handle',
                    configType: 'editWriteOff',
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
                    row: { ...scope.row, businessCode: 't_write_off_invoice_batch' },
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
                    row: { ...scope.row, businessCode: 't_write_off_invoice_batch' },
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
import { page, exportList } from '@/api/spliptInvoice/subpackageBatchManagement/writeOff.js';
export default {
  name: 'writeOff',
  inject: ['common'],
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
          initValue: '',
          props: {
            fieldName: 'batchName',
          },
        },
        {
          type: 'select',
          label: '工单状态',
          initValue: '',
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
          prop: 'batchNumber',
          width: '120px',
        },
        {
          label: '合作发票批次名称',
          prop: 'batchName',
          width: '120px',
        },
        {
          label: '发票总分配金额',
          prop: 'totalAmount',
          width: '120px',
        },
        {
          label: '核销总金额',
          prop: 'totalWriteOffAmount',
          width: '120px',
        },
        {
          label: '真实发票剩余金额',
          prop: 'invoiceRemainingAllocatedAmount',
          width: '150px',
        },
        {
          label: '虚拟发票待核销金额',
          prop: 'remainingBillingAmountOfTheProject',
          hide: true,
          width: '150px',
        },
        {
          label: '是否核销完成',
          prop: 'whetherTheWriteOffIsCompleted',
          width: '120px',
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
        type: 'handle',
        configType: 'addWriteOff',
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
      if (state === 'delete') {
        this.$confirm('确定删除当前发票核销数据?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          const { id } = info.row;

          deleteInvoice(id).then((res) => {
            if (res && res.code === '200') {
              this.$notify({
                title: '成功',
                message: '删除发票核销数据成功',
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
      this.$confirm('确定导出发票核销列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        exportList(this.searchVal).then((res) => {
          const fileName = '发票核销列表信息.xlsx';
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
#writeOff {
}
</style>
