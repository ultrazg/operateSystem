<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    appendToBody
    :title="`${title}`"
    width="950px"
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
import { getCooperationUnitByCondition } from '@/api/user';
export default {
  name: 'frameworkUnits',
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
      title: '合作单位选择',
      searchVal: {
        unitName: undefined,
        contractNo: undefined,
        province: undefined,
        city: undefined,
      },
      searchItems: [
        {
          type: 'input',
          label: '合作单位',
          props: {
            fieldName: 'name',
          },
        },
        {
          type: 'input',
          label: '识别码',
          labelWidth: '100px',
          props: {
            fieldName: 'identificationCode',
          },
        },
        {
          type: 'select',
          label: '合作级别',
          initValue: undefined,
          props: {
            fieldName: 'level',
            filterable: true,
            options: this.common().cooperationLevelCode,
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
          type: 'select',
          label: '一级专业',
          initValue: undefined,
          props: {
            fieldName: 'oneMajor',
            filterable: true,
            options: this.common().majorCode,
          },
        },
        {
          type: 'select',
          label: '二级专业',
          initValue: undefined,
          props: {
            fieldName: 'twoMajor',
            filterable: true,
            options: [],
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
          label: '单位名称',
          prop: 'name',
        },
        {
          label: '识别码',
          prop: 'identificationCode',
        },
        {
          label: '法人',
          prop: 'legalPerson',
        },
        {
          label: '联系人',
          prop: 'contactsPeople',
        },
        {
          label: '联系电话',
          prop: 'tel',
        },
        {
          label: '开户名',
          prop: 'bank',
        },
        {
          label: '开户账号',
          prop: 'bankCode',
        },
        {
          label: '注册地址',
          prop: 'registerAddress',
        },
        {
          label: '办公地址',
          prop: 'officeAddress',
        },
        {
          label: '合作级别',
          prop: 'level',
        },
        {
          label: '备案人员数量',
          prop: 'userNumber',
        },
        {
          label: '备注',
          prop: 'remark',
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
      this.onSearch();
    },
    // 搜索
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    async onChange(val) {
      if (val.province !== this.searchVal.province) {
        const city = await this.$getCode(val.province);

        // this.$set(this.searchItems[3], 'initValue', val.province);
        this.$set(this.searchItems[4], 'initValue', undefined);
        this.$set(this.searchItems[4].props, 'options', city);
      }
      if (val.oneMajor !== this.searchVal.oneMajor) {
        const twoMajor = await this.$getCode(val.oneMajor);

        // this.$set(this.searchItems[5], 'initValue', val.oneMajor);
        this.$set(this.searchItems[6], 'initValue', undefined);
        this.$set(this.searchItems[6].props, 'options', twoMajor);
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
      const parames = {
        data: {
          ...this.searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getCooperationUnitByCondition(parames).then((res) => {
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
      this.selectTable = {
        data: this.data,
        ...row,
      };
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
      this.$nextTick(() => {
        this.$refs.pageTable.clearCurrentRow();
      });
    },
    successSubmit() {
      this.closeedit();
      this.$emit('success');
      this.$nextTick(() => {
        this.$refs.pageTable.clearCurrentRow();
      });
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
