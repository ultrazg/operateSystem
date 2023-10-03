<template>
  <div class="detail-table">
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
          :hideDefaultIndex="true"
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

    <edit :show="editshow" :data="editdata" :title="'合作单位评估编辑'" @cancel="closeEdit" @success="successEdit" />
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import {
  getListCooperationAssessmentByCondition,
  deleteCooperationAssessmentById,
} from '@/api/cooperationUnitManagement/index';
export default {
  name: 'cooperationAssessmentManagement',
  inject: ['common'],
  props: {
    data: {},
  },
  data() {
    return {
      loading: false,
      searchVal: {
        unitName: '',
        year: '',
      },
      searchItems: [
        {
          type: 'input',
          label: '合作单位',
          initValue: '',
          props: {
            fieldName: 'unitName',
          },
        },
        {
          type: 'dataPicker',
          label: '年份',
          initValue: '',
          labelWidth: '100px',
          props: {
            type: 'year',
            format: 'yyyy',
            fieldName: 'year',
            placeholder: '请选择年份',
          },
        },
        {
          type: 'dataPicker',
          label: '月份',
          initValue: '',
          labelWidth: '100px',
          props: {
            type: 'month',
            format: 'MM',
            fieldName: 'month',
            placeholder: '请选择月份',
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
          label: '合作单位名称',
          prop: 'unitName',
          align: 'center',
          width: 150,
        },
        {
          label: '合作区域',
          prop: 'area',
          align: 'center',
          width: 150,
        },
        {
          label: '合作专业',
          prop: 'major',
          align: 'center',
          width: 160,
        },
        {
          label: '年份',
          prop: 'year',
          align: 'center',
          width: 100,
        },
        {
          label: '月份',
          prop: 'month',
          align: 'center',
          width: 100,
        },
        {
          label: '摘要',
          prop: 'remark',
          align: 'center',
          width: 100,
        },
        {
          label: '区办考核',
          prop: 'office',
          align: 'center',
          width: 100,
        },
        {
          label: '项目管理部考核',
          prop: 'project',
          align: 'center',
          width: 160,
        },
        {
          label: '质监部考核',
          prop: 'quality',
          align: 'center',
          width: 160,
        },
        {
          label: '月度考核',
          prop: 'average',
          align: 'center',
          width: 160,
        },
        {
          label: '整改通知',
          prop: 'assessment',
          align: 'center',
          width: 100,
        },
        {
          label: '黄牌',
          prop: 'yellowAssessment',
          align: 'center',
          width: 100,
        },
        {
          label: '红牌',
          prop: 'redAssessment',
          align: 'center',
          width: 100,
        },
        {
          label: '黑牌',
          prop: 'blackAssessment',
          align: 'center',
          width: 100,
        },
        {
          label: '罚款情况',
          prop: 'rewards',
          align: 'center',
          width: 100,
        },
        {
          label: '备注',
          prop: 'remark',
          align: 'center',
          width: 100,
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
    console.log(this.data);
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
          // ...this.searchVal,
          cooperationUnitName: this.searchVal.unitName,
          year: this.searchVal.year,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getListCooperationAssessmentByCondition(parames).then((res) => {
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
      this.editshow = true;
      this.editdata = info;
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },
    successEdit() {
      this.editshow = false;
      this.getDataAllList();
    },
    // 删除月度信息
    handleDelete(row) {
      this.$confirm('确定删除当前评估信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deleteCooperationAssessmentById(row.id).then((res) => {
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

<style scoped lang="less"></style>
