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
    <wrapper title="资质信息">
      <otherBtnList v-show="data.configType !== 'detail'">
        <ul class="flexRow">
          <li
            v-for="(item, index) in otherBtnLists"
            :key="index"
            class="flexCenter"
            @click="
              () => {
                item.click();
              }
            "
          >
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </otherBtnList>
      <page-table
        ref="pageTable"
        col-align="left"
        :data="tableData"
        :cols="tableCols"
        :selection="false"
        :operator="data.configType !== 'detail'"
        :row-key="getRowKey"
        reserveSelection
        hideDefaultIndex
        :showPage="false"
      >
        <template slot-scope="scope" slot="files">
          <upload
            ref="upload"
            postUrl="#"
            :fileLists="scope.row.files"
            :tableShow="false"
            :multiple="true"
            :textShow="false"
            :showRowFileLists="true"
            :disabled="!scope.row.editRow"
            accept=".jpg, .png, .pdf, .jpeg"
            @change="(val) => uploadChange(val, scope.index, 'files')"
            @remove="(valIndex) => removeUpload(scope.index, valIndex)"
          >
          </upload>
        </template>
        <template slot-scope="scope" slot="operator">
          <flex>
            <el-button
              type="text"
              size="small"
              title="编辑"
              icon="iconfont icon-bianji"
              v-if="!scope.row.editRow"
              @click.prevent.stop="
                tableAction('edit', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              title="保存"
              v-if="scope.row.editRow"
              icon="iconfont icon-baocun1"
              @click.prevent.stop="
                tableAction('save', {
                  index: scope.index,
                  data: scope.row,
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
              @click.prevent.stop="
                tableAction('del', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
              删除
            </el-button>
          </flex>
        </template>
      </page-table>
    </wrapper>
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import FormatValidate from '@/components/formItem/format';
import wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import otherBtnList from '@/components/headerTitle/otherBtnList';
import Flex from '@/components/flex';
import upload from '@/components/upload/upload';
import { uploadFile } from '@/api/user';
import { addperson, updateperson, detailperson } from '@/api/qualificationManagement/qualificationPersonel';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
    wrapper,
    PageTable,
    otherBtnList,
    Flex,
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
      form: {},
      layout: [
        {
          title: '资质信息',
          formItems: [
            {
              label: '姓名',
              prop: 'personName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '部门',
              prop: 'department',
              inputType: 'select',
              span: 12,
              options: this.common().deptIdCode,
            },
            {
              label: '合作性质',
              prop: 'cooperationNature',
              inputType: 'select',
              span: 12,
              options: this.common().cooperationNature,
            },
            {
              label: '身份证',
              prop: 'idCard',
              inputType: 'input',
              span: 12,
            },
            {
              label: '学历',
              prop: 'education',
              inputType: 'select',
              span: 12,
              options: this.common().education,
            },
            {
              label: '专业',
              prop: 'major',
              inputType: 'input',
              span: 12,
            },
            {
              label: '岗位状态',
              prop: 'postStatus',
              inputType: 'select',
              span: 12,
              options: this.common().postStatus,
            },
          ],
        },
      ],
      formRules: {
        personName: {
          required: true,
          message: '请输入姓名',
          trigger: 'blur',
        },
        department: {
          required: true,
          message: '请输入部门',
          trigger: 'blur',
        },
        cooperationNature: {
          required: true,
          message: '请选择合作性质',
          trigger: 'blur',
        },
        idCard: [
          {
            required: true,
            message: '请输入身份证',
            trigger: 'blur',
          },
          {
            validator: FormatValidate.form().checkIdNum,
            trigger: 'blur',
          },
        ],
        education: {
          required: true,
          message: '请选择学历',
          trigger: 'blur',
        },
        major: {
          required: true,
          message: '请输入专业',
          trigger: 'blur',
        },
        postStatus: {
          required: true,
          message: '请选择岗位状态',
          trigger: 'blur',
        },
      },
      tableData: [],
      tableCols: [
        {
          label: '资质名称',
          prop: 'name',
          width: 150,
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.name;

            if (d.editRow) {
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
          label: '资质等级',
          prop: 'level',
          width: 150,
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.level;

            if (d.editRow) {
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
          label: '有效期',
          prop: 'validityDate',
          width: 200,
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.validityDate;

            if (d.editRow) {
              html = (
                <el-date-picker
                  class="editInput"
                  type="datetime"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changeInput(val, scope.$index, scope.column.property);
                  }}
                ></el-date-picker>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '颁发机构',
          prop: 'issuingAuthority',
          width: 150,
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.issuingAuthority;

            if (d.editRow) {
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
          label: '预警提醒日期',
          prop: 'warningDate',
          width: 200,
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.warningDate;

            if (d.editRow) {
              html = (
                <el-date-picker
                  class="editInput"
                  type="datetime"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changeInput(val, scope.$index, scope.column.property);
                  }}
                ></el-date-picker>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '上传附件',
          prop: 'files',
          width: 200,
          render: () => '',
        },
      ],
      otherBtnLists: [
        {
          label: '新增',
          click: () => this.addRow(),
        },
      ],
      editRow: false,
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  watch: {
    data(val) {
      // this.data = val;
      this.inputDisabled = val.configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
  },
  methods: {
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        detailperson(row.id).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              ...res.data,
            };
            this.tableData = [
              {
                name: res.data.name,
                level: res.data.level,
                validityDate: res.data.validityDate,
                issuingAuthority: res.data.issuingAuthority,
                warningDate: res.data.warningDate,
                files: res.data.files,
              },
            ];
          }
        });
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;

      const personQualificationList = [];

      if (this.editRow) {
        this.$notifyError('请先保存当前新增行数据再进行添加操作');

        return;
      }
      if (this.tableData.length === 0) {
        this.$notifyError('请先输入资质信息');

        return;
      }
      let checkFile = false;

      this.tableData.forEach((tableItem) => {
        if (tableItem.files.length === 0) {
          checkFile = true;
        }
        personQualificationList.push({
          ...val,
          id: this.form.id,
          name: tableItem.name,
          level: tableItem.level,
          validityDate: tableItem.validityDate,
          issuingAuthority: tableItem.issuingAuthority,
          warningDate: tableItem.warningDate,
          files: tableItem.files.map((file) => ({
            ...file,
            qualificationId: file.qualificationId,
            qualificationType: 1,
          })),
        });
      });
      if (checkFile) {
        this.$notifyError('请先输入上传必要的附件信息');

        return;
      }
      let param = personQualificationList;

      console.log('personQualificationList', personQualificationList);
      let message = '新增成功';

      let api = addperson;

      if (configType === 'edit') {
        param = personQualificationList[0];
        message = '修改成功';
        api = updateperson;
      }

      api(param).then((res) => {
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
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    addRow() {
      console.log('addRow');
      if (this.editRow) {
        this.$notifyError('请先保存当前新增行数据再进行添加操作');

        return;
      }

      this.editRow = true;
      const list = {
        editRow: this.editRow,
      };

      this.tableData.unshift(list);
      this.tableData.splice(1, 0);
    },
    // 输入框改变
    changeInput(val, index, name) {
      console.log('changeInput', val, index, name);
      this.tableData[index] = {
        ...this.tableData[index],
        [name]: val,
      };
      console.log('this.tableData[index]', this.tableData[index]);
      this.tableData.splice(1, 0);
    },
    uploadChange(val, index, name) {
      const wfForm = new FormData();
      const { file } = val;
      const params = {
        filePath: 'fileUpload',
        serviceCode: 'qualification',
      };

      wfForm.append('file', file.raw);
      Object.keys(params).forEach((param) => {
        wfForm.append(param, params[param]);
      });
      uploadFile(wfForm).then((res) => {
        if (res.code === '200') {
          const fileCode = res.data;

          const list = fileCode.split(':');
          const fileObj = {
            fileCode: list[1],
            fileName: list[0],
          };

          this.tableData[index] = {
            ...this.tableData[index],
            [name]: (this.tableData[index][name] || []).concat([fileObj]),
          };
          this.tableData.splice(1, 0);
          console.log('this.tableData', this.tableData);
        }
      });
    },
    removeUpload(index, fileIndex) {
      this.tableData[index].files.splice(fileIndex, 1);
    },
    tableAction(type, row) {
      if (type === 'edit') {
        this.tableData[row.index] = {
          ...this.tableData[row.index],
          editRow: true,
        };
        this.editRow = true;
        this.tableData.splice(1, 0);
        console.log('this.tableData', this.tableData);
      }
      if (type === 'save') {
        this.handleUpdateSplit(row.index);
      }
      if (type === 'del') {
        this.tableData.splice(row.index, 1);
        this.editRow = false;
      }
    },
    handleUpdateSplit(index) {
      const { name, level, validityDate, issuingAuthority, warningDate, files } = this.tableData[index];

      if (!name || !level || !validityDate || !issuingAuthority || !warningDate || !files) {
        this.$notifyError('请先完整输入信息:资质名称、资质等级、有效期、颁发机构、预警提醒日期、上传附件');

        return;
      }
      this.tableData[index] = {
        ...this.tableData[index],
        editRow: false,
      };
      this.tableData.splice(1, 0);
      this.editRow = false;
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
    min-height: auto;
  }
  .comp-wrapper {
    #otherBtnList {
      margin-bottom: 10px;
    }
  }
  /deep/.uploadText {
    flex-direction: column;
    .fileLists {
      flex-direction: column;
    }
  }
}
</style>
