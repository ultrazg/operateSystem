/* eslint-disable camelcase */
<template>
  <div id="receivableEnter">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        :addTitleBtn="'立项申请'"
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
          {
            label: '新增',
            click: () =>
              openDialog('detail', {
                row: {},
                type: 'base',
                configType: 'add',
              }),
          },
          {
            label: '回填',
            hide: true,
            click: () =>
              openDialog('backfill', {
                row: {
                  multipleSelection: multipleSelection,
                },
                type: 'handle',
                configType: 'backfill',
              }),
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
          @selectable="selectable"
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
                v-if="scope.row.status === '0'"
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
                @click.prevent.stop="
                  openDialog('delete', {
                    row: scope.row,
                    type: 'delete',
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
                    row: { ...scope.row, businessCode: 't_invoice_receivable_batch' },
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
                    row: { ...scope.row, businessCode: 't_invoice_receivable_batch' },
                    type: 'close',
                    configType: 'close',
                  })
                "
              >
                申请作废
              </el-button>
              <el-button
                type="text"
                size="small"
                title="回填"
                icon="iconfont icon-daibanshixiang1"
                v-if="scope.row.backfillStatus === '0'"
                @click.prevent.stop="
                  openDialog('backfill', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'backfill',
                  })
                "
              >
                回填
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
import { page, deleteInvoice } from '@/api/receivableManagement/receivableEnter';
export default {
  name: 'receivableEnter',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {},
      searchItems: [
        {
          type: 'input',
          label: '应收发票批次',
          initValue: '',
          props: {
            fieldName: 'batchId',
          },
        },
        {
          type: 'input',
          label: '应收发票批次名称',
          labelWidth: '120px',
          initValue: '',
          props: {
            fieldName: 'name',
          },
        },
        {
          type: 'select',
          label: '委托方',
          labelWidth: '70px',
          initValue: '',
          props: {
            fieldName: 'consignor',
            filterable: true,
            options: this.common().constructionCode,
          },
        },
        {
          type: 'select',
          label: '建设主体',
          labelWidth: '70px',
          initValue: '',
          props: {
            fieldName: 'subject',
            filterable: true,
            options: this.common().subjectCode,
          },
        },
        {
          type: 'select',
          label: '发票类型',
          labelWidth: '70px',
          initValue: '',
          props: {
            fieldName: 'invoiceType',
            filterable: true,
            options: this.common().invoiceType,
          },
        },
        {
          type: 'select',
          label: '项目种类',
          labelWidth: '70px',
          initValue: '',
          props: {
            fieldName: 'projectType',
            filterable: true,
            options: this.common().projectType,
          },
        },
        {
          type: 'select',
          label: '工单状态',
          labelWidth: '70px',
          initValue: '',
          props: {
            fieldName: 'status',
            filterable: true,
            options: this.common().cooperationInvoiceStatus,
          },
        },
        {
          type: 'select',
          label: '回填状态',
          labelWidth: '70px',
          initValue: '',
          props: {
            fieldName: 'backFillStatus',
            filterable: true,
            options: this.common().backFill,
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
          label: '应收发票批次',
          prop: 'batchId',
          width: '120px',
        },
        {
          label: '应收发票批次名称',
          width: '120px',
          prop: 'name',
        },
        {
          label: '支付方式',
          prop: 'payType',
          render: (h, scope) => {
            const d = scope.row;

            const { paymentType } = this.common();
            const invoiceItem = paymentType.filter((code) => code.id === d.payType);

            const html = invoiceItem && invoiceItem[0] && invoiceItem[0].name;

            return <div>{html}</div>;
          },
        },
        {
          label: '委托方',
          prop: 'consignor',
          width: '150px',
        },
        {
          label: '建设主体',
          prop: 'subject',
          width: '200px',
          render: (h, scope) => {
            const d = scope.row;

            const { subjectCode } = this.common();
            const invoiceItem = subjectCode.filter((code) => code.id === d.subject);

            const html = invoiceItem && invoiceItem[0] && invoiceItem[0].name;

            return <div>{html}</div>;
          },
        },
        {
          label: '发票类型',
          prop: 'invoiceType',
          render: (h, scope) => {
            const d = scope.row;

            const { invoiceType } = this.common();
            const invoiceItem = invoiceType.filter((code) => code.id === d.invoiceType);

            const html = invoiceItem && invoiceItem[0] && invoiceItem[0].name;

            return <div>{html}</div>;
          },
        },
        {
          label: '项目种类',
          prop: 'projectType',
          render: (h, scope) => {
            const d = scope.row;

            const { projectType } = this.common();
            const invoiceItem = projectType.filter((code) => code.id === d.projectType);

            const html = invoiceItem && invoiceItem[0] && invoiceItem[0].name;

            return <div>{html}</div>;
          },
        },
        {
          label: '回填状态',
          prop: 'backfillStatus',
          render: (h, scope) => {
            const d = scope.row;

            const { backFill } = this.common();
            const invoiceItem = backFill.filter((code) => code.id === d.backfillStatus);

            const html = invoiceItem && invoiceItem[0] && invoiceItem[0].name;

            return <div>{html}</div>;
          },
        },
        {
          label: '工单状态',
          prop: 'status',
          render: (h, scope) => {
            const d = scope.row;

            const { cooperationInvoiceStatus } = this.common();
            const invoiceItem = cooperationInvoiceStatus.filter((code) => code.id === d.status);

            const html = invoiceItem && invoiceItem[0] && invoiceItem[0].name;

            return <div>{html}</div>;
          },
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
      // this.$refs.searchForm.addInitValue();
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
    selectable(row, index) {
      return row.backfillStatus === '待回填';
    },
    // 保存选中表格数据
    onSelectionChange(args) {
      // console.log(args, "选中");
      this.multipleSelection = args;
    },
    // 预览
    openDialog(state, info = {}) {
      if (state === 'delete') {
        this.$confirm('确定删除当前应收发票数据?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          const { id } = info.row;

          deleteInvoice(id).then((res) => {
            if (res && res.code === '200') {
              this.$notify({
                title: '成功',
                message: '删除应收发票数据成功',
                type: 'success',
                position: 'bottom-right',
              });
              this.getDataAllList();
            }
          });
        });

        return;
      }
      // if (state === 'backfill' && this.multipleSelection.length === 0) {
      //   this.$notifyError('请先选择要进行回填的数据！');

      //   return;
      // }
      this.editshow = true;
      this.editdata = info;
    },
    // 导出
    handleExport() {
      this.$confirm('确定导出应收发票列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        exportList(this.searchVal).then((res) => {
          const fileName = '应收发票列表信息.xlsx';
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
#receivableEnter {
}
</style>
