<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    appendToBody
    :title="`${title}`"
    width="1050px"
    :visible.sync="dialogShow"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <!-- 搜索框 -->
      <header-title>
        <search-form
          ref="searchForm"
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
          @onChange="onChange"
        />
      </header-title>
      <!-- 页面 -->
      <div class="content-view">
        <div class="Modeltable">
          <page-table
            ref="pageTable"
            col-align="left"
            operator-width="110"
            :data="tableData"
            :cols="tableCols"
            highlightCurrentRow
            reserveSelection
            :row-key="getRowKey"
            :page-current="page.current"
            :total="page.total"
            :page-size="page.pageSize"
            @row-current-change="handleRowChange"
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
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import headerTitle from '@/components/headerTitle/headerTitle';
import searchForm from '@/components/searchForm/searchForm.vue';
import PageTable from '@/components/page-table';
import { getCooContractList } from '@/api/user';
export default {
  name: 'CooperationContract',
  components: {
    dialogCont,
    headerTitle,
    searchForm,
    PageTable,
  },
  props: {
    data: {},
    show: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['common'],
  data() {
    return {
      scrollHeight: 'auto',
      title: '合作合同',
      searchVal: {
        unitName: undefined,
        contractNo: undefined,
        province: undefined,
        city: undefined,
        erpId: undefined,
      },
      searchItems: [
        {
          type: 'input',
          label: '合同名称',
          props: {
            fieldName: 'contractName',
            filterable: true,
          },
        },
        {
          type: 'input',
          label: '合同编号',
          props: {
            fieldName: 'contractNo',
            filterable: true,
          },
        },
        {
          type: 'dataPicker',
          label: '签订时间',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'signDate',
            placeholder: '请选择签订时间',
          },
        },
        {
          type: 'input',
          label: '合作单位',
          props: {
            fieldName: 'unitName',
            filterable: true,
          },
        },
        {
          type: 'select',
          label: '省份',
          initValue: undefined,
          props: {
            fieldName: 'province',
            filterable: true,
            options: this.common().provincialCode,
          },
        },
        {
          type: 'select',
          label: '城市',
          initValue: undefined,
          props: {
            fieldName: 'city',
            filterable: true,
            options: [],
          },
        },
        {
          type: 'input',
          label: '订单编号',
          props: {
            fieldName: 'orderId',
            filterable: true,
          },
        },
        {
          type: 'input',
          label: 'ERP编号',
          props: {
            fieldName: 'erpId',
            filterable: true,
          },
        },
        {
          type: 'select',
          label: '主体',
          initValue: undefined,
          props: {
            fieldName: 'subject',
            filterable: true,
            options: this.common().subjectCode,
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      selectTable: {}, // 选中表格数据
      tableData: [],
      tableCols: [
        {
          label: '合同名称',
          prop: 'contractName',
          width: 200,
        },
        {
          label: '合作单位',
          prop: 'unitName',
          width: 200,
        },
        {
          label: '合同编号',
          prop: 'contractNo',
          width: 200,
        },
        {
          label: '合同状态',
          prop: 'contractStatus',
          width: 200,
        },
        {
          label: '合同类型',
          prop: 'contractType',
          width: 200,
        },
        {
          label: '合同金额',
          prop: 'contractAll',
          width: 200,
        },
        {
          label: '审定金额',
          prop: 'verdictAmount',
          width: 200,
        },
        {
          label: '开主体始时间',
          prop: 'subject',
          width: 200,
        },
        {
          label: '计税方式',
          prop: 'taxType',
          width: 200,
        },
        {
          label: 'ERP编号',
          prop: 'erpId',
          width: 200,
        },
        {
          label: '订单编号',
          prop: 'orderId',
          width: 200,
        },
        {
          label: '文件数',
          prop: 'documents',
          width: 200,
        },
        {
          label: '存档日期',
          prop: 'documentDate',
          width: 200,
        },
        {
          label: '施工费合计',
          prop: 'constructionAll',
          width: 200,
        },
        {
          label: '施工费',
          prop: 'construction',
          width: 200,
        },
        {
          label: '施工税率',
          prop: 'constructionRate',
          width: 200,
        },
        {
          label: '施工税',
          prop: 'constructionTax',
          width: 200,
        },
        {
          label: '总材料费',
          prop: 'materialAll',
          width: 200,
        },
        {
          label: '材料费',
          prop: 'material',
          width: 200,
        },
        {
          label: '材料费税率',
          prop: 'materialRate',
          width: 200,
        },
        {
          label: '材料税',
          prop: 'materialTax',
          width: 200,
        },
        {
          label: '预缴税',
          prop: 'provisionalTax',
          width: 200,
        },
        {
          label: '其他费用',
          prop: 'other',
          width: 200,
        },
        {
          label: '设计单位',
          prop: 'design',
          width: 200,
        },
        {
          label: '创建人',
          prop: 'createPeople',
          width: 200,
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: 200,
        },
        {
          label: '安全生产费',
          prop: 'security',
          width: 200,
        },
        {
          label: '备注',
          prop: 'remark',
          width: 200,
        },
        {
          label: '签订日期',
          prop: 'signDate',
          width: 200,
        },
      ],
    };
  },
  computed: {
    dialogShow: {
      get() {
        return this.show;
      },
      set(v) {
        console.log('set');
      },
    },
  },
  methods: {
    openedit() {
      this.$set(this.searchVal, 'erpId', this.data.erpNumber || '');
      this.$set(this.searchItems[7], 'initValue', this.data.erpNumber || '');
      this.onCurrentChange(1);
    },
    // 搜索
    onSearch(val) {
      console.log(val);
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    async onChange(val) {
      if (val.province !== this.searchVal.province) {
        const city = await this.$getCode(val.province);

        // this.$set(this.searchItems[4], 'initValue', val.province);
        this.$set(this.searchItems[5], 'initValue', undefined);
        this.$set(this.searchItems[5].props, 'options', city);
      }
      this.searchVal = {
        ...val,
      };
    },
    // 请求某页数据
    onCurrentChange(val) {
      this.page.current = val;
      this.getDataAllList();
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      console.log(this.searchVal);
      const parames = {
        data: {
          ...this.searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getCooContractList(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
        }
      });
    },
    // 改变请求条数
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 入参添加列表选中
    handleRowChange(row) {
      console.log(row, 'sortKey值');
      this.selectTable = row;
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    closeedit() {
      this.canceledit();
    },
    canceledit(type) {
      this.$emit('cancel', type);
    },
    confirmedit() {
      this.closeedit();
      this.$emit('success', this.selectTable);
    },
    successSubmit() {
      this.closeedit();
      this.$emit('success');
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~'>>>';

@{deep}.el-dialog__body {
  padding-right: 4px;
}
.scrollView {
  overflow: hidden;
  overflow-y: auto;
  padding-right: 10px;
  // 重写滚动条样式
  &::-webkit-scrollbar-track-piece {
    //滚动条凹槽的颜色，还可以设置边框属性
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    //滚动条的宽度
    width: 4px;
    height: 4px;
    border-radius: 2px;
    margin-right: 2px;
    position: relative;
  }
  &::-webkit-scrollbar-thumb {
    //滚动条的设置
    background: #d5d5d5;
    background-clip: padding-box;
    min-height: 28px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #d5d5d5;
  }
}
</style>
