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
import { getListCooperationQlicationByCondition } from '@/api/cooperationUnitManagement/index';
export default {
  name: 'cooperationQlicationManagement',
  inject: ['common'],
  // props: {
  //   data: {},
  // },
  data() {
    return {
      loading: false,
      searchVal: {
        // unitName: '',
        // year: '',
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
          type: 'select',
          label: '人员省份',
          initValue: undefined,
          props: {
            fieldName: 'userProvince',
            options: this.common().provincialCode,
          },
        },
        {
          type: 'select',
          label: '人员地市',
          initValue: undefined,
          props: {
            fieldName: 'userCity',
            options: [],
          },
        },
        {
          type: 'select',
          label: '报备省份',
          initValue: undefined,
          props: {
            fieldName: 'quotedProvince',
            options: this.common().provincialCode,
          },
        },
        {
          type: 'select',
          label: '报备地市',
          initValue: undefined,
          props: {
            fieldName: 'quotedCity',
            options: [],
          },
        },
        {
          type: 'input',
          label: '资质名称',
          initValue: '',
          props: {
            fieldName: 'qualificationsName',
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
          align: 'center',
          width: 150,
        },
        {
          label: '资质名称',
          prop: 'qualificationsName',
          align: 'center',
          width: 150,
        },
        {
          label: '资质类型',
          prop: 'type',
          align: 'center',
          width: 100,
        },
        {
          label: '发证机构',
          prop: 'qualificationsMechanism',
          align: 'center',
          width: 150,
        },
        {
          label: '证件编码',
          prop: 'qualificationsCode',
          align: 'center',
          width: 160,
        },
        {
          label: '人员',
          prop: 'people',
          align: 'center',
          width: 100,
        },
        {
          label: '身份证号码',
          prop: 'code',
          align: 'center',
          width: 160,
        },
        {
          label: '开始时间',
          prop: 'sDate',
          align: 'center',
          width: 160,
        },
        {
          label: '结束时间',
          prop: 'eDate',
          align: 'center',
          width: 160,
        },
        {
          label: '报备省份',
          prop: 'quotedProvince',
          align: 'center',
          width: 100,
        },
        {
          label: '报备地市',
          prop: 'quotedCity',
          align: 'center',
          width: 100,
        },
        {
          label: '人员省份',
          prop: 'userProvince',
          align: 'center',
          width: 100,
        },
        {
          label: '人员地市',
          prop: 'userCity',
          align: 'center',
          width: 100,
        },
        {
          label: '文件名称',
          prop: 'fileName',
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
      if (val.userProvince !== this.searchVal.userProvince) {
        const city = await this.$getCode(val.userProvince);

        // this.$set(this.searchItems[1], 'initValue', val.userProvince);
        this.$set(this.searchItems[2], 'initValue', undefined);
        this.$set(this.searchItems[2].props, 'options', city);
      }
      if (val.quotedProvince !== this.searchVal.quotedProvince) {
        const city = await this.$getCode(val.quotedProvince);

        // this.$set(this.searchItems[3], 'initValue', val.quotedProvince);
        this.$set(this.searchItems[4], 'initValue', undefined);
        this.$set(this.searchItems[4].props, 'options', city);
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
          // cooperationUnitName: this.searchVal.unitName,
          // year: this.searchVal.year,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getListCooperationQlicationByCondition(parames).then((res) => {
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
  },
};
</script>

<style scoped lang="less"></style>
