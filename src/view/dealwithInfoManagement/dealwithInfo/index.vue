<template>
  <div id="dealwithInfo">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
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
                v-if="$_hasOperation(routerCode, 'detail')"
                @click.prevent.stop="
                  openDialog('detail', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'detail',
                  })
                "
              >
                查看
              </el-button>
              <el-button
                type="text"
                size="small"
                title="处理"
                icon="iconfont icon-bianji"
                v-if="scope.row.status !== 'Y' && $_hasOperation(routerCode, 'edit')"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'edit',
                  })
                "
              >
                处理
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
import searchForm from 'components/searchForm/searchForm.vue';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import { getListByCommand } from '@/api/dealwithInfoManagement/index';
export default {
  name: 'dealwithInfo',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {},
      searchItems: [
        {
          type: 'select',
          label: '待办状态',
          initValue: '',
          props: {
            fieldName: 'status',
            filterable: true,
            options: this.common().dealWithStatus,
          },
        },
        {
          type: 'select',
          label: '对应业务',
          initValue: '',
          props: {
            fieldName: 'businessCode',
            filterable: true,
            options: this.common().businessCode,
          },
        },
        {
          type: 'dataPicker',
          label: '开始时间',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'startTime',
            placeholder: '请选择开始时间',
          },
        },
        {
          type: 'dataPicker',
          label: '结束时间',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'endTime',
            placeholder: '请选择结束时间',
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
          label: '待办状态',
          prop: 'statusName',
        },
        {
          label: '对应业务',
          prop: 'businessName',
        },
        {
          label: '待办说明',
          prop: 'explain',
          width: 200,
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: 150,
        },
        {
          label: '处理时间',
          prop: 'updateTime',
          width: 150,
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
      this.editshow = true;
      this.editdata = info;
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
#dealwithInfo {
}
</style>
