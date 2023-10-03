<template>
  <div class="bankRecordInvoiceManagement">
    <div class="bankRecordInvoiceManagement-main">
      <div class="leftTop">
        <left-top-table ref="leftTopTable" @onSelectionChange="leftTableSelect" />
      </div>
      <div class="rightTop">
        <right-top-table ref="rightTopTable" @onSelectionChange="rightTableSelect" />
      </div>
      <div class="leftBottom">
        <left-bottom-table :data="leftTableList" ref="leftBottomTable" />
      </div>
      <div class="rightBottom">
        <right-bottom-table :data="rightTableList" ref="rightBottomTable" />
      </div>
    </div>
    <div class="bankRecordInvoiceManagement-footer">
      <span class="save-btn" v-if="$_hasOperation(routerCode, 'edit')" @click="handleSave">保存</span>
    </div>
  </div>
</template>

<script>
import LeftTopTable from './childTable/leftTopTable';
import RightTopTable from './childTable/rightTopTable';
import LeftBottomTable from './childTable/leftBottomTable';
import RightBottomTable from './childTable/rightBottomTable';
import { saveBlend } from '@/api/financeManagement/bankRecordInvoiceManagement';
export default {
  name: 'bankRecordInvoiceManagement',
  inject: ['common'],
  data() {
    return {
      searchVal: {
        batchID: '',
        result: '',
      },
      searchItems: [
        {
          type: 'input',
          label: '批次号',
          initValue: '',
          props: {
            fieldName: 'batchID',
          },
        },
        {
          type: 'select',
          label: '执行结果',
          initValue: '',
          props: {
            fieldName: 'result',
            filterable: true,
            options: [
              {
                name: '成功',
                id: '1',
              },
              {
                name: '失败',
                id: '0',
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
          label: 'Sheet名',
          prop: 'typeName',
          align: 'center',
        },
        {
          label: '批次号',
          prop: 'batchID',
          align: 'center',
          render: (h, scope) =>
            h(
              'span',
              {
                class: {
                  batchId: true,
                },
                on: {
                  click: () => {
                    this.openDialog('detail', {
                      row: scope.row,
                      type: 'base',
                      configType: 'detail',
                    });
                  },
                },
              },
              scope.row.batchID,
            ),
        },
        {
          label: '文件名称',
          prop: 'fileName',
          align: 'center',
        },
        {
          label: '执行结果',
          prop: 'resultName',
          align: 'center',
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
        },
        {
          label: '创建人',
          prop: 'createUserName',
          align: 'center',
        },
        {
          label: '备注',
          prop: 'remark',
          align: 'center',
        },
      ],
      editshow: false,
      editdata: {},
      leftTableList: [],
      rightTableList: [],
      disabled: false,
    };
  },
  components: {
    LeftTopTable,
    RightTopTable,
    LeftBottomTable,
    RightBottomTable,
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.onSearch();
    // });
  },
  methods: {
    leftTableSelect(args) {
      console.log('args', args);
      if (this.rightTableList.length > 1 && args.length > 1) {
        this.$notify.error({
          title: '失败',
          message: '当前勾兑信息数只能是一条',
          position: 'bottom-right',
        });

        return;
      }
      this.leftTableList = args;
      this.$refs.leftBottomTable.getTableData(args);
    },
    rightTableSelect(args) {
      console.log(args);
      if (this.leftTableList.length > 1 && args.length > 1) {
        this.$notify.error({
          title: '失败',
          message: '当前勾兑信息数只能是一条',
          position: 'bottom-right',
        });

        return;
      }
      this.rightTableList = args;
      this.$refs.rightBottomTable.getTableData(args);
    },

    handleSave() {
      if (this.disabled) {
        return;
      }
      const leftTable = this.$refs.leftBottomTable.tableData,
        rightTable = this.$refs.rightBottomTable.tableData,
        leftMoney = this.$refs.leftBottomTable.totalMoney,
        rightMoney = this.$refs.rightBottomTable.totalMoney;

      if (!leftTable.length) {
        this.$notify.error({
          title: '失败',
          message: '请添加流水明细',
          position: 'bottom-right',
        });

        return;
      }
      if (!rightTable.length) {
        this.$notify.error({
          title: '失败',
          message: '请添加开票明细',
          position: 'bottom-right',
        });

        return;
      }
      if (leftMoney !== rightMoney) {
        this.$notify.error({
          title: '失败',
          message: '流水明细和开票明细金额必须一致',
          position: 'bottom-right',
        });

        return;
      }
      this.disabled = true;
      const params = {
        invoiceBankRecordList: this.$refs.leftBottomTable.tableData.map((ele) => ({
          id: ele.id,
          blendMoney: ele.money,
        })),
        invoiceDetailList: this.$refs.rightBottomTable.tableData.map((ele) => ({
          id: ele.id,
          applyId: ele.applyId,
          blendMoney: ele.money,
          erpNumber: ele.erpNumber,
        })),
      };

      saveBlend(params).then((res) => {
        if (res.code === '200') {
          this.$notify.success({
            title: '成功',
            message: '保存成功',
            position: 'bottom-right',
          });
          this.$refs.leftTopTable.getDataAllList();
          this.$refs.rightTopTable.getDataAllList();
          this.handleClear();
        }
        this.disabled = false;
      });
    },

    handleClear() {
      this.$refs.leftTopTable.clearSelection();
      this.$refs.rightTopTable.clearSelection();
      this.leftTableSelect([]);
      this.rightTableSelect([]);
    },
  },
};
</script>

<style scoped lang="less">
.bankRecordInvoiceManagement {
  width: 100%;
  &-main {
    display: flex;
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
    height: calc(100% - 40px);
    overflow-y: auto;
  }
  .leftTop,
  .rightTop,
  .leftBottom,
  .rightBottom {
    width: 49.5%;
  }
  .bankRecordInvoiceManagement-footer {
    height: 40px;
    line-height: 40px;
    border-top: 1px solid #f4f4f4;
    .save-btn {
      display: inline-block;
      width: 105px;
      height: 30px;
      line-height: 30px;
      color: #fff;
      text-align: center;
      cursor: pointer;
      background: linear-gradient(135deg, #f7660d 0%, #f00a00 100%);
    }
  }
}
</style>
