<template>
  <div class="financialAccount">
    <wrapper :key="'firstTable'" :title="'预缴明细'" :isFold="false">
      <!-- 搜索框 -->
      <header-title>
        <search-form
          ref="firstSearchForm"
          slot="searchBox"
          :searchItems="firstSearchItems"
          @onSearch="onFirstSearch"
          @onReset="onFirstReset"
        />
      </header-title>
      <!-- 页面 -->
      <div class="content-view">
        <div class="Modeltable">
          <page-table
            ref="firstPageTable"
            col-align="left"
            operator-width="110"
            :data="firstTableData"
            :cols="firstTableCols"
            :selection="false"
            :operator="showOperator"
            :hideDefaultIndex="true"
            reserveSelection
            :row-key="getRowKey"
            :page-current="firstPage.current"
            :total="firstPage.total"
            :page-size="firstPage.pageSize"
            @current-change="onFirstCurrentChange"
            @size-change="onFirstPageSizeChange"
          >
            <template slot-scope="scope" slot="operator">
              <flex>
                <el-button
                  type="text"
                  size="small"
                  title="执行列账"
                  icon="iconfont icon-xinzeng"
                  @click.prevent.stop="
                    openDialog('paymentRecord', {
                      row: scope.row,
                      type: 'handle',
                      configType: 'paymentRecord',
                    })
                  "
                >
                  执行列账
                </el-button>
              </flex>
            </template>
          </page-table>
        </div>
      </div>
    </wrapper>
    <wrapper :key="'secondTable'" :title="'分包明细'" :isFold="false">
      <!-- 搜索框 -->
      <header-title>
        <search-form
          ref="secondSearchForm"
          slot="searchBox"
          :searchItems="secondSearchItems"
          @onSearch="onSecondSearch"
          @onReset="onSecondReset"
        />
      </header-title>
      <!-- 页面 -->
      <div class="content-view">
        <div class="Modeltable">
          <page-table
            ref="secondPageTable"
            col-align="left"
            operator-width="110"
            :data="secondTableData"
            :cols="secondTableCols"
            :selection="false"
            :operator="showOperator"
            :hideDefaultIndex="true"
            :showSummary="true"
            reserveSelection
            :row-key="getRowKey"
            :summaryMethod="summaryMethod"
            :page-current="secondPage.current"
            :total="secondPage.total"
            :page-size="secondPage.pageSize"
            @current-change="onFirstCurrentChange"
            @size-change="onFirstPageSizeChange"
          >
            <template slot-scope="scope" slot="operator">
              <flex>
                <el-button
                  type="text"
                  size="small"
                  title="执行列账"
                  icon="iconfont icon-xinzeng"
                  @click.prevent.stop="
                    openDialog('subPackage', {
                      row: scope.row,
                      type: 'handle',
                      configType: 'subPackage',
                    })
                  "
                >
                  执行列账
                </el-button>
              </flex>
            </template>
          </page-table>
        </div>
      </div>
    </wrapper>
    <financialAccountEdit :show="editshow" :data="editdata" @cancel="closeEdit" @success="successEdit" />
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import searchForm from 'components/searchForm/searchForm';
import Flex from '@/components/flex';
import headerTitle from 'components/headerTitle/headerTitle';
import financialAccountEdit from './financialAccountEdit';
import { getLeftList, getRightList } from '@/api/financePay/financeLedger';
export default {
  name: 'financialAccount',
  inject: ['common'],
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    Wrapper,
    financialAccountEdit,
  },
  props: {
    data: {},
  },
  data() {
    return {
      firstSearchVal: {
        billID: '',
      },
      firstSearchItems: [
        {
          type: 'input',
          label: '预缴编号',
          initValue: '',
          props: {
            fieldName: 'billID',
          },
        },
      ],
      firstPage: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      firstTableData: [],
      firstTableCols: [
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          align: 'center',
        },
        {
          label: '预缴编号',
          prop: 'billID',
          align: 'center',
        },
        {
          label: '列账单号',
          prop: 'billNumber',
          align: 'center',
        },
        {
          label: '增值税',
          prop: 'zzs',
          align: 'center',
        },
        {
          label: '城建税',
          prop: 'cjs',
          align: 'center',
        },
        {
          label: '教育费附加',
          prop: 'jys',
          align: 'center',
        },
        {
          label: '地方教育费附加',
          prop: 'dfjyf',
          align: 'center',
        },
      ],
      secondSearchVal: {
        batchID: '',
      },
      secondSearchItems: [
        {
          type: 'input',
          label: '批次号',
          initValue: '',
          props: {
            fieldName: 'batchID',
          },
        },
      ],
      secondPage: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      secondTableData: [],
      secondTableCols: [
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          align: 'center',
        },
        {
          label: '批次号',
          prop: 'batchID',
          align: 'center',
        },
        {
          label: '列账单号',
          prop: 'billNumber',
          align: 'center',
        },
        {
          label: '税额',
          prop: 'taxAmount',
          align: 'center',
        },
        {
          label: '不含税额',
          prop: 'freeAmount',
          align: 'center',
        },
        {
          label: '总额',
          prop: 'priceAmount',
          align: 'center',
        },
      ],
      editshow: false,
      editdata: {},
      selectErpNumber: '',
      editTitle: '',
      editWidth: '900px',
      showOperator: this.data.configType === 'edit',
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.onFirstCurrentChange(1);
      this.onSecondCurrentChange(1);
    });
  },
  methods: {
    // 重置
    onFirstReset() {
      console.log('onFirstReset');
    },
    // 搜索
    onFirstSearch(val) {
      this.firstSearchVal = {
        ...val,
      };
      this.onFirstCurrentChange(1);
    },
    // 请求某页数据
    onFirstCurrentChange(val) {
      this.firstPage.current = val;
      this.getFirstTableData();
    },
    // 改变请求条数
    onFirstPageSizeChange(val) {
      this.firstPage.pageSize = val;
      this.onFirstCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getFirstTableData() {
      const parames = {
        data: {
          ...this.firstSearchVal,
          erpNumber: this.data.row.erpNumber,
        },
        pageNo: this.firstPage.current,
        pageSize: this.firstPage.pageSize,
        sorting: 'id desc',
      };

      getLeftList(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.firstTableData = data;
          this.firstPage.total = total;
        }
      });
    },

    // 重置
    onSecondReset() {
      console.log('onSecondReset');
    },
    // 搜索
    onSecondSearch(val) {
      this.secondSearchVal = {
        ...val,
      };
      this.onSecondCurrentChange(1);
    },
    // 请求某页数据
    onSecondCurrentChange(val) {
      this.secondPage.current = val;
      this.getSecondTableData();
    },
    // 改变请求条数
    onSecondPageSizeChange(val) {
      this.secondPage.pageSize = val;
      this.onSecondCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getSecondTableData() {
      const parames = {
        data: {
          ...this.secondSearchVal,
          erpNumber: this.data.row.erpNumber,
        },
        pageNo: this.secondPage.current,
        pageSize: this.secondPage.pageSize,
        sorting: 'id desc',
      };

      getRightList(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.secondTableData = data;
          this.secondPage.total = total;
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    // 预览
    openDialog(state, info = {}) {
      const title = {
        add: '核销执行',
        edit: '核销执行',
      };
      const width = {
        add: '1150px',
        edit: '1150px',
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
      this.$emit('success');
    },
    summaryMethod(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';

          return;
        }
        const values = data.map((item) => Number(item[column.property]));

        if (column.property === 'priceAmount') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);

            if (!isNaN(value)) {
              return prev + curr;
            }

            return prev;
          }, 0);
          sums[index] = sums[index].toFixed(2);
          this.totalMoney = sums[index];
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
  },
};
</script>

<style scoped lang="less">
.financialAccount {
  .comp-page-table {
    min-height: unset;
  }
}
</style>
