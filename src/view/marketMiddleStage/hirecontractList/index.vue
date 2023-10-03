/* eslint-disable camelcase */
<template>
  <div id="hirecontractList">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        :addBtnVisible="$_hasOperation(routerCode, 'add')"
        :addTitleBtn="'新增'"
        @onSearch="onSearch"
        @onChange="onChange"
        @onReset="onReset"
        @onAddBtn="onAddBtn"
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
            click: () => handleDownLoad(),
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
              <!--操作-->
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
                icon="iconfont icon-bianji"
                v-if="$_hasOperation(routerCode, 'edit')"
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
                    configType: 'edit',
                  })
                "
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
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import { getHireContractList, hireContractDel } from '@/api/marketMiddleStage/hirecontractList';
import { excelDownload } from '@/api/basicInformationManagement/templetDownloadIndex';
export default {
  name: 'hirecontractList',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {},
      // 搜索条件
      searchItems: [
        {
          type: 'input',
          label: '承揽订单',
          initValue: '',
          props: {
            fieldName: 'orderId',
          },
        },
        {
          type: 'input',
          label: 'ERP编号',
          initValue: '',
          props: {
            fieldName: 'erpId',
          },
        },
        {
          type: 'select',
          label: '合同状态',
          initValue: '',
          props: {
            fieldName: 'contractStatus',
            filterable: true,
            options: this.common().contractStatus,
          },
        },
        {
          type: 'select',
          label: '专业',
          initValue: '',
          props: {
            fieldName: 'major',
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
          type: 'select',
          label: '主体',
          initValue: undefined,
          hide: true,
          props: {
            fieldName: 'subject',
            options: this.common().subjectCode,
          },
        },
        {
          type: 'dataPicker',
          label: '签订时间',
          labelWidth: '90px',
          initValue: '',
          props: {
            type: 'date',
            // format: 'yyyy-MM-dd HH:mm:ss',
            fieldName: 'signDateTime',
            placeholder: '请选择签订时间',
          },
        },
        {
          type: 'dataPicker',
          label: '创建时间起',
          labelWidth: '90px',
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
          label: '承揽订单',
          prop: 'orderId',
        },
        {
          label: 'ERP编码',
          prop: 'erpId',
        },
        {
          label: '大项名称',
          prop: 'projectName',
        },
        {
          label: '大项编号',
          prop: 'projectCode',
        },
        {
          label: '承揽框架编号',
          prop: 'hireId',
        },
        {
          label: '承揽框架',
          prop: 'hireIdName',
        },
        {
          label: '单项名称',
          prop: 'orderName',
        },
        {
          label: '记税方式',
          prop: 'taxTypeName',
        },
        {
          label: '合同总额',
          prop: 'contractAmount',
        },
        {
          label: '施工费',
          prop: 'construction',
        },
        {
          label: '施工费税率',
          prop: 'constructionRateName',
        },
        {
          label: '施工税',
          prop: 'constructionTax',
        },
        {
          label: '施工费合计',
          prop: 'constructionAll',
        },
        {
          label: '材料费',
          prop: 'material',
        },
        {
          label: '材料费税率',
          prop: 'materialRateName',
        },
        {
          label: '材料税',
          prop: 'materialTax',
        },
        {
          label: '总材料费',
          prop: 'materialAll',
        },
        {
          label: '安全生产费',
          prop: 'security',
        },
        {
          label: '其他金额',
          prop: 'other',
        },
        {
          label: '签订日期',
          prop: 'signDate',
        },
        {
          label: '合同状态名称',
          prop: 'contractStatusName',
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
    // 页面首先运行搜索 获取承揽合同信息
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

      // 获取框架列表
      getHireContractList(parames).then((res) => {
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
      if (state === 'del') {
        this.$confirm('确定删除当前项目?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.handlehireContractDel(info.row.id);
        });

        return;
      }
      this.editshow = true;
      this.editdata = info;
    },
    // 删除承揽合同操作
    handlehireContractDel(id) {
      hireContractDel(id).then((res) => {
        if (res && res.code === '200') {
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            position: 'bottom-right',
          });
          this.getDataAllList();
        }
      });
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
    handleDownLoad() {
      this.$confirm('确定下载承揽合同模板信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = excelDownload;

        api('hireContract').then((res) => {
          const fileName = '承揽合同模板信息.xlsx';
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
#hirecontractList {
}
</style>
