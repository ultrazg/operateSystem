<template>
  <div class="invoicePayManagement">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onReset="onReset"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '生成暂估应付款',
            hide: !$_hasOperation(routerCode, 'add'),
            click: () =>
              openDialog('add', {
                row: {},
                type: 'handle',
                configType: 'add',
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
          :hideDefaultIndex="true"
          :selection="true"
          :operator="false"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
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

    <edit
      :show="editshow"
      :data="editdata"
      :title="editTitle"
      :width="editWidth"
      @cancel="closeEdit"
      @success="handleSuccess"
    />
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Edit from './Edit';
import { getListByCommand } from '@/api/financePay/invoicePayManagement';
export default {
  name: 'invoicePayManagement',
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Edit,
  },
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        erpNumber: undefined,
        paymentTime: undefined,
      },
      searchItems: [
        {
          type: 'input',
          label: 'ERP编号',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'erpNumber',
          },
        },
        {
          type: 'dataPicker',
          label: '回款时间',
          labelWidth: '100px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'paymentTime',
            placeholder: '请选择回款时间',
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
          prop: 'verificateUser',
          align: 'center',
        },
        {
          label: '勾兑时间',
          prop: 'verificateTime',
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
      editshow: false,
      editdata: {},
      editTitle: '',
      editWidth: '900px',
    };
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
        sorting: 'create_time desc',
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
      const sonInfo = { ...info };

      if (state === 'add') {
        if (this.multipleSelection.length === 0) {
          this.$notify({
            title: '失败',
            message: '请勾选应付的数据',
            type: 'error',
            position: 'bottom-right',
          });

          return;
        }
        const temp = [];

        sonInfo.params = [];
        this.multipleSelection.forEach((ele) => {
          if (!temp.includes(ele.invoiceDetailId)) {
            temp.push(ele.invoiceDetailId);
          }
          sonInfo.invoiceDetailId = ele.invoiceDetailId; // 旧代码拿数组最后一个值
          sonInfo.erpNumber = ele.erpNumber; // 旧代码拿数组最后一个值
          sonInfo.paymentAmount = (sonInfo.paymentAmount || 0) + parseFloat(ele.paymentAmount);
          sonInfo.params.push({
            id: ele.id,
            bankId: ele.bankId,
            invoiceDetailId: ele.invoiceDetailId,
            paymentAmount: ele.paymentAmount,
            erpNumber: ele.erpNumber,
          });
        });
        if (temp.length > 1) {
          this.$notify({
            title: '失败',
            message: 'ERP编号不一致',
            type: 'error',
            position: 'bottom-right',
          });

          return;
        }
      }
      const title = {
        add: '暂估应付生成',
      };
      const width = {
        add: '1050px',
      };

      this.editTitle = title[info.configType];
      this.editWidth = width[info.configType];
      this.editshow = true;
      this.editdata = sonInfo;
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },

    handleSuccess() {
      this.editshow = false;
      this.$refs.pageTable.getPageTable();
      this.getDataAllList();
    },
  },
};
</script>

<style scoped></style>
