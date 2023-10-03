/* eslint-disable camelcase */
<template>
  <div id="warnTip">
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
            hide: !$_hasOperation(routerCode, 'tipsExport'),
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
          :operator="false"
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
                title="置顶"
                icon="iconfont icon-yulan"
                @click.prevent.stop="
                  openDialog('top', {
                    row: scope.row,
                    type: 'base',
                    configType: 'top',
                  })
                "
              >
                置顶
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
import { pagewarning, exportwarning, updateDisplayStatus } from '@/api/qualificationManagement/qualificationInfo';
import { getExcelList, excelDownload } from '@/api/basicInformationManagement/templetDownloadIndex';
export default {
  name: 'warnTip',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {},
      searchItems: [
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
          props: {
            fieldName: 'qualificationStatus',
            filterable: true,
            options: this.common().qualificationStatus,
          },
        },
        {
          type: 'select',
          label: '呈现',
          initValue: '',
          props: {
            fieldName: 'displayStatus',
            filterable: true,
            options: this.common().displayStatus,
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
          label: '资质类型',
          prop: 'qualificationType',
          render: (h, scope) => {
            const qualificationItem = this.common().qualificationType.filter(
              (status) => status.id === scope.row.qualificationType,
            );

            return <div>{qualificationItem && qualificationItem[0] && qualificationItem[0].name}</div>;
          },
        },
        {
          label: '资质名称',
          prop: 'name',
        },
        {
          label: '资质等级',
          prop: 'level',
        },
        {
          label: '姓名',
          prop: 'personName',
        },
        {
          label: '有效日期',
          prop: 'validityDate',
        },
        {
          label: '颁发机构',
          prop: 'issuingAuthority',
        },
        {
          label: '状态',
          prop: 'status',
          width: '200px',
          render: (h, scope) => {
            const { time } = scope.row;
            const statusItem = this.common().warningStatus.filter((status) => status.id === scope.row.status);

            if (time < 0) {
              return (
                <div class="status">
                  <span>{statusItem && statusItem[0].name}:</span>已过期<span>{time}</span>天
                </div>
              );
            }

            return (
              <div class="status">
                <span>{statusItem && statusItem[0].name}:</span>距离有效期<span>{time}</span>天
              </div>
            );
          },
        },
        {
          label: '呈现状态',
          prop: 'displayStatus',
          render: (h, scope) => {
            const html = (
              <el-switch
                class="editSwitch"
                active-color="#f00a00"
                inactive-color="#C8C8C8"
                value={scope.row[scope.column.property] === '1' || false}
                onChange={(val) => {
                  this.changeInput(val, scope.$index, scope.column.property);
                }}
              ></el-switch>
            );

            return <div>{html}</div>;
          },
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
      console.log('onChange');
    },
    // 搜索
    onSearch(val) {
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

      pagewarning(parames).then((res) => {
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
      this.handleTop(info.row);
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
    handleTop(row) {
      this.$confirm('确定置顶当前数据?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = '';

        api().then((res) => {
          if (res && res.code === '200') {
            this.$notify({
              title: '成功',
              message: '置顶成功',
              type: 'success',
              position: 'bottom-right',
            });
            this.onCurrentChange(1);
          }
        });
      });
    },
    handleExport() {
      this.$confirm('确定导出预警提醒信息列表?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        exportwarning(this.searchVal).then((res) => {
          const fileName = '预警提醒信息列表.xlsx';
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
    // 输入框改变
    changeInput(val, index, name) {
      console.log('val, index, name', val, index, name);
      const { id, qualificationType } = this.tableData[index];
      const status = val === true ? '1' : '0';
      const parame = {
        id,
        qualificationType,
        displayStatus: status,
      };

      updateDisplayStatus(parame).then((res) => {
        if (res && res.code === '200') {
          this.$notify({
            title: '成功',
            message: '呈现更新成功',
            type: 'success',
            position: 'bottom-right',
          });
          this.tableData[index] = {
            ...this.tableData[index],
            [name]: status,
          };
          this.tableData.splice(1, 0);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
#warnTip {
  /deep/.status {
    span {
      color: #ea2134;
    }
  }
}
</style>
