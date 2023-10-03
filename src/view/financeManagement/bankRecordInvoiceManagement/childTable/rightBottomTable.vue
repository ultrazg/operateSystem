<template>
  <div class="rightBottomTable">
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          ref="pageTable"
          col-align="left"
          operator-width="110"
          :data="tableData"
          :cols="tableCols"
          :selection="false"
          :operator="true"
          :showPage="false"
          :hideDefaultIndex="true"
          reserveSelection
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          :showSummary="true"
          :summaryMethod="summaryMethod"
        >
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="删除"
                icon="iconfont icon-shanchu"
                @click.prevent.stop="handleDelete(scope)"
              >
                删除
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
  </div>
</template>

<script>
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
export default {
  name: 'rightBottomTable',
  inject: ['common'],
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      multipleSelection: [], // 选中表格数据
      tableData: [],
      tableCols: [
        {
          label: 'erp编号',
          prop: 'erpNumber',
          align: 'center',
          width: 120,
        },
        {
          label: '金额',
          align: 'center',
          prop: 'money',
          width: 120,
          render: (h, scope) => (
            <div class="el-input">
              {
                <div>
                  {
                    <el-input
                      class="editInput"
                      value={scope.row.money}
                      onInput={(val) => {
                        this.changeInput(val, scope.$index, scope);
                      }}
                    ></el-input>
                  }
                </div>
              }
            </div>
          ),
        },
        {
          label: '发票金额',
          prop: 'amount',
          align: 'center',
          width: 120,
        },
        {
          label: '已勾兑金额',
          prop: 'blendMoney',
          align: 'center',
          width: 120,
        },
        {
          label: '开票总额',
          prop: 'applyInvoiceDtoAmount',
          align: 'center',
          width: 120,
        },
        {
          label: '不含税',
          prop: 'amountNTax',
          align: 'center',
          width: 120,
        },
        {
          label: '税金',
          prop: 'amountTax',
          align: 'center',
          width: 120,
        },
        {
          label: '一级专业',
          prop: 'applyInvoiceDtoOneMajor',
          align: 'center',
          width: 120,
        },
        {
          label: '财务核销时间',
          prop: 'applyInvoiceDtoConfirmDate',
          align: 'center',
          width: 120,
        },
      ],
      totalMoney: null,
    };
  },
  components: {
    PageTable,
    Flex,
  },
  methods: {
    changeInput(val, index, scope) {
      const amount = parseFloat(scope.row.amount),
        blendMoney = parseFloat(scope.row.blendMoney),
        value = parseFloat(val);
      const difference = amount - blendMoney;

      if (value > difference) {
        console.log(scope.row);
        this.$notify.error({
          title: '失败',
          message: `当前金额必须少于剩余流水金额${difference}元`,
          position: 'bottom-right',
        });

        return;
      }
      this.$set(this.tableData[index], 'money', val);
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

        if (column.property === 'money') {
          console.log(column, values);
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
    getTableData(args) {
      this.tableData = [...args].map((ele) => {
        const obj = { ...ele };

        obj.money = ele.money ? ele.money : parseFloat(ele.amount) - parseFloat(ele.blendMoney);

        return obj;
      });
    },
    handleDelete(scope) {
      console.log(scope);
      this.tableData.splice(scope.index, 1);
    },
  },
};
</script>

<style scoped lang="less">
.rightBottomTable {
  .comp-page-table {
    min-height: 200px;
  }
}
</style>
