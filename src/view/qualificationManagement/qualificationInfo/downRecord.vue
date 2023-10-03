/* eslint-disable camelcase */
<template>
  <div id="downRecord">
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
            hide: !$_hasOperation(routerCode, 'applyExport'),
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
              <el-button
                type="text"
                size="small"
                title="资质清单"
                icon="iconfont icon-bianji"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'handle',
                  })
                "
              >
                资质清单
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
import { pagerecord, exportrecord } from '@/api/qualificationManagement/qualificationInfo';
export default {
  name: 'downRecord',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {},
      searchItems: [
        {
          type: 'input',
          label: '申请人',
          initValue: '',
          props: {
            fieldName: 'applyPeople',
          },
        },
        {
          type: 'input',
          label: '资质名称',
          initValue: '',
          props: {
            fieldName: 'name',
          },
        },
        {
          type: 'select',
          label: '资质状态',
          initValue: '',
          hide: true,
          props: {
            fieldName: 'qualificationStatus',
            filterable: true,
            options: this.common().qualificationStatus,
          },
        },
        {
          type: 'select',
          label: '申请状态',
          initValue: '',
          props: {
            fieldName: 'applyStatus',
            filterable: true,
            options: this.common().approvalStatus,
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
          label: '申请人',
          prop: 'applyPeople',
        },
        {
          label: '申请时间',
          prop: 'applyTime',
        },
        {
          label: '申请资质类型',
          prop: 'qualificationType',
          // render: (h, scope) => {
          //   const qualificationItem = this.common().qualificationType.filter(
          //     (status) => status.id === scope.row.qualificationType,
          //   );

          //   return <div>{qualificationItem && qualificationItem[0].name}</div>;
          // },
        },
        {
          label: '申请资质名称',
          prop: 'name',
        },
        {
          label: '用途',
          prop: 'use',
        },
        {
          label: '审批状态',
          prop: 'applyStatus',
        },
        {
          label: '审批时间',
          prop: 'approvalTime',
        },
        {
          label: '下载状态',
          prop: 'downloadStatus',
        },
        {
          label: '下载时间',
          prop: 'downloadTime',
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
      console.log('onChange', val);
    },
    // 搜索
    onSearch(val) {
      console.log('val', val);
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    onAddBtn() {
      this.editdata = {
        row: {},
        type: 'base',
        configType: 'add',
      };
      this.editshow = true;
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
        sorting: 'id desc',
      };

      pagerecord(parames).then((res) => {
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
    handleExport() {
      this.$confirm('确定导出信息记录管理列表?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        exportrecord(this.searchVal).then((res) => {
          const fileName = '信息记录管理列表.xlsx';
          const blob = new Blob([res], {
            type: 'application/vnd.ms-excel;charset=utf-8',
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
  },
};
</script>

<style lang="less" scoped>
#downRecord {
}
</style>
