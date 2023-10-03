/* eslint-disable camelcase */
<template>
  <div id="constructionIndex">
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
          :operator="true"
          reserveSelection
          :row-key="getRowKey"
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
                title="下载"
                icon="iconfont icon-xiazai"
                @click.prevent.stop="download(scope.row)"
              >
                下载
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
import { getList, excelDownload } from '@/api/accountManagement/accountResultExport';
export default {
  name: 'accountSummary',
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
          label: '文件名称',
          prop: 'fileName',
        },
        {
          label: '操作人',
          prop: 'createUser',
        },
        {
          label: '操作时间',
          prop: 'createTime',
          width: '100px',
        },
        {
          label: '结果',
          prop: 'resultName',
        },
        {
          label: '备注',
          prop: 'remark',
        },
      ],
    };
  },
  components: {
    PageTable,
    Flex,
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
      console.log('onChange');
    },
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
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getList(parames).then((res) => {
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
      return row.fileCode;
    },
    // 保存选中表格数据
    onSelectionChange(args) {
      // console.log(args, "选中");
      this.multipleSelection = args;
    },
    download(row) {
      excelDownload(row.fileCode).then((res) => {
        const { fileName } = row;
        const blob = new Blob([res], {
          type: 'application/vnd.ms-excel;charset=utf-8',
        });

        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          const link = document.createElement('a');

          link.href = URL.createObjectURL(blob);
          link.download = `${fileName}.xlsx`;
          link.click();
          URL.revokeObjectURL(link.href);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
#accountResultExport {
}
</style>
