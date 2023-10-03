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
    >
      <template slot="orderId">
        <otherBtnList style="margin-bottom: 12px" v-show="isEdit">
          <ul class="flexRow">
            <li
              v-for="(item, index) in orderIdOtherBtnLists"
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
          ref="orderPageTable"
          col-align="left"
          operator-width="90"
          :data="orderTableData"
          :cols="orderTableCols"
          :operator="isEdit"
          :showPage="false"
        >
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="编辑"
                icon="iconfont icon-bianji"
                v-if="!scope.row.editRow"
                @click.prevent.stop="
                  tableHireNameAction('edit', {
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
                  tableHireNameAction('save', {
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
                  tableHireNameAction('del', {
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
      </template>
      <template slot="delayRecode">
        <page-table
          ref="pageTable"
          col-align="left"
          operator-width="90"
          :data="delayRecodeData"
          :cols="delayRecodeCols"
          :operator="false"
          :showPage="false"
        >
        </page-table>
      </template>
    </FormItem>
    <wrapper title="回执信息" v-if="data.configType === 'infoEdit' || data.configType === 'entryEdit'">
      <el-form class="receiptFrom" :label-position="'right'" :label-width="'100px'" :model="form" ref="formRef">
        <el-row class="receiptItem">
          <el-col :span="12">
            <el-form-item label="涉税编号：" prop="name">
              <el-input
                v-model="form.taxNumber"
                placeholder="请输入涉税编号"
                :disabled="uploadInputDisabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回执文件：" prop="name">
              <el-link class="attachment" :href="form.fileName" target="_blank">
                {{ form.fileName }}
              </el-link>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件：" prop="name">
              <upload
                ref="upload"
                postUrl="#"
                :fileLists="uploadFileList"
                :disabled="uploadDisabled"
                @change="uploadChange"
                @remove="uploadRemove"
                @submit="uploadChange"
                @beforeUpload="beforeUpload"
              >
                <template slot="center">
                  <el-button size="small" type="primary" :disabled="uploadDisabled">选取文件</el-button>
                </template>
              </upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </wrapper>
    <wrapper title="预缴税信息" v-if="data.configType === 'entryEdit'">
      <otherBtnList v-show="data.type !== 'detail'">
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
        :selection="false"
        :operator="data.type !== 'detail'"
        :row-key="getRowKey"
        reserveSelection
        hideDefaultIndex
      >
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
    <projectSelect :show="projectShow" :data="projectData" @cancel="closeProject" @success="successProject" />
    <nextAuditPeople :show="peopleShow" :data="peopleData" @cancel="closeEdit" @success="successEdit" />
    <subpackageInvoice :show="subShow" :data="subData" @cancel="closeSub" @success="successSub" />
    <!-- 承揽框架 -->
    <hireFrameWorkSelect
      :show="hireFrameWorkShow"
      :data="hireFrameWorkData"
      @cancel="closehireFrameWork"
      @success="successhireFrameWork"
    />
    <!-- 承揽合同 -->
    <hireNameWorkSelect
      ref="hireNameWorkSelect"
      title="选择承揽订单"
      :highlightCurrentRow="false"
      :show="hireNameShow"
      :data="hireNameData"
      @cancel="closeHireName"
      @success="successHireName"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import Wrapper from '@/components/wrapper';
import Flex from '@/components/flex';
import otherBtnList from '@/components/headerTitle/otherBtnList';
import projectSelect from '@/view/common/projectSelect';
import PageTable from '@/components/page-table';
import upload from '@/components/upload/upload';
import nextAuditPeople from '@/view/common/nextAuditPeople';
import subpackageInvoice from '@/view/common/subpackageInvoice';
import hireFrameWorkSelect from '@/view/common/hireFrameWorkSelect';
import hireNameWorkSelect from '@/view/common/hireNameWorkSelect';
import {
  detailOutermanag,
  saveOutermanag,
  updateOutermanag,
  fileupload,
} from '@/api/outermanagement/financeOuterManagement';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
    Wrapper,
    PageTable,
    Flex,
    otherBtnList,
    upload,
    projectSelect,
    nextAuditPeople,
    subpackageInvoice,
    hireFrameWorkSelect,
    hireNameWorkSelect,
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
        hireContractId: undefined,
        hireName: undefined,
        pmName: undefined,
        pm: undefined,
        operatorP: undefined,
        operatorPName: undefined,
        contactP: undefined,
        contactPName: undefined,
        taxNumber: undefined,
        fileName: undefined,
        fileCode: undefined,
        filePath: undefined,
      },
      layout: [
        {
          title: '外经证申请信息',
          formItems: [
            {
              label: '外经证编码',
              prop: 'outerCode',
              inputType: 'input',
              disabled: true,
              hide: true,
              span: 12,
            },
            {
              label: '外经证名称',
              prop: 'outerName',
              hide: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目经理',
              prop: 'pm',
              inputType: 'select',
              span: 12,
              onFocus: (val) => {
                this.peopleId = 'pm';
                this.peopleData = {
                  ...this.data,
                  ...this.form,
                };
                this.peopleShow = true;
                console.log('onFocus', val);
              },
            },
            {
              label: '委托方',
              prop: 'taxPayer',
              inputType: 'select',
              span: 12,
              options: this.common().constructionCode,
              onChange: async (val) => {
                this.form = {
                  ...this.form,
                  taxPayer: val,
                };
                if (!val) {
                  return;
                }
                const detailData = await this.$getDictionaryData(val);

                const taxNo = detailData.description;

                if (taxNo) {
                  this.form = {
                    ...this.form,
                    taxNumber: taxNo,
                  };
                } else {
                  this.form = {
                    ...this.form,
                    taxNumber: undefined,
                  };
                }
              },
            },
            {
              label: '纳税识别号',
              prop: 'taxNumber',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '详细地址',
              prop: 'address',
              inputType: 'input',
              placeholder: '请输入施工地所属行政区街道',
              span: 12,
            },
            {
              label: '经办人',
              prop: 'operatorP',
              inputType: 'select',
              span: 12,
              onFocus: (val) => {
                this.peopleId = 'operatorP';
                this.peopleData = {
                  ...this.data,
                  ...this.form,
                };
                this.peopleShow = true;
                console.log('onFocus', val);
              },
            },
            {
              label: '经办人电话',
              prop: 'operatorTel',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '经营方式',
              prop: 'modeType',
              inputType: 'select',
              span: 12,
              options: this.common().modeType,
            },
            {
              label: '联系人',
              prop: 'contactP',
              inputType: 'select',
              span: 12,
              onFocus: (val) => {
                this.peopleId = 'contactP';
                this.peopleData = {
                  ...this.data,
                  ...this.form,
                };
                this.peopleShow = true;
                console.log('onFocus', val);
              },
            },
            {
              label: '联系人电话',
              prop: 'contactTel',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '涉税金额',
              prop: 'taxAmount',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '有效期起',
              prop: 'startTime',
              hide: true,
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '有效期止',
              prop: 'endTime',
              hide: true,
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '承揽框架名称',
              prop: 'frameworkName',
              inputType: 'select',
              span: 12,
              onChange: (val) => {
                if (!val) {
                  this.hireFrameWorkTable.id = null;
                }
              },
              onFocus: (val) => {
                this.hireFrameWorkData = {
                  ...this.data,
                  ...this.form,
                };
                this.hireFrameWorkShow = true;
              },
            },
          ],
        },
        {
          title: '绑定承揽订单',
          render: 'orderId',
        },
        {
          title: '回填信息记录',
          hide: true,
          formItems: [
            {
              label: '外经证编码',
              prop: 'outerCode',
              inputType: 'input',
              hide: false,
              span: 12,
            },
            {
              label: '外经证附件',
              prop: 'backFillFileList',
              disabled: false,
              placeholder: '支持pdf/.jpg/.png格式文件',
              limit: 5,
              accept: '.jpg, .png, .pdf, .jpeg',
              inputType: 'upload',
              span: 12,
              actionHide: true,
              download: true,
              params: {
                filePath: 'fileUpload',
                serviceCode: 'back_fill',
              },
            },
            {
              label: '有效期起',
              prop: 'startTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '有效期止',
              prop: 'endTime',
              inputType: 'dataPicker',
              span: 12,
            },
          ],
        },
        {
          title: '延期信息记录',
          hide: true,
          render: 'delayRecode',
        },
        {
          title: '核销信息记录',
          hide: true,
          formItems: [
            {
              label: '上传附件',
              prop: 'file',
              disabled: false,
              placeholder: '支持pdf/.jpg/.png格式文件',
              limit: 5,
              accept: '.jpg, .png, .pdf, .jpeg',
              inputType: 'upload',
              params: {
                filePath: 'fileUpload',
                serviceCode: 'financeCancel',
              },
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        outerName: {
          required: true,
          message: '请选择外经证名称',
          trigger: 'blur',
        },
        pm: {
          required: true,
          message: '请选择项目经理',
          trigger: 'blur',
        },
        taxPayer: {
          required: true,
          message: '请选择纳税人',
          trigger: 'blur',
        },
        address: {
          required: true,
          message: '请输入施工地所属行政区街道',
          trigger: 'blur',
        },
        operatorP: {
          required: true,
          message: '请选择经办人',
          trigger: 'blur',
        },
        modeType: {
          required: true,
          message: '请选择经营方式',
          trigger: 'blur',
        },
        contactP: {
          required: true,
          message: '请选择联系人',
          trigger: 'blur',
        },
        taxAmount: {
          required: true,
          message: '请选择涉税金额',
          trigger: 'blur',
        },
        startTime: {
          required: false,
          message: '请选择有效期起',
          trigger: 'blur',
        },
        endTime: {
          required: false,
          message: '请选择有效期止',
          trigger: 'blur',
        },
        // frameworkName: {
        //   required: true,
        //   message: '请选择承揽框架',
        //   trigger: 'blur',
        // },
      },
      projectShow: false,
      projectData: {},
      projectTable: {},
      peopleId: '',
      peopleShow: false,
      peopleData: {},
      peopleTable: {},
      uploadFileList: [],
      uploadDisabled: false,
      uploadInputDisabled: false,
      tableData: [],
      tableCols: [
        {
          label: '预缴税编号',
          prop: 'billId',
        },
        {
          label: '所属时间起',
          prop: 'ascriptionSTime',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.ascriptionSTime;

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
          label: '所属时间止',
          prop: 'ascriptionETime',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.ascriptionETime;

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
          label: '销售额',
          prop: 'salesVolume',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.salesVolume;

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
          label: '扣除金额',
          prop: 'deduction',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.deduction;

            if (d.editRow) {
              html = (
                <el-input
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onFocus={(val) => {
                    this.subShow = true;
                    this.subIndex = scope.$index;
                    this.subData = {
                      erpNumber: this.form.erp,
                      selectSource: 'prePaymentAdd',
                    };
                  }}
                ></el-input>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '预缴税额',
          prop: 'taxAmount',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.taxAmount;

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
          label: '预缴税率',
          prop: 'taxRate',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.taxRate;

            if (d.editRow) {
              html = (
                <el-input
                  class="editInput"
                  disabled
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
      ],
      otherBtnLists: [
        {
          label: '新增',
          click: () => this.addRow(),
        },
      ],
      editRow: false,
      subShow: false,
      subIndex: 0,
      subData: {},
      subTable: {},
      hireFrameWorkShow: false,
      hireFrameWorkData: false,
      hireFrameWorkTable: false,
      orderIdOtherBtnLists: [
        {
          label: '新增',
          click: () => this.addOrderRow(),
        },
      ],
      orderTableData: [],
      orderTableCols: [
        {
          label: '承揽订单',
          prop: 'contractName',
        },
        {
          label: '承揽编码订单',
          prop: 'orderId',
        },
        {
          label: '合同金额',
          prop: 'contractAmount',
        },
        {
          label: '项目名称',
          prop: 'projectName',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
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
          label: '区/县',
          prop: 'area',
          render: (h, scope) => {
            const { editRow, cityCode, areaItems, areaItem, id } = scope.row;
            const select = [];

            // console.log('scope.row', scope.row);
            this.orderTableData.forEach((orderItem) => {
              if (orderItem.id === id) {
                select.push(orderItem.areaItem);
              }
            });
            if (!areaItems && !this.requestDom.some((item) => item === scope.$index)) {
              this.requestDom.push(scope.$index);
              this.getCodeData(cityCode, scope.$index, select);
            }

            if (editRow) {
              if (areaItems) {
                return (
                  <div>
                    {
                      <el-select
                        class="editInput"
                        value={scope.row.areaItem || ''}
                        onChange={(val) => {
                          this.changeSelect(val, scope, 'areaItem');
                        }}
                      >
                        {(areaItems || []).map((data) => (
                          <el-option
                            label={data.name}
                            value={data.id}
                            disabled={select.join(',').indexOf(data.id) > -1}
                          ></el-option>
                        ))}
                      </el-select>
                    }
                  </div>
                );
              }
            }
            // console.log('areaItem', areaItems, areaItem);
            const findItem = (areaItems || []).filter((data) => data.id === areaItem);

            return <div>{findItem && findItem[0] && findItem[0].name}</div>;
          },
        },
      ],
      requestDom: [],
      delayRecodeData: [],
      delayRecodeCols: [
        {
          label: '延期申请单号',
          prop: 'applyDelayId',
        },
        {
          label: '延长期起',
          prop: 'startTime',
        },
        {
          label: '延长期止',
          prop: 'endTime',
        },
        {
          label: '申请人',
          prop: 'applyUser',
        },
        {
          label: '申请时间',
          prop: 'applyTime',
        },
      ],
      hireNameShow: false,
      hireNameData: {},
      hireNameTable: {},
      hireNameIndex: -1,
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  watch: {
    data(val) {
      console.log('val', val, val.row.id !== this.data.row.id);

      if (val.row.id !== this.data.row.id) {
        this.initStatus(val);
      }
    },
  },
  methods: {
    initStatus(val) {
      this.inputDisabled =
        val.configType === 'infoEdit' || val.configType === 'entryEdit' || val.configType === 'detail';
      this.uploadDisabled = val.configType === 'entryEdit' && val.type !== 'detail';
      this.uploadInputDisabled = val.configType === 'entryEdit';
      // if (val.type === 'detail') {
      //   this.uploadInputDisabled = true;
      // }
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        detailOutermanag(row.id).then((res) => {
          if (res && res.code === '200') {
            this.layout[0].formItems[0].hide = false;
            if (res.data.backFillStatus === '1') {
              this.layout[0].formItems[12].hide = false;
              this.layout[0].formItems[13].hide = false;
              this.formRules.startTime.required = true;
              this.formRules.endTime.required = true;
              // 回填信息
              this.layout[2].hide = false;
              this.layout[2].formItems[1].disabled = true;
              if (res.data.backFillFileList && res.data.backFillFileList.length > 0) {
                this.form.backFillFileList = res.data.backFillFileList.map((canceItem) => ({
                  fileCode: canceItem.fileCode,
                  fileName: canceItem.fileName,
                }));
              }
            }
            if (!this.isEdit && res.data.financeDelayList && res.data.financeDelayList.length > 0) {
              this.layout[3].hide = false;
              // 延期记录
              this.delayRecodeData = res.data.financeDelayList;
            }

            // 核销记录附件
            if (res.data.fileList && res.data.fileList.length > 0) {
              this.layout[4].hide = false;
              this.layout[4].formItems[0].disabled = true;
              this.form.file = res.data.fileList.map((canceItem) => ({
                fileCode: canceItem.fileCode,
                fileName: canceItem.fileName,
              }));
            }

            this.form = {
              ...this.form,
              ...res.data,
            };
            // 承揽订单
            this.orderTableData = res.data.hireOrderList;
            this.tableData = res.data.prePaymentDtos;
          }
        });
      }
    },
    async setCity(province) {
      this.form = {
        ...this.form,
        manageLocalPro: province,
        manageLocalCity: undefined,
      };
      const options = this.common().provincialCode;
      const findItem = options.filter((option) => option.id === province);

      if (findItem.length === 0) {
        return;
      }
      const city = await this.$getCode(findItem[0].id);

      console.log('city', city);
      this.$set(this.layout[1].formItems[7], 'options', city);
    },
    submitFormItem() {
      if (
        this.data.configType === 'infoEdit' ||
        (this.data.configType === 'entryEdit' && this.data.type === 'detail')
      ) {
        this.uploadSubmit();

        return;
      }
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;

      if (this.editRow) {
        this.$notifyError('请先保存当前新增行数据再进行添加操作');

        return;
      }
      if (this.orderTableData.length === 0) {
        this.$notifyError('请先选择对应的承揽订单');

        return;
      }
      let orderAmount = 0;

      this.orderTableData.forEach((orderItem) => {
        orderAmount += parseFloat(orderItem.contractAmount);
      });
      if (this.form.taxAmount > orderAmount) {
        this.$notifyError('涉税金额请小于等于所选择承揽订单金额的累加');

        return;
      }
      const param = {
        ...val,
        fileName: this.form.fileName,
        fileCode: this.form.fileCode,
        contractIds: this.orderTableData.map((orderItem) => ({
          id: orderItem.id,
          area: orderItem.areaItem,
        })),
        prePaymentCommands: this.tableData,
      };

      let message = '';

      let api = saveOutermanag;

      if (id) {
        param.id = this.form.id;
        message = '修改成功';
        api = updateOutermanag;
      }
      delete param.prePaymentDtos;
      console.log('param', param);

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
    closeProject() {
      this.projectShow = false;
      this.projectData = {};
    },
    successProject(projectTable) {
      this.projectTable = projectTable;
      this.form = {
        ...this.form,
        erp: projectTable.erpId,
        projectName: projectTable.projectName,
        hireOwnerName: projectTable.consignorName,
        hireContractId: projectTable.id,
        hireName: projectTable.orderName,
        hireOrderId: projectTable.orderId,
        hireOwnerTaxNo: projectTable.taxNo,
        taxAmount: projectTable.contractAmount,
      };
      this.closeProject();
    },
    closeEdit() {
      this.peopleShow = false;
      this.peopleData = {};
    },
    successEdit(peopleTable) {
      this.peopleTable = peopleTable;
      if (this.peopleId === 'pm') {
        this.form = {
          ...this.form,
          pm: peopleTable.realName,
        };
      }
      if (this.peopleId === 'operatorP') {
        this.form = {
          ...this.form,
          // operatorPName: peopleTable.realName,
          operatorP: peopleTable.realName,
          operatorTel: peopleTable.mobile,
        };
      }
      if (this.peopleId === 'contactP') {
        this.form = {
          ...this.form,
          // contactPName: peopleTable.realName,
          contactP: peopleTable.realName,
          contactTel: peopleTable.mobile,
        };
      }

      this.closeEdit();
    },
    closeSub() {
      this.subShow = false;
      this.subData = {};
    },
    successSub(subTable) {
      this.subTable = subTable;
      const { salesVolume, taxRate } = this.tableData[this.subIndex];

      this.tableData[this.subIndex] = {
        ...this.tableData[this.subIndex],
        deductionId: subTable.subBathId,
        deduction: subTable.totalTaxPriceAmount,
      };
      const taxRateList = taxRate.split('%');

      if (taxRate === '3') {
        this.tableData[this.subIndex].taxAmount = (
          (((Number(salesVolume || 0) * 1000 - Number(subTable.totalTaxPriceAmount || 0) * 1000) / (1 + 0.03)) *
            (Number(taxRateList[0]) / 100)) /
          1000
        ).toFixed(2);
      } else if (taxRate === '2') {
        // 一般计税
        this.tableData[this.subIndex].taxAmount = (
          (((Number(salesVolume || 0) * 1000 - Number(subTable.totalTaxPriceAmount || 0) * 1000) / (1 + 0.09)) *
            (Number(taxRateList[0]) / 100)) /
          1000
        ).toFixed(2);
      }
      this.tableData.splice(1, 0);
      this.closeSub();
    },
    uploadChange(file) {
      this.uploadFileList = file.fileList;
    },
    uploadRemove(file) {
      this.uploadFileList = file.fileList;
    },
    beforeUpload(file) {
      console.log('file', file);

      return this;
    },
    uploadSubmit() {
      if (this.uploadFileList.length === 0) {
        this.$notifyError('请先选择上传文件!!!');

        return;
      }
      if (!this.form.taxNumber) {
        this.$notifyError('涉税编号不得为空!!!');

        return;
      }
      const wfForm = new FormData();

      this.uploadFileList.forEach((file) => {
        wfForm.append('file', file.raw);
        wfForm.append('filePath', this.form.fileUrl);
        wfForm.append('serviceCode', 'finance_outerManagement');
      });
      fileupload(wfForm).then((res) => {
        if (res.code === '200') {
          this.uploadFileList = [];
          this.form = {
            ...this.form,
            fileName: res.data.split(':')[0],
            fileCode: res.data.split(':')[1],
          };
          console.log('this.form', this.form);
          this.$refs.supplyFormItem.submitForm();
        } else {
          this.$notifyError(res.message);

          return false;
        }
      });
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
        deduction: undefined,
        taxAmount: undefined,
        taxRate: `${this.form.taxRate}`,
        editRow: this.editRow,
      };

      this.tableData.unshift(list);
      this.tableData.splice(1, 0);
    },
    closehireFrameWork() {
      this.hireFrameWorkShow = false;
      this.hireFrameWorkData = {};
    },
    successhireFrameWork(selectTable) {
      this.hireFrameWorkTable = selectTable;
      this.form = {
        ...this.form,
        frameworkName: selectTable.contractName,
        frameworkId: selectTable.id,
      };
      this.orderTableData = [];
      this.requestDom = [];
      this.closehireFrameWork();
    },
    addOrderRow() {
      if (this.editRow) {
        this.$notifyError('请先保存当前新增行数据再进行添加操作');

        return;
      }
      this.$refs.hireNameWorkSelect.onSelectionChange(this.orderTableData);
      this.hireNameShow = true;
      this.hireNameData = {
        id: this.hireFrameWorkTable.id,
      };
      this.hireNameIndex = -1;
      // if (this.$refs.hireNameWorkSelect) {
      //   this.$refs.hireNameWorkSelect.onRowChange(this.orderTableData);
      // }
    },
    tableHireNameAction(type, row) {
      console.log('row', row);
      if (type === 'edit') {
        // this.hireNameIndex = row.index;
        // this.hireNameShow = true;
        // if (this.$refs.hireNameWorkSelect) {
        //   this.$refs.hireNameWorkSelect.onRowChange([this.orderTableData[row.index]]);
        // }
        if (this.editRow) {
          this.$notifyError('请先保存当前新增行数据再进行添加操作');

          return;
        }
        this.orderTableData[row.index] = {
          ...this.orderTableData[row.index],
          editRow: true,
        };
        this.editRow = true;
        this.orderTableData.splice(1, 0);
      }
      if (type === 'save') {
        const { areaItem } = this.orderTableData[row.index];

        const check = this.orderTableData.some((tableItem) => tableItem.areaItem !== areaItem);

        if (check) {
          this.$notifyError('请先检查各承揽订单所选区/县是否一致');

          return;
        }
        this.orderTableData[row.index] = {
          ...this.orderTableData[row.index],
          editRow: false,
        };
        this.editRow = false;
        this.orderTableData.splice(1, 0);
      }
      if (type === 'del') {
        this.editRow = false;
        this.requestDom.splice(row.index, 1);
        this.orderTableData.splice(row.index, 1);
      }
    },
    closeHireName() {
      this.hireNameShow = false;
      // this.hireNameIndex = -1;
      this.hireNameData = [];
    },
    async successHireName(selectTable) {
      this.hireNameTable = selectTable;
      if (this.hireNameIndex === -1) {
        const { orderTableData } = this;

        await selectTable.forEach((selectTableItem) => {
          const findeItem = this.orderTableData.filter((data) => data.id === selectTableItem.id);
          // 判断数量

          if (findeItem.length < selectTableItem.areaList.length) {
            orderTableData.push({
              ...selectTableItem,
              editRow: true,
            });
            this.editRow = true;
          }
        });
        this.orderTableData.splice(1, 0);
      } else {
        this.orderTableData.splice(this.hireNameIndex, 1, ...selectTable);
      }

      this.$nextTick(() => {
        this.closeHireName();
      });
    },
    getCodeData(cityCode, index, select) {
      this.$getCode(cityCode, 'area', (codeData) => {
        const { area, areaList } = this.orderTableData[index];

        // eslint-disable-next-line prefer-const
        let areaItems = [];

        codeData.forEach((codeItem) => {
          if ((areaList || []).join(',').indexOf(codeItem.areaCode) > -1) {
            areaItems.push(codeItem);
          }
        });
        // console.log('select', select);
        // 过滤已经被选中的选项
        const findeIndex = areaItems.filter((areaItem) => select.join(',').indexOf(areaItem.id) < 0);

        let areaVal = area;

        // console.log('areaItems', areaItems);
        if (area.indexOf(',') > 0) {
          areaVal = findeIndex && findeIndex[0] && findeIndex[0].id;
        } else {
          const areaIndex = areaItems.filter((item) => item.id === area);

          areaVal = areaIndex && areaIndex[0] && areaIndex[0].id;
        }
        this.orderTableData[index] = {
          ...this.orderTableData[index],
          areaItems,
          areaItem: areaVal || (findeIndex && findeIndex[0] && findeIndex[0].id),
        };
        this.orderTableData.splice(1, 0);
      });
    },
    // 下拉框改变
    changeSelect(val, scope, name) {
      const index = scope.$index;
      const item = this.orderTableData.map((data, i) => {
        if (i === index) {
          // console.log('changeSelect', val);

          return {
            ...data,
            [name]: val instanceof Object ? val.name : val,
          };
        }

        return data;
      });

      this.orderTableData = item;
      this.orderTableData.splice(1, 0);
    },
    // 输入框改变
    changeInput(val, index, name) {
      this.tableData[index] = {
        ...this.tableData[index],
        [name]: val,
      };
      if (name === 'salesVolume') {
        const { deduction, taxRate } = this.tableData[index];
        const taxRateList = taxRate.split('%');

        this.tableData[index].taxAmount = (
          ((Number(val || 0) * 1000 - Number(deduction || 0) * 1000) * Number(taxRateList[0])) /
          1000 /
          100
        ).toFixed(2);
      }
      console.log('this.tableData[index]', this.tableData[index]);
      this.tableData.splice(1, 0);
    },
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
        this.tableData[row.index] = {
          ...this.tableData[row.index],
          editRow: false,
        };
        this.editRow = false;
        this.tableData.splice(1, 0);
      }
      if (type === 'del') {
        this.tableData.splice(row.index, 1);
        this.editRow = false;
      }
    },
  },
  created() {
    this.initStatus(this.data);
  },
};
</script>

<style lang="less" scoped>
#base {
  #PageTable {
    min-height: auto;
    /deep/.el-table__row {
      .el-date-editor.el-input {
        width: 100%;
      }
    }
  }
  .comp-wrapper {
    #otherBtnList {
      margin-bottom: 10px;
    }
  }
  .receiptFrom {
    width: 100%;
  }
  #upload {
    /deep/.content-view {
      margin-bottom: 0;
    }
  }
}
</style>
