<template>
  <div class="invoiceActualPayment">
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
                title="报账单号填写"
                icon="iconfont icon-bianji"
                v-if="scope.row.status === '1' && $_hasOperation(routerCode, 'edit')"
                @click.prevent.stop="
                  openDialog('rename', {
                    row: scope.row,
                    type: 'rename',
                    configType: 'rename',
                  })
                "
              >
                报账单号填写
              </el-button>
              <el-button
                type="text"
                size="small"
                title="付款驳回"
                icon="iconfont icon-fanhui"
                v-if="scope.row.status === '1' && $_hasOperation(routerCode, 'back')"
                @click.prevent.stop="handleWithdraw(scope.row)"
              >
                付款驳回
              </el-button>
              <el-button
                type="text"
                size="small"
                title="修改"
                icon="iconfont icon-bianji"
                v-if="scope.row.status === '4' && $_hasOperation(routerCode, 'edit')"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'edit',
                  })
                "
              >
                修改
              </el-button>
              <el-button
                type="text"
                size="small"
                title="付款确认"
                icon="iconfont icon-chenggong"
                v-if="scope.row.status === '4' && $_hasOperation(routerCode, 'confirm')"
                @click.prevent.stop="
                  openDialog('confirmPayment', {
                    row: scope.row,
                    type: 'confirmPayment',
                    configType: 'confirmPayment',
                  })
                "
              >
                付款确认
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

    <edit
      :show="editshow"
      :data="editdata"
      :title="editTitle"
      :width="editWidth"
      @cancel="closeEdit"
      @success="successEdit"
    />
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import { getListByCommand, invoiceActualPaymentReject } from '@/api/financePay/invoiceActualPayment';
export default {
  name: 'invoiceActualPayment',
  inject: ['common'],
  props: {
    data: {},
  },
  data() {
    return {
      loading: false,
      searchVal: {
        erpNumber: '',
        contractNo: '',
        status: '',
      },
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
          label: '合作合同编号',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'contractNo',
          },
        },
        {
          type: 'input',
          label: '预缴税编号',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'prePaymentBillid',
          },
        },
        {
          type: 'input',
          label: '报账单号',
          initValue: '',
          props: {
            fieldName: 'paymentNumber',
          },
        },
        {
          type: 'dataPicker',
          label: '付款日期起',
          initValue: '',
          labelWidth: '100px',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'paymentSTime',
            placeholder: '请选择付款日期起',
          },
        },
        {
          type: 'dataPicker',
          label: '付款日期止',
          initValue: '',
          labelWidth: '100px',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'paymentETime',
            placeholder: '请选择付款日期止',
          },
        },
        {
          type: 'select',
          label: '状态',
          initValue: '',
          labelWidth: '70px',
          props: {
            fieldName: 'status',
            filterable: true,
            options: [
              {
                id: '1',
                name: '已生成',
              },
              {
                id: '4',
                name: '已填单',
              },
              {
                id: '2',
                name: '已确认',
              },
              {
                id: '3',
                name: '已驳回',
              },
            ],
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
          label: '来源',
          prop: 'sourceFromName',
          align: 'center',
          width: 140,
        },
        {
          label: '付款报账单号',
          prop: 'paymentNumber',
          align: 'center',
          width: 200,
        },
        {
          label: '付款金额',
          prop: 'paymentAmount',
          align: 'center',
          width: 160,
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          align: 'center',
          width: 160,
        },
        {
          label: '合作合同编号',
          prop: 'contractNo',
          align: 'center',
          width: 160,
        },
        {
          label: '状态',
          prop: 'statusName',
          align: 'center',
          width: 160,
        },
        {
          label: '付款日期',
          prop: 'paymentTime',
          align: 'center',
          width: 160,
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
          width: 160,
        },
        {
          label: '创建人',
          prop: 'createPeople',
          align: 'center',
          width: 160,
        },
        {
          label: '填单时间',
          prop: 'singleTime',
          align: 'center',
          width: 160,
        },
        {
          label: '填单人',
          prop: 'singlePerson',
          align: 'center',
          width: 160,
        },
        {
          label: '确认时间',
          prop: 'updateTime',
          align: 'center',
          width: 160,
        },
        {
          label: '确认人',
          prop: 'updatePeople',
          align: 'center',
          width: 160,
        },
      ],
      editshow: false,
      editdata: {},
      batchId: '',
      editTitle: '',
      editWidth: '900px',
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
      const title = {
        rename: '报账单号填写',
        confirmPayment: '付款确认-付款日期填写',
        edit: '核销执行',
      };
      const width = {
        rename: '500px',
        confirmPayment: '500px',
        edit: '1050px',
      };

      this.editTitle = title[info.configType];
      this.editWidth = width[info.configType];
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
    handleWithdraw(row) {
      this.$confirm('确认驳回?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        invoiceActualPaymentReject(row.id).then((res) => {
          if (res.code === '200') {
            this.$message({
              type: 'success',
              message: '驳回成功!',
            });
            this.getDataAllList();
          }
        });
      });
    },
  },
};
</script>

<style scoped lang="less"></style>
