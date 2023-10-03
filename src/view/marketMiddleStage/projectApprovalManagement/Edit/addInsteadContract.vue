<template>
  <div id="addInsteadContract">
    <!-- 协作-生成合作合同 -->
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
    <wrapper title="分解列表">
      <otherBtnList>
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
        operator-width="90"
        :data="tableData"
        :cols="tableCols"
        :selection="true"
        :operator="true"
        :row-key="getRowKey"
        reserveSelection
        hideDefaultIndex
        :selectable="getSelectable"
        @selection-change="onSelectionChange"
        :treeProps="{ children: 'splitInfoSubDto', hasChildren: 'hasChildren' }"
      >
        <template slot-scope="scope" slot="operator">
          <flex>
            <!--操作-->
            <el-button
              type="text"
              size="small"
              title="编辑"
              icon="iconfont icon-bianji"
              v-if="!scope.row.editRow && !scope.row.cooContractId && scope.row.splitInfoSubDto"
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
              v-if="scope.row.editRow && !scope.row.cooContractId && scope.row.splitInfoSubDto"
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
              title="查看"
              v-if="!scope.row.splitInfoSubDto && scope.row.status === '1'"
              icon="iconfont icon-yulan"
              @click.prevent.stop="
                tableAction('detail', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
              查看
            </el-button>
            <el-button
              type="text"
              size="small"
              title="生成单个合作合同"
              v-if="!scope.row.splitInfoSubDto && scope.row.status === '0'"
              icon="iconfont icon-yewu"
              @click.prevent.stop="
                tableAction('yewu', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
              生成单个合作合同
            </el-button>
            <el-button
              type="text"
              size="small"
              title="删除"
              icon="iconfont icon-shanchu"
              v-if="!scope.row.cooContractId && scope.row.splitInfoSubDto"
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
    <showContract :show="contractShow" :data="contractData" @cancel="closeEdit" @success="successEdit" />
    <addCooperation
      :show="cooperationShow"
      :data="cooperationData"
      @cancel="closeCooperation"
      @success="successCooperation"
    />
    <cooperationUnits :show="unitShow" :data="unitData" @cancel="closeUnit" @success="successUnit" />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import otherBtnList from '@/components/headerTitle/otherBtnList';
import Flex from '@/components/flex';
import cooperationUnits from '@/view/common/cooperationUnits';
import showContract from './showContract';
import addCooperation from './addCooperation';
import {
  startProcess,
  getSplitList,
  getSplitDetail,
  updateSplit,
  addSplit,
  delSplit,
  splitSubHzms,
} from '@/api/marketMiddleStage/projectApprovalManagement';

export default {
  name: 'addInsteadContract',
  components: {
    FormItem,
    wrapper,
    PageTable,
    showContract,
    addCooperation,
    otherBtnList,
    cooperationUnits,
    Flex,
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
      inputDisabled: configType === 'decompose',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {
        auditOpinion: undefined,
        nextAuditPeopleName: undefined,
      },
      layout: [
        {
          title: '基础信息',
          formItems: [
            {
              label: 'ERP编号',
              prop: 'erpNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目名称',
              prop: 'projectName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '生产中心',
              prop: 'deptId',
              inputType: 'select',
              span: 12,
              options: this.common().productionCenterCode,
            },
            {
              label: '设计单位',
              prop: 'designUnit',
              inputType: 'select',
              span: 12,
              options: this.common().designUnitCode,
            },
            {
              label: '监理单位',
              prop: 'projectName',
              inputType: 'select',
              span: 12,
              options: this.common().supervisionUnitCode,
            },
            {
              label: '建设单位',
              prop: 'constructions',
              inputType: 'select',
              span: 12,
              options: this.common().constructionCode,
            },
            {
              label: '项目状态',
              prop: 'projectstatus',
              inputType: 'select',
              span: 12,
              options: this.common().constructionCode,
            },
            {
              label: '预估收入',
              prop: 'estimatedRevenue',
              inputType: 'input',
              span: 12,
            },
            {
              label: '预估成本',
              prop: 'estimatedCost',
              inputType: 'input',
              span: 12,
            },
            {
              label: '一级专业',
              prop: 'oneMajor',
              inputType: 'select',
              span: 12,
              options: this.common().majorCode,
              onChange: (val) => {
                this.setTwoMajor(val);
              },
            },
            {
              label: '二级专业',
              prop: 'twoMajor',
              inputType: 'select',
              span: 12,
              options: [],
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  twoMajor: val,
                };
              },
            },
            {
              label: '开工时间',
              prop: 'startTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '完工时间',
              prop: 'endTime',
              inputType: 'dataPicker',
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        auditOpinion: {
          required: true,
          message: '请输入申请说明',
          trigger: 'blur',
        },
        nextAuditPeopleName: {
          required: true,
          message: '请选择指定审核人',
          trigger: 'blur',
        },
      },
      otherBtnLists: [
        {
          label: '合作合同合并',
          click: () => this.synthesisAll(),
        },
        {
          label: '新增合作模式',
          click: () => this.addRow(),
        },
      ],
      // 是否全额分配选项
      isAllOpts: [
        {
          id: '1',
          name: '是',
        },
        {
          id: '0',
          name: '否',
        },
      ],
      tableData: [], // 表单数据
      tableCols: [
        {
          label: '合作单位',
          prop: 'unitName',
          render: (h, scope) => {
            const d = scope.row;

            let html = '';

            // console.log('d', scope.row.cooModeName, d, d.parentId, d.level);
            if (d.splitInfoSubDto && d.splitInfoSubDto.length) {
              html = scope.row.unitName;
            } else {
              const name = d.unitName || '';

              if (d.parentId) {
                html = name;
              }
              if (!d.parentId && d.level !== 2) {
                html = (
                  <el-input
                    class="editInput"
                    value={scope.row[scope.column.property] || ''}
                    onFocus={(val) => {
                      this.unitData = {
                        ...this.data,
                        ...this.form,
                      };
                      this.unitShow = true;
                    }}
                  ></el-input>
                );
              }
              if (d.level === 2) {
                html = name;
              }
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '合作模式',
          prop: 'cooModeName',
          render: (h, scope) => {
            const d = scope.row;

            const html = scope.row.cooModeName || scope.row.cooperationMode;

            if (
              (d.splitInfoSubDto && !d.splitInfoSubDto.length && d.level !== 2) ||
              (!d.id && d.level !== 2) ||
              (d.editRow && d.level !== 2 && d.status === '0')
            ) {
              const { cooperationMode } = this.common();

              return (
                <div>
                  {
                    <el-select
                      class="editInput"
                      value={scope.row[scope.column.property] || ''}
                      onChange={(val) => {
                        this.changeSelect(val, scope.$index, scope.column.property);
                      }}
                    >
                      {cooperationMode.map((data) => (
                        <el-option label={data.name} value={data.id}></el-option>
                      ))}
                    </el-select>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '分配金额',
          prop: 'splitAmount',
          // 表单内增加输入框
          render: (h, scope) => {
            const d = scope.row;

            const html = d.splitAmount;

            if (d.editRow) {
              return (
                <div class="el-input">
                  {
                    <div>
                      {
                        <el-input
                          class="editInput"
                          value={scope.row[scope.column.property] || ''}
                          onInput={(val) => {
                            this.changeInput(val, scope.$index, scope.column.property);
                          }}
                        ></el-input>
                      }
                    </div>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '是否全额分配',
          prop: 'isAll',
          // 表单内增加输入框
          render: (h, scope) => {
            const d = scope.row;

            const html = d.isAll === '1' ? '是' : '否';

            if (d.level === 2) {
              return '';
            }
            if (d.editRow) {
              return (
                <div>
                  {
                    <el-select
                      class="editInput"
                      value={scope.row[scope.column.property] || ''}
                      onChange={(val) => {
                        this.changeSelect(val, scope.$index, scope.column.property);
                      }}
                    >
                      {this.isAllOpts.map((data) => (
                        <el-option label={data.name} value={data.id}></el-option>
                      ))}
                    </el-select>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '合作比例',
          prop: 'ratio',
          // 表单内增加输入框
          render: (h, scope) => {
            const d = scope.row;

            let html = ''; //

            if (d.level !== 2) {
              html = d.ratio || '';
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '预估比例',
          prop: 'estimate',
          // 表单内增加输入框
          render: (h, scope) => {
            const d = scope.row;

            let html = ''; //

            if (d.level !== 2) {
              html = d.estimate || '';
            }

            return <div>{html}</div>;
          },
        },
      ],
      editRow: false,
      multipleSelection: [],
      contractShow: false,
      contractData: {},
      cooperationShow: false,
      cooperationData: {},
      selectTable: {},
      unitShow: false,
      unitData: {},
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
      this.inputDisabled = val.configType === 'decompose';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
  },
  methods: {
    // 请求数据
    reqDetail() {
      console.log('this', this.data);
      const { row } = this.data;

      if (row && row.id) {
        this.getSplitDetail(row.id);
        this.getDataAllList();
      }
    },
    // 获取二级专业
    async setTwoMajor(val) {
      const options = this.common().majorCode;
      const findItem = options.filter((option) => option.id === val);

      this.form = {
        ...this.form,
        oneMajor: findItem[0].id,
        twoMajor: undefined,
      };
      const twoMajor = await this.$getCode(findItem[0].id);

      this.$set(this.layout[0].formItems[10], 'options', twoMajor);
    },
    // 获取分解详情
    getSplitDetail(id) {
      getSplitDetail(id).then((res) => {
        if (res && res.code === '200') {
          if (res.data.InfoProjectBaseDtoModel.oneMajor) {
            this.setTwoMajor(res.data.InfoProjectBaseDtoModel.oneMajor);
          }
          this.form = {
            ...this.form,
            ...res.data.InfoProjectBaseDtoModel,
          };
        }
      });
    },

    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    // 提交数据
    submitForm(val) {
      console.log('this.data', this.data);
      const { row } = this.data;
      const param = {
        ...val,
        businessId: row.id,
        currStatus: row.status,
        businessCode: row.businessCode,
        nextAuditPeople: this.selectTable.username,
      };
      const message = '更新成功';

      // 提交审核
      startProcess(param).then((res) => {
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
    // 取消提交
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      const { row } = this.data;
      const parames = {
        data: {
          erpId: row.erpNumber,
        },
        pageNo: 1,
        pageSize: 10,
        sorting: 'id desc',
      };

      // 获取分解列表
      getSplitList(parames).then((res) => {
        if (res.code === '200') {
          const { data } = res.data;

          this.tableData = data.map((dataItem) => ({
            ...dataItem,
            splitInfoSubDto: dataItem.splitInfoSubDto.map((splitInfoSubDtoItem) => ({
              ...splitInfoSubDtoItem,
              level: 2,
              parentId: dataItem.id, // 父级id
              sonId: `${splitInfoSubDtoItem.cooContractTypeCode}_${dataItem.id}`, // 每条子级唯一id
              parentUnitDetailId: dataItem.unitDetailId, // 父级合作单位id
              id: splitInfoSubDtoItem.cooContractId,
            })),
          }));
          this.tableData.splice(1, 0);
        }
      });
    },
    // 保存选中表格数据
    onSelectionChange(args) {
      console.log(args, '选中');
      this.multipleSelection = args;
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    // 获取选择表单
    getSelectable(row, index) {
      return !row.splitInfoSubDto && row.status === '0';
    },
    // 合作合同合并
    synthesisAll() {
      console.log('synthesisAll');
      if (this.multipleSelection.length === 0) {
        this.$notifyError('请先勾选合作合同');
      } else {
        const infoCheck = this.checkMultipleSelection();

        if (infoCheck.codeFlag) {
          this.$notifyError('合作模式必须一致');

          return;
        }

        if (infoCheck.idFlag) {
          this.$notifyError('合作单位必须一致');

          return;
        }
        this.cooperationShow = true;
        this.cooperationData = {
          multipleSelection: this.multipleSelection,
        };
      }
    },
    // 检查多种选择
    checkMultipleSelection() {
      return new Promise((resolve, reject) => {
        const info = {
          code: null, // 合作模式
          id: null, // 合作单位
          codeFlag: false, // 合作模式是否不一致
          idFlag: false, // 合作单位是否不一致
        };

        this.multipleSelection.forEach((item) => {
          info.code = info.code ? info.code : item.cooContractTypeCode;
          info.id = info.id ? info.id : item.parentUnitDetailId;

          if (info.code !== item.cooContractTypeCode) {
            info.codeFlag = true;

            return;
          }
          if (info.id !== item.parentUnitDetailId) {
            info.idFlag = true;
          }
        });
        resolve(info);
      });
    },
    // 关闭预览合同
    closeCooperation() {
      this.cooperationShow = false;
      this.cooperationData = {};
    },
    // 成功预览合同
    successCooperation() {
      this.getDataAllList();
      this.closeCooperation();
    },
    // 添加行
    addRow() {
      console.log('addRow');
      if (this.editRow) {
        this.$notifyError('请先保存当前新增行数据再进行添加操作');

        return;
      }

      if (this.tableData.length && this.tableData[0].isAll === '1') {
        this.$notifyError('当前只能存在一条全额分配');

        return;
      }

      this.editRow = true;
      const list = {
        cooModeName: '',
        cooperationMode: '',
        createPeople: '',
        createTime: '',
        erpId: '',
        id: '',
        isAll: '1',
        splitAmount: this.form.estimatedRevenue,
        splitInfoSubDto: [],
        unitDetailId: '',
        unitName: '',
        defCheckTr: '',
        status: '0',
        editRow: this.editRow,
      };

      this.tableData.unshift(list);
      this.tableData.splice(1, 0);
    },
    // 表单操作
    tableAction(type, row) {
      console.log('row', row);
      if (type === 'edit') {
        this.tableData[row.index] = {
          ...this.tableData[row.index],
          editRow: true,
        };
        this.editRow = true;
        this.tableData.splice(1, 0);
      }
      if (type === 'save') {
        this.handleUpdateSplit(row.index);
      }
      if (type === 'del') {
        if (!row.data.id) {
          this.tableData.splice(row.index, 1);
          this.editRow = false;

          return;
        }
        // 删除
        delSplit(row.data.id).then((res) => {
          if (res && res.code === '200') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              position: 'bottom-right',
            });
            this.getDataAllList();
          }
        });
      }
      if (type === 'detail') {
        this.contractShow = true;
        this.contractData = {
          configType: type,
          row: row.data,
        };
      }
      if (type === 'yewu') {
        this.cooperationShow = true;
        this.cooperationData = {
          multipleSelection: [
            {
              ...row.data,
            },
          ],
        };
        console.log('this.cooperationData', this.cooperationData);
      }
    },
    // 更新分解
    handleUpdateSplit(index) {
      const { cooperationMode, erpId, id, isAll, splitAmount, unitDetailId } = this.tableData[index];

      let parames = {
        cooperationMode,
        erpId: this.form.erpNumber,
        isAll,
        splitAmount,
        unitDetailId: `${unitDetailId}`,
      };

      let flag = true, // 判断当前数据是否完整
        fullLen = 0; // 全额分配的模式
      const estimatedRevenue = parseFloat(this.form.estimatedRevenue); // 预估收入

      let tableSplitAmount = 0; // 总分配金额

      console.log('this.tableData', this.tableData);
      this.tableData.forEach((item) => {
        if (!item.hasOwnProperty('level')) {
          const am = item.splitAmount ? parseFloat(item.splitAmount) : 0;

          tableSplitAmount += am;

          fullLen += 1;
        }
        if (!item.cooperationMode || !item.unitDetailId) {
          flag = false;
        }
      });
      if (fullLen > 1 && isAll === '1') {
        // 当前其他条数是非全额当前为全额
        this.$notifyError('请统一全额分配的模式');

        return;
      }

      if (tableSplitAmount > estimatedRevenue) {
        this.$notifyError('当前分配总金额不能大于预估收入');

        return;
      }

      if (isAll === '1') {
        if (parseFloat(splitAmount) !== estimatedRevenue) {
          this.$notifyError('全额分配必须等于预估收入');

          return;
        }
      }

      if (!flag) {
        this.$notifyError('请填写完整信息');

        return;
      }
      let api = addSplit;

      let message = '新增成功';

      if (id) {
        api = updateSplit;
        message = '更新成功';
        parames = {
          ...parames,
          id,
        };
      }
      api(parames).then((res) => {
        if (res && res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right',
          });
          this.getDataAllList();
        }
      });
    },
    // 输入框改变
    changeInput(val, index, name) {
      this.tableData[index] = {
        ...this.tableData[index],
        [name]: val,
      };
      this.tableData.splice(1, 0);
    },
    // 下拉框改变
    changeSelect(val, index, name, idName) {
      console.log('val', val, index, name);
      const item = this.tableData.map((data, i) => {
        if (i === index) {
          let addObj = {};

          if (idName && val instanceof Object) {
            addObj = {
              [idName]: val.id,
            };
          }
          // 合作模式更改
          if (name === 'cooModeName') {
            this.getSplitSubHzms(val, index);
          }

          return {
            ...data,
            [name]: val instanceof Object ? val.name : val,
            ...addObj,
          };
        }

        return data;
      });

      this.tableData = item;
    },
    // 获取分解子项信息
    getSplitSubHzms(mode, index) {
      splitSubHzms(mode).then((res) => {
        if (res && res.code === '200') {
          const splitInfoSubDto = [];

          res.data.forEach((dataItem) => {
            splitInfoSubDto.push({
              level: 2,
              parentId: this.tableData[index].id,
              id: dataItem.cooperationMode + this.tableData[index].id,
              sonId: dataItem.cooperationMode + this.tableData[index].id,
              parentUnitDetailId: this.tableData[index].unitDetailId,
              ...dataItem,
            });
          });
          this.tableData[index] = {
            ...this.tableData[index],
            cooperationMode: mode,
            splitInfoSubDto,
          };
          this.tableData.splice(1, 0);
          console.log('this.tableData', splitInfoSubDto, this.tableData);
          this.$refs.pageTable.doLayout();
        }
      });
    },
    // 关闭预览
    closeEdit() {
      this.contractShow = false;
      this.contractData = {};
    },
    // 成功预览
    successEdit(selectTable) {
      console.log('selectTable', selectTable);
      this.closeEdit();
    },
    // 关闭预览
    closeUnit() {
      this.unitShow = false;
      this.unitData = {};
    },
    // 成功合作
    successUnit(selectTable) {
      console.log('selectTable', selectTable);
      this.selectTable = selectTable;
      this.tableData[0] = {
        ...this.tableData[0],
        unitDetailId: selectTable.id,
        unitName: selectTable.unitName,
        ratio: selectTable.ratio,
        estimate: selectTable.estimate,
        defCheckTr: selectTable.id,
      };
      this.tableData.splice(1, 0);
      console.log('tableData', this.tableData);
      this.closeUnit();
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
#addInsteadContract {
  #PageTable {
    min-height: auto;
  }
  .comp-wrapper {
    #otherBtnList {
      margin-bottom: 10px;
    }
  }
}
</style>
