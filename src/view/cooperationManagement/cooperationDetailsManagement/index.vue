<template>
  <div id="cooperationDetailsManagement">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onReset="onReset"
        @onChange="onChange"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '导出',
            hide: !$_hasOperation(routerCode, 'export'),
            click: () => onExportBtn(),
          },
          // {
          //   label: '新增',
          //   click: () =>
          //     openDialog('detail', {
          //       row: {},
          //       type: 'handle',
          //       configType: 'add',
          //     }),
          // },
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
                v-if="$_hasOperation(routerCode, 'delete')"
                icon="iconfont icon-shanchu"
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
  getCooperationDetails,
  deleteCooperationDetailsById,
  getCooperationDetailExcel,
} from '@/api/cooperationUnitManagement/index';

export default {
  name: 'cooperationDetailsManagement',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        contractNo: '',
        unitName: '',
        oneMajor: '',
        twoMajor: '',
        province: '',
        city: '',
        beginDate: '',
        endDate: '',
      },
      searchItems: [
        {
          type: 'input',
          label: '单位名称',
          initValue: '',
          props: {
            fieldName: 'unitName',
          },
        },
        {
          type: 'input',
          label: '合作框架',
          initValue: '',
          props: {
            fieldName: 'contractNo',
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
          type: 'dataPicker',
          label: '开始时间',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'beginDate',
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
            fieldName: 'endDate',
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
          label: '合作单位',
          prop: 'unitName',
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
                      type: 'unitBaseInfo',
                      configType: 'detail',
                    });
                  },
                },
              },
              scope.row.unitName,
            ),
        },
        {
          label: '合作框架',
          prop: 'contractNo',
          // hide: true,
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
                      type: 'contractNo',
                      configType: 'detail',
                    });
                  },
                },
              },
              scope.row.contractNo,
            ),
        },
        {
          label: '合作合同总额(万元)',
          // hide: true,
          prop: 'cooConAllAmount',
        },
        {
          label: '实际合作比例',
          prop: 'actualCooperationRatio',
        },
        {
          label: '省份',
          prop: 'areaPro',
        },
        {
          label: '城市',
          prop: 'areaCity',
        },
        {
          label: '一级专业',
          prop: 'oneMajor',
        },
        {
          label: '合作比例',
          prop: 'ratio',
        },
        {
          label: '预估比例',
          prop: 'estimate',
        },
        {
          label: '开始时间',
          prop: 'sTime',
        },
        {
          label: '结束时间',
          prop: 'eTime',
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
      console.log(val);

      // return;
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
    async onChange(val) {
      if (val.province !== this.searchVal.province) {
        const city = await this.$getCode(val.province);

        // this.$set(this.searchItems[3], 'initValue', val.province);
        this.$set(this.searchItems[4], 'initValue', undefined);
        this.$set(this.searchItems[4].props, 'options', city);
      }
      // if (val.oneMajor !== this.searchVal.oneMajor) {
      //   const twoMajor = await this.$getCode(val.oneMajor);

      //   this.$set(this.searchItems[5], 'initValue', val.oneMajor);
      //   this.$set(this.searchItems[6].props, 'options', twoMajor);
      // }
      this.searchVal = {
        ...val,
      };
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      this.loading = true;
      const parames = {
        data: {
          ...this.searchVal,
        },
        // data: {
        //   unitName: '',
        //   contractNo: '',
        //   oneMajor: '',
        //   areaPro: '',
        //   areaCity: '',
        //   sTime: '',
        //   eTime: '',
        // },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        // sorting: 'create_time desc',
      };

      // console.log('0------');
      // console.log(parames);

      // return;

      // debugger;

      getCooperationDetails(parames).then((res) => {
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
    onExportBtn() {
      this.$confirm('确定导出合作信息管理列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = getCooperationDetailExcel;

        api(this.searchVal).then((res) => {
          const fileName = '合作信息管理列表信息.xlsx';
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
    // 删除合作信息
    handleDelete(row) {
      this.$confirm('确定删除当前合作信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deleteCooperationDetailsById(row.id).then((res) => {
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
  },
};
</script>

<style lang="less" scoped>
#cooperationDetailsManagement {
  /deep/ .batchId {
    cursor: pointer;
    color: #4caae0;
  }
}
</style>
