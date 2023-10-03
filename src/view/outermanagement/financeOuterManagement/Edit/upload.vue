<template>
  <div id="base">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onReset="onReset"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '提交回执',
            click: () => submit(),
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
          operator-width="80"
          :data="tableData"
          :cols="tableCols"
          :selection="true"
          :operator="false"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @selection-change="onSelectionChange"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
        </page-table>
        <div v-show="false" class="nonedata">
          <div>
            <img src="~common/images/emptyData.png" alt="" />
            <p>暂无数据，晚点再来吧</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import upload from '@/components/upload/upload';
import { getListByCommand, fileupload, receiptInfoBatchUpdate } from '@/api/outermanagement/financeOuterManagement';

export default {
  name: 'uploadInfo',
  components: {
    headerTitle,
    searchForm,
    PageTable,
    // eslint-disable-next-line vue/no-unused-components
    upload,
  },
  props: {
    show: Boolean,
    data: {},
  },
  inject: ['common'],
  data() {
    return {
      searchVal: {},
      searchItems: [
        {
          type: 'input',
          label: 'ERP编号',
          initValue: '',
          props: {
            fieldName: 'erp',
          },
        },
        {
          type: 'select',
          label: '计税方式',
          initValue: '',
          props: {
            fieldName: 'taxType',
            filterable: true,
            options: this.common().taxTypeCode,
          },
        },
        {
          type: 'dataPicker',
          label: '有效期起',
          labelWidth: '90px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'startTime',
          },
        },
        {
          type: 'dataPicker',
          label: '有效期止',
          labelWidth: '90px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'endTime',
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
          label: 'ERP编码',
          prop: 'erp',
        },
        {
          label: '承揽合同',
          prop: 'hireName',
        },
        {
          label: '承揽订单',
          prop: 'hireOrderId',
        },
        {
          label: '涉税编号',
          prop: 'taxNumber',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.taxNumber;

            if (d.id) {
              html = (
                <el-input
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changeInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '回执文件',
          prop: 'fileUpload',
          render: (h, scope) => {
            const d = scope.row;

            let html = (
              <upload
                ref="upload"
                postUrl="#"
                tableShow={false}
                multiple={false}
                fileLists={this.uploadFileList}
                onChange={(val) => this.uploadChange(val, scope.$index)}
              >
                <template slot="center">
                  <el-button size="small" type="primary">
                    选取文件
                  </el-button>
                </template>
              </upload>
            );

            if (d.fileCode) {
              html = (
                <div>
                  上传成功
                  <el-button
                    type="text"
                    size="small"
                    title="删除"
                    icon="iconfont icon-shanchu"
                    onClick={() => {
                      this.tableAction('del', {
                        index: scope.$index,
                        data: scope.row,
                      });
                    }}
                  ></el-button>
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
      ],
      uploadFileList: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.onSearch();
    });
  },
  watch: {
    data(val) {
      this.onSearch();
    },
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
    submitFormItem() {
      this.$emit('success');
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      const parames = {
        data: {
          ...this.searchVal,
          status: 'status_1',
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'create_time desc',
      };

      getListByCommand(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    cancelForm() {
      this.tableData = [];
    },
    // 输入框改变
    changeInput(val, index, name) {
      this.tableData[index] = {
        ...this.tableData[index],
        [name]: val,
      };
      if (this.multipleSelection.length > 0) {
        const selectIndex = this.multipleSelection.findIndex(
          (selectItem) => selectItem.id === this.tableData[index].id,
        );

        if (selectIndex > -1) {
          this.multipleSelection[index] = {
            ...this.multipleSelection[index],
            [name]: val,
          };
          this.multipleSelection.splice(1, 0);
        }
      }
      this.tableData.splice(1, 0);
    },
    uploadChange(file, index) {
      this.uploadFileList = file.fileList;
      this.uploadSubmit(index);
    },
    uploadSubmit(index) {
      const table = this.tableData[index];

      if (this.uploadFileList.length === 0) {
        this.$notifyError('请先选择上传文件!!!');

        return;
      }

      const wfForm = new FormData();

      this.uploadFileList.forEach((file) => {
        wfForm.append('file', file.raw);
        wfForm.append('filePath', table.fileUrl);
        wfForm.append('serviceCode', 'finance_outerManagement');
      });
      fileupload(wfForm).then((res) => {
        if (res.code === '200') {
          this.uploadFileList = [];
          this.tableData[index] = {
            ...this.tableData[index],
            fileCode: res.data.split(':')[1],
          };
          this.tableData.splice(1, 0);
        } else {
          this.$notifyError(res.message);

          return false;
        }
      });
    },
    tableAction(type, row) {
      if (type === 'del') {
        this.tableData[row.index] = {
          ...this.tableData[row.index],
          fileCode: '',
        };
        this.tableData.splice(1, 0);
      }
    },
    // 保存选中表格数据
    onSelectionChange(args) {
      // console.log(args, "选中");
      this.multipleSelection = args;
    },
    submit() {
      if (this.multipleSelection.length === 0) {
        this.$notifyError('请勾选需上传回执信息的外经证');

        return;
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (!this.multipleSelection[i].taxNumber) {
          this.$notifyError('涉税编号不得为空!!!');

          return;
        }
        // if (!this.multipleSelection[i].fileCode) {
        //   this.$notifyError('请上传附件');

        //   return;
        // }
      }
      receiptInfoBatchUpdate(this.multipleSelection).then((res) => {
        if (res && res.code === '200') {
          this.$notify({
            title: '成功',
            message: '上传成功',
            type: 'success',
            position: 'bottom-right',
          });
          this.getDataAllList();
        }
      });
    },
  },
  created() {
    if (this.isAdd === false) {
      this.reqDetail();
    }
  },
};
</script>

<style lang="less" scoped>
#base {
  #PageTable {
    td > div {
      align-items: center;
    }
  }
}
</style>
