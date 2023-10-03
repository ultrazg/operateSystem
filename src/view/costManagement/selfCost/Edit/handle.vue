<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
    <div class="Modeltable">
      <page-table
        ref="pageTable"
        col-align="left"
        :showPage="false"
        :data="costEntryInfoData"
        :cols="costEntryInfoCols"
        :hideDefaultIndex="true"
        :expand="true"
        :row-key="getRowKey"
      >
        <template slot-scope="scope" slot="expand">
          <div class="expandInfo">
            <page-table
              class="childPageTable"
              ref="childPageTable"
              col-align="left"
              :showPage="false"
              :selection="false"
              :operator="true"
              :data="costInfoList[scope.index].costInfoList"
              :cols="expandTableCols"
              :row-key="getRowKey"
            >
              <!-- :row-key="getRowKey" -->
              <template slot-scope="sonScope" slot="operator">
                <flex>
                  <el-button
                    type="text"
                    size="small"
                    title="编辑"
                    icon="iconfont icon-bianji"
                    v-if="!sonScope.row.editRow && !sonScope.row.expensesUser"
                    @click.prevent.stop="
                      expendAction('edit', {
                        index: scope.index,
                        sonIndex: sonScope.index,
                        data: sonScope.row,
                      })
                    "
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    title="保存"
                    v-if="sonScope.row.editRow"
                    icon="iconfont icon-baocun1"
                    @click.prevent.stop="
                      expendAction('save', {
                        index: scope.index,
                        sonIndex: sonScope.index,
                        data: sonScope.row,
                      })
                    "
                  >
                    保存
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    title="删除"
                    icon="iconfont icon-shanchu"
                    v-if="!sonScope.row.expensesUser"
                    @click.prevent.stop="
                      expendAction('del', {
                        index: scope.index,
                        sonIndex: sonScope.index,
                        data: sonScope.row,
                      })
                    "
                  >
                    删除
                  </el-button>
                </flex>
              </template>
            </page-table>
            <div
              class="flexRow flexCenter addRow"
              @click="
                () =>
                  expendAction('addRow', {
                    index: scope.index,
                    data: scope.row,
                  })
              "
            >
              <span class="iconfont icon-jiahao" />
              <span class="text">添加数据</span>
            </div>
          </div>
        </template>
      </page-table>
    </div>
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import PageTable from '@/components/page-table';
import upload from '@/components/upload/upload';
import Flex from '@/components/flex';
import { uploadFile } from '@/api/user';
import { costEntrySelfCost, addExpenses } from '@/api/costManagement/selfCost';

export default {
  name: 'handleInfo',
  components: {
    FormItem,
    PageTable,
    Flex,
    // eslint-disable-next-line vue/no-unused-components
    upload,
  },
  props: {
    show: Boolean,
    data: {},
  },
  inject: ['common'],
  data() {
    const { configType } = this.data;

    return {
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {
        cost: 0,
        alreadyExpenses: 0,
        residueExpenses: 0,
        totalPaid: 0,
        totalWaitPaid: 0,
      },
      layout: [
        {
          title: '成本信息',
          formItems: [
            {
              label: '项目成本预算',
              prop: 'cost',
              inputType: 'inputNumber',
              disabled: true,
              span: 12,
            },
            {
              label: '已报销总金额',
              prop: 'alreadyExpenses',
              inputType: 'inputNumber',
              disabled: true,
              span: 12,
            },
            {
              label: '剩余报销金额',
              prop: 'residueExpenses',
              inputType: 'inputNumber',
              disabled: true,
              span: 12,
            },
            {
              label: '已付款金额',
              prop: 'totalPaid',
              inputType: 'inputNumber',
              disabled: true,
              span: 12,
            },
            {
              label: '待付款金额',
              prop: 'totalWaitPaid',
              inputType: 'inputNumber',
              disabled: true,
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        // no: { required: true, message: "请输入公告名称", trigger: "blur" },
        // address: { required: true, message: "请输入公告号", trigger: "blur" },
        // buildArea: {
        //   required: true,
        //   message: "请选择公告类型",
        //   trigger: "blur",
        // },
      },
      costEntryInfoCols: [
        {
          label: '成本类型',
          prop: 'costType',
        },
        {
          label: '成本金额',
          prop: 'cost',
        },
        {
          label: '已报销金额',
          prop: 'amountExpenses',
        },
        {
          label: '剩余报销金额',
          prop: 'waitExpenses',
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
      costEntryInfoData: [],
      expandTableCols: [
        {
          label: '报销金额',
          prop: 'amountExpenses',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.amountExpenses;

            if (d.editRow) {
              html = (
                <div>
                  {
                    <el-input-number
                      class="editInput"
                      precision={2}
                      controls={false}
                      value={scope.row[scope.column.property] || ''}
                      onInput={(val) => {
                        this.changeExpandInput(val, scope.$index, scope);
                      }}
                    ></el-input-number>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '报销人',
          prop: 'expensesUser',
        },
        {
          label: '报销时间',
          prop: 'expensesTime',
        },
        {
          label: '附件',
          prop: 'fileCode',
          width: '150px',
          render: (h, scope) => {
            const d = scope.row;

            let html = (
              <upload
                ref="upload"
                postUrl="#"
                tableShow={false}
                multiple={false}
                fileLists={this.uploadFileList}
                onChange={(val) => this.uploadChange(val, scope.$index, scope)}
              >
                <template slot="center">
                  <el-button size="small" type="primary">
                    选取文件
                  </el-button>
                </template>
              </upload>
            );

            if (d.fileCode) {
              // 获取网络协议
              const { protocol } = window.location;
              // 获取主机名+端口号
              const domainPort = window.location.host;
              const fileHref = `${`${protocol}//${domainPort}`}/api/fileupload/download?fileCode=${d.fileCode}`;

              html = (
                <div class="flexRow uploadText">
                  <el-link class="attachment" href={fileHref} target="_blank">
                    {d.fileName || d.fileCode}
                  </el-link>
                  <el-button
                    type="text"
                    size="small"
                    title="删除"
                    disabled={!d.editRow}
                    icon="iconfont icon-shanchu"
                    onClick={() => {
                      this.expendAction('del', {
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
        {
          label: '已付款金额',
          prop: 'amountPaid',
        },
        {
          label: '待付款金额',
          prop: 'amountWaitPaid',
        },
      ],
      costInfoList: [],
      uploadFileList: [],
      expendEditRow: false,
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  watch: {
    data(val) {
      console.log('val', val);
      // this.data = val;
      this.inputDisabled = val.configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
    costInfoList: {
      deep: true,
      handler(val) {
        if (val.length === 0) {
          return;
        }

        let alreadyExpenses = 0;

        let residueExpenses = 0;

        let totalPaid = 0;

        let totalWaitPaid = 0;

        this.costInfoList.forEach((data) => {
          alreadyExpenses += parseFloat(data.amountExpenses || 0);
          residueExpenses += parseFloat(data.waitExpenses || 0);
          totalPaid += parseFloat(data.amountPaid || 0);
          totalWaitPaid += parseFloat(data.amountWaitPaid || 0);
        });
        this.form = {
          ...this.form,
          alreadyExpenses,
          residueExpenses,
          totalPaid,
          totalWaitPaid,
        };
      },
    },
  },
  methods: {
    getRowKey(row) {
      return row.id;
    },
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        // /api/selfCost/costEntry/{id}
        costEntrySelfCost(row.id).then((res) => {
          if (res && res.code === '200' && res.data) {
            this.form = {
              ...this.form,
              ...res.data,
            };
            this.costEntryInfoData = res.data.costList.concat(this.costInfoList).map((listItem) => {
              let costInfoList = [];

              if (listItem.costInfoList && listItem.costInfoList.length > 0) {
                costInfoList = listItem.costInfoList.map((dtoItem, dtoIndex) => ({
                  ...dtoItem,
                  index: dtoIndex,
                }));
              }

              return {
                ...listItem,
                costInfoList,
              };
            });
            this.costInfoList = JSON.parse(JSON.stringify(this.costEntryInfoData));
          }
        });
      }
    },
    expendAction(type, row) {
      const { sonIndex, index, data } = row;
      const { projectId } = data;

      // console.log('row', row);
      if (type === 'del') {
        if (projectId) {
          this.$notifyError('该数据不可删除');

          return;
        }
        this.costInfoList[index].costInfoList.splice(sonIndex, 1);
        this.costInfoList.splice(1, 0);
        this.expendEditRow = false;
      }
      if (type === 'edit') {
        this.costInfoList[index].costInfoList[sonIndex] = {
          ...this.costInfoList[index].costInfoList[sonIndex],
          editRow: true,
        };
        this.expendEditRow = true;
        this.costInfoList[index].costInfoList.splice(1, 0);
      }
      if (type === 'save') {
        // const { costType } = this.costInfoList[index];
        const { amountExpenses, fileCode } = this.costInfoList[index].costInfoList[sonIndex];

        if (!amountExpenses || !fileCode) {
          this.$notifyError('请先完整输入信息:报销金额、附件');

          return;
        }
        this.costInfoList[index].costInfoList[sonIndex] = {
          ...this.costInfoList[index].costInfoList[sonIndex],
          editRow: false,
        };
        // 自动计算父级金额数目
        // let amountExpensesVal = 0;

        // let amountPaid = 0;

        // let amountWaitPaid = 0;

        // this.costInfoList[index].costInfoList.forEach((item) => {
        //   amountExpensesVal += parseFloat(dataItem.amountExpenses);
        //   amountPaid += parseFloat(dataItem.amountPaid);
        //   amountWaitPaid += parseFloat(dataItem.amountWaitPaid);
        // });
        // const { cost } = this.costInfoList[index];

        // this.costInfoList[index] = {
        //   ...this.costInfoList[index],
        //   amountExpenses: amountExpensesVal,
        //   amountPaid,
        //   amountWaitPaid,
        //   waitExpenses: parseFloat(cost || 0) - parseFloat(amountExpenses || 0),
        // };
        this.expendEditRow = false;
        this.costInfoList[index].costInfoList.splice(1, 0);
      }
      if (type === 'addRow') {
        if (this.expendEditRow) {
          this.$notifyError('请先保存当前新增行数据再进行添加操作');

          return;
        }
        console.log('this.costInfoList[index]', this.costInfoList[index]);
        this.costInfoList[index].costInfoList.push({
          index,
          editRow: true,
        });
        console.log('costInfoList', this.costInfoList[index]);
        this.costInfoList[index].costInfoList.splice(1, 0);
        // this.costInfoList.splice(1, 0);
        this.expendEditRow = true;
      }
    },
    // 子项输入框改变
    changeExpandInput(val, index, scope) {
      // console.log('scope', scope);
      const name = scope.column.property;
      const parentIndex = scope.row.index;

      this.costInfoList[parentIndex].costInfoList[index] = {
        ...this.costInfoList[parentIndex].costInfoList[index],
        [name]: val,
      };
      this.costInfoList.splice(1, 0);
      this.costEntryInfoData = JSON.parse(JSON.stringify(this.costInfoList));
      this.costEntryInfoData.splice(1, 0);
    },
    uploadChange(file, sonIndex, scope) {
      const { index } = scope.row;

      this.uploadFileList = file.fileList;
      this.uploadSubmit(index, sonIndex);
    },
    uploadSubmit(index, sonIndex) {
      if (this.uploadFileList.length === 0) {
        this.$notifyError('请先选择上传文件!!!');

        return;
      }

      const wfForm = new FormData();

      this.uploadFileList.forEach((file) => {
        wfForm.append('file', file.raw);
        wfForm.append('filePath', 'uploadFile//qlication');
        wfForm.append('serviceCode', this.routerCode);
      });
      uploadFile(wfForm).then((res) => {
        if (res.code === '200') {
          this.uploadFileList = [];
          const list = res.data.split(':');

          this.costInfoList[index].costInfoList[sonIndex] = {
            ...this.costInfoList[index].costInfoList[sonIndex],
            fileCode: list[1],
            fileName: list[0],
          };
          this.costInfoList[index].costInfoList.splice(1, 0);
          this.costInfoList.splice(1, 0);
        } else {
          this.$notifyError(res.message);

          return false;
        }
      });
    },
    clickUpload(d) {
      window.location.href = `/api/fileupload/download?fileCode=${d.fileCode}`;
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { row } = this.data;

      if (this.expendEditRow) {
        this.$notifyError('请先保存当前新增行数据再进行添加操作');

        return;
      }
      const param = [];

      this.costInfoList.forEach((listItem) => {
        listItem.costInfoList.forEach((listSonItem) => {
          if (!listSonItem.expensesUser) {
            param.push({
              amountExpenses: listSonItem.amountExpenses,
              costType: listItem.costType,
              fileCode: listSonItem.fileCode,
              fileName: listSonItem.fileName,
              projectId: row.id,
            });
          }
        });
      });
      const message = '录入成功';

      addExpenses(param).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right',
          });
          this.$emit('success');
        }
      });
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
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
  .comp-page-table.childPageTable {
    padding: 0;
    border: 1px solid #fce8e0;
    border-top: none;
    border-right: none;
    border-bottom: none;
    margin-bottom: 0;
  }
  /deep/.comp-page-table {
    min-height: auto;
    td {
      &.el-table__expanded-cell {
        padding-left: 48px;
        padding-top: 0;
        padding-bottom: 0;
        border-right: none;
      }
    }
    &.childPageTable {
      padding: 0;
      border: 1px solid #fce8e0;
      border-top: none;
      border-right: none;
      border-bottom: none;
      margin-bottom: 0;
      th {
        background: #fff2ed !important;
        border-color: #fce8e0;
      }
      tbody {
        tr {
          td {
            border-color: #fce8e0;
            .uploadText {
              .el-button {
                padding-bottom: 0;
              }
            }
          }
          &:nth-of-type(2n) {
            background: #fffbfa;
          }
        }
      }
    }
  }
  .expandInfo {
    .addRow {
      height: 36px;
      background: #ffffff;
      border: 1px solid #fce8e0;
      cursor: pointer;
      .iconfont {
        font-size: 10px;
        color: #f14d51;
        margin-right: 10px;
      }
      .text {
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #ef2d32;
      }
    }
  }
}
</style>
