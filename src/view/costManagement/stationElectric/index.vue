<template>
  <div id="stationElectric">
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
            click: () => handleExport(),
          },
          {
            label: '下载模板',
            click: () => handleDownLoad(),
          },
          {
            label: '导入模板',
            click: () =>
              openDialog('import', {
                row: {},
                type: 'import',
                configType: 'import',
              }),
          },
          {
            label: '生成暂估应付',
            disabled: !multipleSelection || multipleSelection.length === 0,
            click: () =>
              openDialog('create', {
                row: multipleSelection,
                type: 'handle',
                configType: 'create',
              }),
          },
        ]"
      />
      <!-- {
        label: '新增',
        click: () => onAddBtn(),
      }, -->
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
                title="电费详情"
                icon="iconfont icon-yulan"
                @click.prevent.stop="
                  openDialog('electricDetail', {
                    row: scope.row,
                    type: 'electricityFee',
                    configType: 'electricDetail',
                  })
                "
                >电费详情
              </el-button>
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
                >查看
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

    <Edit :show="editshow" :data="editdata" @cancel="closeEdit" @success="successEdit"></Edit>
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import { pageStationElectric, handleExport } from '@/api/costManagement/stationElectric';
import { excelDownload } from '@/api/basicInformationManagement/templetDownloadIndex';
export default {
  name: 'stationElectric',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {},
      searchItems: [
        {
          type: 'select',
          label: '地市',
          initValue: '',
          props: {
            fieldName: 'city',
            filterable: true,
            // options: this.common().cityErpByParentCode,
            // options: this.$getCodeV1(20),
          },
        },
        {
          type: 'input',
          label: '站点名称',
          initValue: '',
          props: {
            fieldName: 'stationName',
          },
        },
        {
          type: 'select',
          label: '站点类型',
          initValue: '',
          props: {
            fieldName: 'stationType',
            filterable: true,
            options: this.common().stationType,
          },
        },
        {
          type: 'input',
          label: '合同编号',
          initValue: '',
          props: {
            fieldName: 'contractNo',
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
          label: '地市',
          prop: 'city',
        },
        {
          label: '站点名称',
          prop: 'stationName',
        },
        {
          label: '站点类型',
          prop: 'stationType',
        },
        {
          label: '合同编号',
          prop: 'contractNo',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
        },
        {
          label: '物业编号',
          prop: 'propertyNumber',
        },
        {
          label: '电费总成本',
          prop: 'amountAll',
        },
        {
          label: '已付款金额',
          prop: 'amountPaid',
        },
        {
          label: '待付款金额',
          prop: 'amountWaitPaid',
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
      this.setCity();
    });
  },
  methods: {
    async setCity(val) {
      // 这里是写的固定的(后台说的)
      const city = await this.$getCodeV1(20);

      const resCity = city.map((item) => ({
        ...item,
        name: item.cityName + (item.cityErp || item.areaName),
        // id: item.cityCode || item.areaCode,
        id: item.cityErp,
        // erp: item.cityErp,
      }));

      this.$set(this.searchItems[0].props, 'options', resCity);
    },
    // 重置
    onReset() {
      console.log('onReset');
    },
    onChange(val) {
      console.log('onChange');
      this.searchVal = {
        ...val,
      };
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
        sorting: 'id desc',
      };

      pageStationElectric(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
          this.loading = false;
        }
      });
    },
    handleExport() {
      this.$confirm('确定导出站点电费统计信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = handleExport;

        api(this.searchVal).then((res) => {
          const fileName = '站点电费统计信息.xlsx';
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
    handleDownLoad() {
      this.$confirm('确定下载以租代建电费模板信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = excelDownload;

        api('stationElectric').then((res) => {
          const fileName = '以租代建电费模板信息.xlsx';
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
    onAddBtn() {
      this.editdata = {
        row: {},
        type: 'base',
        configType: 'add',
      };
      this.editshow = true;
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
      if (state === 'create') {
        return;
      }
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
#stationElectric {
}
</style>
