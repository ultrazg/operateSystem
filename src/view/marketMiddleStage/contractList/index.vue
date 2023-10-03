/* eslint-disable camelcase */
<template>
  <div id="contractList">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        :addBtnVisible="false && $_hasOperation(routerCode, 'add')"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '导出',
            hide: !$_hasOperation(routerCode, 'export'),
            click: () => handleExport(),
          },
        ]"
        @onSearch="onSearch"
        @onChange="onChange"
        @onReset="onReset"
        @onAddBtn="onAddBtn"
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
                    type: 'base',
                    configType: 'detail',
                  })
                "
              >
                查看
              </el-button>
              <!-- <el-button
                type="text"
                size="small"
                title="编辑"
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
              </el-button> -->
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
import { dialogType } from './utils';
import { pageContractList, exportContract } from '@/api/marketMiddleStage/contractList';
export default {
  name: 'contractList',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        status: 'N',
        businessCode: undefined,
        startTime: undefined,
        endTime: undefined,
      },
      // 搜索条件
      searchItems: [
        {
          type: 'input',
          label: '合同名称',
          initValue: '',
          props: {
            fieldName: 'contractName',
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
        {
          type: 'select',
          label: '合同种类',
          initValue: '',
          props: {
            fieldName: 'projectTye',
            filterable: true,
            options: this.common().projectType,
          },
        },
        {
          type: 'select',
          label: '合同类型',
          initValue: '',
          props: {
            fieldName: 'contractType',
            filterable: true,
            options: this.common().contractTypeCode,
          },
        },
        {
          type: 'dataPicker',
          label: '签订时间',
          initValue: '',
          hide: true,
          props: {
            fieldName: 'signDate',
            type: 'date',
            format: 'yyyy-MM-dd',
            placeholder: '请选择创建时间止',
          },
        },
        {
          type: 'input',
          label: '合作单位',
          hide: true,
          initValue: '',
          props: {
            fieldName: 'unitName',
          },
        },
        {
          type: 'select',
          label: '省份',
          labelWidth: '60px',
          hide: true,
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
          labelWidth: '60px',
          hide: true,
          initValue: undefined,
          props: {
            fieldName: 'city',
            filterable: true,
            options: [],
          },
        },
        {
          type: 'input',
          label: '订单编号',
          hide: true,
          initValue: '',
          props: {
            fieldName: 'orderId',
          },
        },
        {
          type: 'input',
          label: 'ERP编号',
          hide: true,
          initValue: '',
          props: {
            fieldName: 'erpId',
          },
        },
        {
          type: 'dataPicker',
          label: '创建时间起',
          labelWidth: '90px',
          hide: true,
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'beginDate',
            placeholder: '请选择创建时间起',
          },
        },
        {
          type: 'dataPicker',
          label: '创建时间止',
          labelWidth: '90px',
          initValue: '',
          hide: true,
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'endDate',
            placeholder: '请选择创建时间止',
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      multipleSelection: [], // 选中表格数据
      tableData: [], // 表单数据
      tableCols: [
        {
          label: '合同名称',
          prop: 'contractName',
        },
        {
          label: '合同编号',
          prop: 'contractNo',
        },
        {
          label: '合同种类',
          prop: 'projectType',
          render: (h, scope) => {
            const val = scope.row.projectType;

            const valItem = this.common().projectType.filter((item) => item.id === val);

            return <div>{valItem && valItem[0] ? valItem[0].name : ''}</div>;
          },
        },
        {
          label: '合同类型',
          prop: 'contractType',
        },
        {
          label: '合同状态',
          prop: 'contractStatus',
        },
        {
          label: '合同金额(含税)',
          prop: 'contractAll',
        },
        {
          label: '合作单位',
          prop: 'unitName',
        },
        {
          label: '合作比例',
          prop: 'cooperationRatio',
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
    // 页面首先运行搜索 获取合同信息
    this.$nextTick(() => {
      this.onSearch();
    });
  },
  methods: {
    // 重置
    onReset() {
      console.log('onReset');
    },
    async onChange(val) {
      if (val.province !== this.searchVal.province) {
        const city = await this.$getCode(val.province);

        // this.$set(this.searchItems[4], 'initValue', val.province);
        this.$set(this.searchItems[5], 'initValue', undefined);
        this.$set(this.searchItems[5].props, 'options', city);
      }
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
    // 新增
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

      // 获取合同列表
      pageContractList(parames).then((res) => {
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
      const { projectType } = info.row;

      this.editshow = true;
      this.editdata = {
        ...info,
        type: dialogType[`${projectType}`] || 'base',
      };
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },
    // 成功预览
    successEdit() {
      this.closeEdit();
      this.onCurrentChange(1);
    },
    // 导出自建项目信息
    handleExport() {
      this.$confirm('确定导出合作合同列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        exportContract().then((res) => {
          const fileName = '合作合同列表信息.xlsx';
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
#contractList {
}
</style>
