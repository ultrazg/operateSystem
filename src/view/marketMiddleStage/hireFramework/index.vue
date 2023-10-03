/* eslint-disable camelcase */
<template>
  <div id="hireFramework">
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
              <!--操作  -->
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
                icon="iconfont icon-shanchu"
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'delete')"
                @click.prevent.stop="
                  openDialog('del', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'del',
                  })
                "
              >
                删除
              </el-button>
              <el-button
                type="text"
                size="small"
                title="提交审核"
                icon="iconfont icon-fabu"
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'submitAudit')"
                @click.prevent.stop="
                  openDialog('fabu', {
                    row: { ...scope.row, businessCode: 't_hire_framework' },
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
                title="申请作废"
                icon="iconfont icon-iconclose"
                v-if="scope.row.status === 'verify_pass' && $_hasOperation(routerCode, 'applicationCancle')"
                @click.prevent.stop="
                  openDialog('close', {
                    row: { ...scope.row, businessCode: 't_hire_framework' },
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
import moment from 'moment';
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import { getHireFrameworkList, hireFrameworkDel } from '@/api/marketMiddleStage/hireFramework';
import { excelDownload } from '@/api/basicInformationManagement/templetDownloadIndex';

export default {
  name: 'hireFramework',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        province: undefined,
        city: undefined,
      },
      // 搜索条件
      searchItems: [
        {
          type: 'input',
          label: '框架名称',
          initValue: '',
          props: {
            fieldName: 'contractName',
          },
        },
        {
          type: 'input',
          label: '框架编号',
          initValue: '',
          props: {
            fieldName: 'contractNo',
          },
        },
        {
          type: 'select',
          label: '审核状态',
          initValue: '',
          props: {
            fieldName: 'status',
            filterable: true,
            options: this.common().verifyStatusCode,
          },
        },
        {
          type: 'select',
          label: '委托方',
          initValue: '',
          props: {
            fieldName: 'consignor',
            filterable: true,
            options: this.common().constructionCode,
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
          initValue: '',
          props: {
            fieldName: 'subject',
            filterable: true,
            options: this.common().subjectCode,
          },
        },
        {
          type: 'dataPicker',
          label: '签订时间',
          initValue: null,
          props: {
            fieldName: 'signDate',
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
            pickerOptions: {},
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
          label: '框架名称',
          prop: 'contractName',
        },
        {
          label: '框架编号',
          prop: 'contractId',
        },
        {
          label: '商机编号',
          prop: 'busiId',
        },
        {
          label: '省份',
          prop: 'province',
        },
        {
          label: '城市',
          prop: 'city',
        },
        {
          label: '框架来源',
          prop: 'from',
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
          label: '专业',
          prop: 'major',
        },
        {
          label: '签订日期',
          prop: 'signDate',
        },
        {
          label: '档案份数',
          prop: 'documents',
        },
        {
          label: '保证金',
          prop: 'bond',
        },
        {
          label: '安全生产费',
          prop: 'security',
        },
        {
          label: '创建时间',
          prop: 'createDate',
        },
        {
          label: '创建人',
          prop: 'createPeople',
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
    // 页面首先运行搜索 获取承揽框架信息
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
      const { pickerOptions } = this.searchItems[9].props;

      if (val.beginDate && Object.keys(pickerOptions).length === 0) {
        this.searchItems[9].props.pickerOptions = {
          disabledDate(time) {
            return time.getTime() < moment(val.beginDate).valueOf() + 8.64e7; // 后面
          },
        };
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

      getHireFrameworkList(parames).then((res) => {
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
          this.handleHireFrameworkDel(info.row.id);
        });

        return;
      }
      this.editshow = true;
      this.editdata = info;
    },
    // 删除
    handleHireFrameworkDel(id) {
      hireFrameworkDel(id).then((res) => {
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
      this.$confirm('确定下载承揽框架模板信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = excelDownload;

        api('hireFramework').then((res) => {
          const fileName = '承揽框架模板信息.xlsx';
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
#hireFramework {
}
</style>
