<template>
  <div id="invoiceWriteOffRecord">
    <!--发票核销记录-->
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onChange="onChange"
        @onReset="onReset"
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
              >
                查看
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
import { handleExport, getAllInvoiceList } from '@/api/spliptInvoice/invoiceWriteOffRecord';
export default {
  name: 'invoiceWriteOffRecord',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {},
      // 搜素条件
      searchItems: [
        {
          type: 'input',
          label: '分包发票代码',
          initValue: '',
          props: {
            fieldName: 'invoiceCode',
          },
        },
        {
          type: 'input',
          label: '分包发票号码',
          initValue: '',
          props: {
            fieldName: 'invoiceNumber',
          },
        },
        {
          type: 'select',
          label: '核销状态',
          initValue: '',
          props: {
            fieldName: 'writeOffStatus',
            filterable: true,
            options: this.common().writeOffStatus,
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      multipleSelection: [], // 选中表格数据
      tableData: [], // 表单数据
      tableCols: [
        {
          label: '虚拟发票',
          prop: 'fictitiousInvoice',
        },
        {
          label: '分包发票代码',
          prop: 'invoiceCode',
          width: '120px',
        },
        {
          label: '分包发票号码',
          prop: 'invoiceNumber',
          width: '120px',
        },
        {
          label: '发票类型',
          prop: 'invoiceType',
        },
        {
          label: '开票日期',
          prop: 'createTime',
        },
        {
          label: '发票金额(含税)',
          prop: 'invoiceAmount',
          width: '120px',
        },
        {
          label: '税率(%)',
          prop: 'rate',
          render: (h, scope) => {
            const useItem = this.common().taxRateCode.filter((status) => status.id === scope.row.rate);

            return <div>{useItem && useItem[0] && useItem[0].name}</div>;
          },
        },
        {
          label: '发票税额',
          prop: 'taxAmount',
        },
        {
          label: '发票金额(不含税)',
          prop: 'noTaxAmount',
          width: '120px',
        },
        {
          label: '核销状态',
          prop: 'writeOffStatus',
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
    // onDetailBtn() {
    //   this.editdata = {
    //     row: {},
    //     type: 'base',
    //     configType: 'detail',
    //   };
    //   this.editshow = true;
    // },
    // onAddBtn() {
    //   this.editdata = {
    //     row: {},
    //     type: 'base',
    //     configType: 'add',
    //   };
    //   this.editshow = true;
    // },
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

      getAllInvoiceList(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          // this.tableData = [{id: 1}];
          this.page.total = total;
          this.loading = false;
          console.log('输出列表');
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    // 导出
    handleExport() {
      this.$confirm('确定导出发票核销记录信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = handleExport;

        api({}).then((res) => {
          const fileName = '发票核销记录信息.xlsx';
          const blob = new Blob([res], {
            type: 'application/vnd.ms-excel;charset=uft-8',
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
    // 保存选中表格数据
    onSelectionChange(args) {
      // console.log(args, "选中");
      this.multipleSelection = args;
    },
    // 预览
    openDialog(state, info = {}) {
      const { row } = info;

      this.editdata = {
        row,
        type: 'base',
        configType: 'detail',
      };
      this.editshow = true;
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
#invoiceWriteOffRecord {
}
</style>
