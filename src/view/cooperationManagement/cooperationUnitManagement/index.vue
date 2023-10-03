<template>
  <div id="cooperationUnitManagement">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        :exportBtnVisible="true"
        @onSearch="onSearch"
        @onChange="onChange"
        @onReset="onReset"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '模板导入',
            hide: !$_hasOperation(routerCode, 'import'),
            click: () =>
              openDialog('import', {
                row: {},
                type: 'import',
                configType: 'import',
              }),
          },
          {
            label: '下载模板',
            hide: !$_hasOperation(routerCode, 'download'),
            click: () => this.handleDownLoad(),
          },
          {
            label: '导出',
            hide: !$_hasOperation(routerCode, 'export'),
            click: () => onExportBtn(),
          },
          {
            label: '新增',
            hide: !$_hasOperation(routerCode, 'add'),
            click: () =>
              openDialog('detail', {
                row: {},
                type: 'handle',
                configType: 'add',
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
                v-if="$_hasOperation(routerCode, 'detail')"
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
                title="编辑"
                icon="iconfont icon-bianji"
                v-if="$_hasOperation(routerCode, 'edit')"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'handle',
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
                @click.prevent.stop="handleDelete(scope.row)"
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

    <edit :show="editshow" :data="editdata" @cancel="closeEdit" @success="successEdit"></edit>
  </div>
</template>
<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm.vue';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import {
  getListByCondition,
  deleteCooperationUnitById,
  getCooperationExcel,
} from '@/api/cooperationUnitManagement/index';
import { excelDownload } from '@/api/basicInformationManagement/templetDownloadIndex';
// import { selectListByParentCode } from '@/api/common';

export default {
  name: 'cooperationUnitManagement',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        status: '',
        businessCode: undefined,
        startTime: undefined,
        endTime: undefined,
      },
      searchItems: [
        {
          type: 'input',
          label: '单位名称',
          initValue: '',
          props: {
            fieldName: 'name',
          },
        },
        {
          type: 'input',
          label: '识别码',
          initValue: '',
          props: {
            fieldName: 'identificationCode',
          },
        },
        {
          type: 'select',
          label: '合作级别',
          initValue: '',
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
          hide: true,
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
          hide: true,
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
      multipleSelection: [], // 选中表格数据
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
          label: '注册资金',
          prop: 'registerCapital',
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
          width: 150,
        },
        {
          label: '备注',
          prop: 'remark',
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
      // console.log(val);
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    onExportBtn() {
      this.$confirm('确定导出合作单位管理列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = getCooperationExcel;

        api().then((res) => {
          const fileName = '合作单位管理列表信息.xlsx';
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
      // window.location.href = 'http://localhost:3000/api/cooperationUnit/getExcel';
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
        // data: {
        //   city: '',
        //   identificationCode: '',
        //   level: '',
        //   name: '',
        //   oneMajor: '',
        //   province: '',
        //   twoMajor: '',
        // },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        // sorting: 'create_time desc',
      };

      getListByCondition(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          // console.log(data, total);

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
    // getTwoMajorInfo(major, initValue = false, row = {}) {
    //   twoMajor(major).then((res) => {
    //     if (res && res.code === '200') {
    //       const majorInfo = res.data.map((item) => ({
    //         name: item.name,
    //         id: item.code,
    //       }));

    //       if (initValue) {
    //         const item = majorInfo.filter((option) => option.name.includes(row.twoMajor));

    //         if (item) {
    //           this.form.twoMajor = item[0].id;
    //         }
    //       }
    //       this.$set(this.layout[0].formItems, 7, {
    //         label: '二级专业',
    //         prop: 'twoMajor',
    //         inputType: 'select',
    //         options: majorInfo,
    //         span: 12,
    //       });
    //     }
    //   });
    // },

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
    // 删除合作单位
    handleDelete(row) {
      this.$confirm('确定删除当前合作单位?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deleteCooperationUnitById(row.id).then((res) => {
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
    handleDownLoad() {
      this.$confirm('确定下载合作单位管理模板信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = excelDownload;

        api('cooperationUnit').then((res) => {
          const fileName = '合作单位管理模板信息.xlsx';
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
#cooperationUnitManagement {
}
</style>
