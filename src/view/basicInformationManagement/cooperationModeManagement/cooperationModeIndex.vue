/* eslint-disable camelcase */
<template>
  <div id="cooperationModeIndex">
    <!-- 页面 -->
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          ref="pageTable"
          col-align="left"
          operator-width="110"
          :hideDefaultIndex="true"
          :loading="loading"
          :data="tableData"
          :cols="tableCols"
          :selection="false"
          :operator="false"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @selection-change="onSelectionChange"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          :treeProps="{ children: 'detailList', hasChildren: 'detailList.length > 0' }"
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
</template>

<script>
import PageTable from '@/components/page-table';
import { getCooperationModeListByCondition } from '@/api/basicInformationManagement/cooperationModeIndex';
export default {
  name: 'cooperationModeIndex',
  inject: ['common'],
  data() {
    return {
      loading: false,
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      multipleSelection: [], // 选中表格数据
      tableData: [],
      tableCols: [
        {
          label: '合作模式编号',
          prop: 'code',
          align: 'center',
        },
        {
          label: '合作模式名称',
          prop: 'name',
          align: 'center',
        },
        {
          label: '值',
          prop: 'value',
          align: 'center',
        },
        {
          label: '描述',
          prop: 'description',
          align: 'center',
        },
      ],
    };
  },
  components: {
    PageTable,
  },
  mounted() {
    this.$nextTick(() => {
      this.onSearch();
    });
  },
  methods: {
    // 搜索
    onSearch(val) {
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
          code: 'cooperation_mode',
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getCooperationModeListByCondition(parames).then((res) => {
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
      return row.code;
    },
    // 保存选中表格数据
    onSelectionChange(args) {
      // console.log(args, "选中");
      this.multipleSelection = args;
    },
  },
};
</script>

<style lang="less" scoped>
#cooperationModeIndex {
}
</style>
