/* eslint-disable camelcase */
<template>
  <div id="qualificationCompany">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onChange="onChange"
        @onReset="onReset"
        @onAddBtn="onAddBtn"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '导出',
            hide: !$_hasOperation(routerCode, 'export'),
            click: () => handleExport(),
          },
          {
            label: '新增',
            hide: !$_hasOperation(routerCode, 'add'),
            click: () =>
              openDialog('detail', {
                row: {},
                type: 'base',
                configType: 'add',
              }),
          },
          {
            label: '申请',
            hide: !$_hasOperation(routerCode, 'apply'),
            disabled: multipleSelection.length === 0,
            click: () =>
              openDialog('apply', {
                row: {},
                type: 'handle',
                configType: 'apply',
              }),
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
          :selection="true"
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
                title="编辑"
                v-if="$_hasOperation(routerCode, 'edit')"
                icon="iconfont icon-bianji"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'base',
                    configType: 'edit',
                  })
                "
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                title="删除"
                icon="iconfont icon-shanchu"
                v-if="$_hasOperation(routerCode, 'delete')"
                @click.prevent.stop="
                  openDialog('del', {
                    row: scope.row,
                    type: 'base',
                    configType: 'del',
                  })
                "
              >
                删除
              </el-button>
              <el-button
                type="text"
                size="small"
                title="下载"
                icon="iconfont icon-shanchu"
                v-if="$_hasOperation(routerCode, 'download')"
                @click.prevent.stop="
                  openDialog('download', {
                    row: scope.row,
                    type: 'download',
                    configType: 'download',
                  })
                "
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

    <edit :show="editshow" :data="editdata" @cancel="closeEdit" @success="successEdit"></edit>
  </div>
</template>

<script>
import download from 'downloadjs';
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import { pagecompany, deletecompany, exportcompany } from '@/api/qualificationManagement/qualificationCompany';
import { excelDownload } from '@/api/basicInformationManagement/excelImportList';
export default {
  name: 'qualificationCompany',
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
            fieldName: 'status',
            filterable: true,
            options: this.common().qualificationStatus,
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
          label: '资质名称',
          prop: 'name',
        },
        {
          label: '资质等级',
          prop: 'level',
        },
        {
          label: '有效期',
          width: 200,
          prop: 'validityDate',
        },
        {
          label: '颁发机构',
          width: 200,
          prop: 'issuingAuthority',
        },
        {
          label: '资质状态',
          prop: 'statusInfo',
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

      pagecompany(parames).then((res) => {
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
    subAfter(str) {
      const indexsss = str.lastIndexOf('.');

      return str.substring(indexsss + 1, str.length);
    },
    // 预览
    openDialog(state, info = {}) {
      if (state === 'apply') {
        this.editshow = true;
        this.editdata = {
          ...info,
          row: this.multipleSelection,
        };

        return;
      }
      if (state === 'del') {
        this.handleDelete(info.row);

        return;
      }
      if (state === 'download') {
        const { files } = info.row;

        files.forEach((file) => {
          excelDownload(file.fileCode).then((res) => {
            const reader = new FileReader();

            reader.readAsText(res, 'utf-8');

            reader.onload = () => {
              const afterName = {
                png: 'image/png',
                jpg: 'image/jpeg',
                pdf: 'application/pdf',
              };
              const typeName = this.subAfter(file.fileName);
              // const result = JSON.parse(reader.result);
              // 处理报错信息 JSON.parse(reader.result)拿到报错信息

              if (reader.result.indexOf('下载发生异常') > -1) {
                this.$notifyError('下载发生异常，文件不存在，请联系管理员');
              } else {
                const { fileName } = file;
                const blob = new Blob([res], {
                  type: afterName[typeName],
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
              }
            };
          });
        });

        return;
      }
      this.editshow = true;
      this.editdata = info;
    },
    getResult(file, reader, res) {
      const afterName = {
        png: 'image/png',
        jpg: 'image/jpeg',
        pdf: 'application/pdf',
      };
      const typeName = this.subAfter(file.fileName);
      const result = JSON.parse(reader.result);
      // 处理报错信息 JSON.parse(reader.result)拿到报错信息

      if (result && result.code === 9999) {
        this.$notifyError(result.message);
      } else {
        const { fileName } = file;
        const blob = new Blob([res], {
          type: afterName[typeName],
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
      }
    },
    // 删除信息
    handleDelete(row) {
      this.$confirm('确定删除当前资质信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deletecompany(row.id).then((res) => {
          if (res.code === '200') {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.getDataAllList();
          }
        });
      });
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },
    successEdit() {
      this.closeEdit();
      this.$refs.pageTable.getPageTable();
      this.onCurrentChange(1);
    },
    handleExport() {
      this.$confirm('确定导出公司资质列表?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        exportcompany(this.searchVal).then((res) => {
          const fileName = '公司资质列表.xlsx';
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
#qualificationCompany {
}
</style>
