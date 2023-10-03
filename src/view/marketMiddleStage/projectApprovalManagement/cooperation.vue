/* eslint-disable camelcase */
<template>
  <!--协作部分 -->
  <div id="cooperation">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        :addBtnVisible="$_hasOperation(routerCode, 'add')"
        :addTitleBtn="'立项申请'"
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
              <!--操作 -->
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
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'edit')"
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
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'delete')"
                icon="iconfont icon-shanchu"
                @click.prevent.stop="
                  openDialog('del', {
                    row: scope.row,
                    configType: 'edit',
                  })
                "
              >
                删除
              </el-button>
              <el-button
                type="text"
                size="small"
                title="提交审核"
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'submitAudit')"
                icon="iconfont icon-fabu"
                @click.prevent.stop="
                  openDialog('fabu', {
                    row: { ...scope.row, businessCode: 't_project_approval' },
                    type: 'fabu',
                    configType: 'fabu',
                  })
                "
              >
                提交审核
              </el-button>
              <el-button
                type="text"
                size="small"
                title="项目过程"
                v-if="scope.row.status === 'verify_pass' && $_hasOperation(routerCode, 'ppm')"
                icon="iconfont icon-guochengguanli"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'handle',
                  })
                "
              >
                项目过程
              </el-button>
              <el-button
                type="text"
                size="small"
                title="项目分解"
                v-if="scope.row.status === 'verify_pass' && $_hasOperation(routerCode, 'split')"
                icon="iconfont icon-chaifenbiaoji"
                @click.prevent.stop="
                  openDialog('decompose', {
                    row: scope.row,
                    type: 'decompose',
                    configType: 'decompose',
                  })
                "
              >
                项目分解
              </el-button>
              <el-button
                type="text"
                size="small"
                title="申请作废"
                v-if="scope.row.status === 'verify_pass' && $_hasOperation(routerCode, 'cancle')"
                icon="iconfont icon-iconclose"
                @click.prevent.stop="
                  openDialog('close', {
                    row: { ...scope.row, businessCode: 't_project_approval' },
                    type: 'close',
                    configType: 'close',
                  })
                "
              >
                申请作废
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
import headerTitle from '@/components/headerTitle/headerTitle';
import searchForm from '@/components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import { getListByCondition, delProjectApproval } from '@/api/marketMiddleStage/projectApprovalManagement';
import { excelDownload } from '@/api/basicInformationManagement/templetDownloadIndex';

export default {
  name: 'cooperationInfo',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        name: undefined,
        erpNumber: undefined,
        consignor: undefined,
        oneMajor: undefined,
        twoMajor: undefined,
        status: undefined,
        province: undefined,
        city: undefined,
      },
      // 搜索条件
      searchItems: [
        {
          type: 'input',
          label: '项目名称',
          initValue: undefined,
          props: {
            fieldName: 'name',
            filterable: true,
          },
        },
        {
          type: 'input',
          label: 'ERP编号',
          initValue: undefined,
          props: {
            fieldName: 'erpNumber',
            filterable: true,
          },
        },
        {
          type: 'select',
          label: '委托方',
          initValue: undefined,
          props: {
            fieldName: 'consignor',
            filterable: true,
            options: this.common().constructionCode,
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
          label: '二级专业',
          initValue: undefined,
          props: {
            fieldName: 'twoMajor',
            filterable: true,
            options: [],
          },
        },
        {
          type: 'select',
          label: '审核状态',
          initValue: undefined,
          props: {
            fieldName: 'status',
            filterable: true,
            options: this.common().verifyStatusCode,
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
          props: {
            fieldName: 'subject',
            filterable: true,
            options: this.common().subjectCode,
          },
        },
        {
          type: 'dataPicker',
          label: '创建时间起',
          labelWidth: '90px',
          initValue: undefined,
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
          initValue: undefined,
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
      // 表单内容
      tableCols: [
        {
          label: '项目名称',
          prop: 'name',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          width: '200px',
          // ERP编号点击跳转 立项申请详情
          render: (h, scope) => (
            <div>
              <el-link
                type="primary"
                onClick={(val) => {
                  this.editdata = {
                    row: scope.row,
                    type: 'projectDetailShow',
                    configType: 'detail',
                  };
                  this.editshow = true;
                }}
              >
                {scope.row.erpNumber}
              </el-link>
            </div>
          ),
        },
        {
          label: '商机编号',
          prop: 'busiId',
        },
        {
          label: '框架编号',
          prop: 'contractId',
        },
        {
          label: '已关联的承揽合同数',
          prop: 'contractCount',
        },
        {
          label: '省份',
          prop: 'province',
        },
        {
          label: '地市',
          prop: 'city',
        },
        {
          label: '一级专业',
          prop: 'oneMajor',
        },
        {
          label: '二级专业',
          prop: 'twoMajor',
        },
        {
          label: '项目经理',
          prop: 'manager',
        },
        {
          label: '委托方',
          prop: 'consignor',
        },
        {
          label: '主体',
          prop: 'subject',
        },
        {
          label: '建设方式',
          prop: 'constructionMode',
        },
        {
          label: '预估收入',
          prop: 'estimatedRevenue',
        },
        {
          label: '预估成本',
          prop: 'estimatedCost',
        },
        {
          label: '计划开工',
          prop: 'startTime',
        },
        {
          label: '计划完工',
          prop: 'endTime',
        },
        {
          label: '部门',
          prop: 'deptId',
        },
        {
          label: '设计单位',
          prop: 'designUnit',
        },
        {
          label: '监理单位',
          prop: 'supervisionUnit',
        },
        {
          label: '创建时间',
          prop: 'createTime',
        },
        {
          label: '建设单位项目经理',
          prop: 'constructManager',
        },
        {
          label: '建设单位项目经理联系方式',
          prop: 'constructManagerContact',
        },
        {
          label: '监理联系人',
          prop: 'supervisionPeople',
        },
        {
          label: '监理联系方式',
          prop: 'supervisionContact',
        },
        {
          label: '审核状态',
          prop: 'statusName',
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
    // 页面首先运行搜索 获取合作信息
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

        // this.$set(this.searchItems[6], 'initValue', val.province);
        this.$set(this.searchItems[7], 'initValue', undefined);
        this.$set(this.searchItems[7].props, 'options', city);
      }
      if (val.oneMajor !== this.searchVal.oneMajor) {
        const twoMajor = await this.$getCode(val.oneMajor);

        // this.$set(this.searchItems[3], 'initValue', val.oneMajor);
        this.$set(this.searchItems[4], 'initValue', undefined);
        this.$set(this.searchItems[4].props, 'options', twoMajor);
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
    // 立项申请
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

      getListByCondition(parames).then((res) => {
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
          this.handleDelProjectApproval(info.row.id);
        });

        return;
      }
      const { row } = info;
      // contractCount -- 已关联的承揽合同数

      if (state === 'decompose' && Number(row.contractCount) === 0) {
        this.$notifyError('当前项目未关联承揽合同，请关联后再进行项目分解');

        return;
      }
      this.editshow = true;
      this.editdata = info;
    },
    // 删除
    handleDelProjectApproval(id) {
      delProjectApproval(id).then((res) => {
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
      this.$confirm('确定下载协作项目模板信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = excelDownload;

        api('projectApproval').then((res) => {
          const fileName = '协作项目模板信息.xlsx';
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
#cooperation {
}
</style>
