<template>
  <div id="base">
    <!-- 投标信息 -->
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      :labelWidth="'140px'"
      @submit="(form) => formItemSubmitForm(form, 'supplyFormItem')"
    />
    <!-- 投标文件上传 -->
    <wrapper :key="'uploadTender'" :title="'投标文件上传'" :isFold="false">
      <page-table
        ref="uploadTenderTable"
        col-align="left"
        :data="tableData"
        :cols="tableCols"
        :selection="false"
        :operator="true"
        :showPage="false"
        operator-width="110"
        :hideDefaultIndex="true"
        reserveSelection
      >
        <template slot-scope="scope" slot="operator">
          <flex>
            <upload
              :ref="`tableDataUpload${scope.index}`"
              postUrl="#"
              :fileLists="uploadFileList"
              :tableShow="false"
              :rowIndex="scope.index"
              :disabled="inputDisabled"
              @change="uploadChange"
              @remove="uploadRemove"
              @submit="uploadSubmit"
              @beforeUpload="beforeUpload"
            >
              <template slot="center">
                <el-button type="text" size="small" title="选择文件" icon="iconfont icon-xinzeng">选择文件</el-button>
              </template>
            </upload>

            <el-button
              type="text"
              size="small"
              title="删除"
              icon="iconfont icon-shanchu"
              :disabled="inputDisabled"
              @click.prevent.stop="
                tableAction('del', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="small"
              title="上传"
              icon="iconfont icon-fabu"
              :disabled="inputDisabled"
              @click.prevent.stop="
                tableAction('save', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
              上传
            </el-button>
          </flex>
        </template>
      </page-table>
    </wrapper>

    <FormItem
      ref="bidSecurityFormItem"
      :layout="bidSecurityFormItemLayout"
      :rules="bidSecurityFormItemFormRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="(form) => formItemSubmitForm(form, 'bidSecurityFormItem')"
    />

    <!-- 投标情况复盘 -->
    <wrapper
      v-for="(section, sIndex) in layout"
      :key="`section${sIndex}`"
      :title="'投标情况复盘'"
      :isFold="section.isFold"
    >
      <page-table
        ref="uploadTenderTable"
        col-align="left"
        :data="uploadTenderTableData"
        :cols="tableCols"
        :selection="false"
        :operator="true"
        :showPage="false"
        operator-width="110"
        :hideDefaultIndex="true"
        reserveSelection
      >
        <template slot-scope="scope" slot="operator">
          <flex>
            <upload
              :ref="`uploadTenderTableDataUpload${scope.index}`"
              postUrl="#"
              :fileLists="uploadFileList"
              :tableShow="false"
              :disabled="inputDisabled"
              :rowIndex="scope.index"
              @change="(file) => uploadChange(file, 'uploadTenderTableData')"
              @remove="uploadRemove"
              @submit="(file) => uploadSubmit(file, 'uploadTenderTableData')"
              @beforeUpload="beforeUpload"
            >
              <template slot="center">
                <el-button
                  type="text"
                  size="small"
                  title="选择文件"
                  icon="iconfont icon-xinzeng"
                  :disabled="inputDisabled"
                >
                  选择文件
                </el-button>
              </template>
            </upload>

            <el-button
              type="text"
              size="small"
              title="删除"
              :disabled="inputDisabled"
              icon="iconfont icon-shanchu"
              @click.prevent.stop="
                tableAction(
                  'del',
                  {
                    index: scope.index,
                    data: scope.row,
                  },
                  'uploadTenderTableData',
                )
              "
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="small"
              title="上传"
              :disabled="inputDisabled"
              icon="iconfont icon-fabu"
              @click.prevent.stop="
                tableAction(
                  'save',
                  {
                    index: scope.index,
                    data: scope.row,
                  },
                  'uploadTenderTableData',
                )
              "
            >
              上传
            </el-button>
          </flex>
        </template>
      </page-table>
    </wrapper>

    <!-- 备注 -->
    <FormItem
      ref="remarkFormItem"
      :layout="remarkFormItemLayout"
      :rules="remarkFormItemFormRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="(form) => formItemSubmitForm(form, 'remarkFormItem')"
    />
    <!-- 商机选择 -->
    <opportunity-selection
      :show="opportunitySelectionShow"
      :data="opportunitySelectionData"
      @cancel="closeEdit"
      @success="successEdit"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import upload from '@/components/upload/upload';
import Flex from '@/components/flex';
import OpportunitySelection from '@/view/common/opportunitySelection.vue';
import { uploadFile } from '@/api/user';
import { getTenderInfoById, addTenderInfo, editTenderInfo } from '@/api/marketMiddleStage/tenderInfoList';
import { getBusinessOpportunityById } from '@/api/marketMiddleStage/projectApprovalManagement';

export default {
  name: 'tenderBaseInfo',
  components: {
    FormItem,
    Wrapper,
    PageTable,
    Flex,
    upload,
    OpportunitySelection,
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
      isWinTheBid: false,
      opportunitySelectionData: {},
      opportunitySelectionShow: false,
      form: {
        payAmount: 0,
        projectScale: 0,
        documentAmount: 0,
        predictAmount: 0,
      },
      layout: [
        {
          title: '投标信息',
          formItems: [
            {
              label: '商机编号',
              prop: 'busiId',
              inputType: 'select',
              span: 12,
              onFocus: (val) => {
                this.opportunitySelectionData = {
                  ...this.data,
                  ...this.form,
                };
                this.opportunitySelectionShow = true;
                console.log('onFocus', val);
              },
            },
            // 投标信息新增
            {
              label: '投标申请编号',
              prop: 'tenderApplyId',
              inputType: 'input',
              span: 12,
              disabled: true,
            },
            {
              label: '项目信息概况',
              prop: 'busiName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目采购形式',
              prop: 'purchaseModality',
              inputType: 'select',
              span: 12,
              options: this.common().purchaseModality,
              onChange: (val) => {
                if (this.form.purchaseModality === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  purchaseModality: val,
                };
              },
            },
            {
              label: '市场类型',
              prop: 'marketType',
              inputType: 'select',
              span: 12,
              options: this.common().marketType,
              onChange: (val) => {
                if (this.form.marketType === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  marketType: val,
                };
              },
            },
            {
              label: '总标的金额(万元)',
              prop: 'projectScale',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form.projectScale = val;
              },
            },
            {
              label: '委托方',
              prop: 'custName',
              inputType: 'select',
              span: 12,
              options: this.common().constructionCode,
              filterable: true,
              span: 12,
            },
            {
              label: '投标责任人',
              prop: 'projectManager',
              inputType: 'input',
              span: 12,
            },
            {
              label: '所属生产中心',
              prop: 'productionCenter',
              inputType: 'select',
              span: 12,
              options: this.common().productionCenterCode,
              onChange: (val) => {
                if (this.form.productionCenter === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  productionCenter: val,
                };
                console.log(val);
              },
            },
            {
              label: '投标时间',
              prop: 'tenderDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '标段划分',
              prop: 'sectionDivision',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目归属',
              prop: 'projectBelong',
              inputType: 'select',
              span: 12,
              options: this.common().projectBelong,
            },
            {
              label: '招标编号',
              prop: 'purchaseId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '购买标书金额(元)',
              prop: 'documentAmount',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '购买标书方式',
              prop: 'documentType',
              inputType: 'select',
              span: 12,
              options: this.common().documentType,
            },
            {
              label: '文件获取时间',
              prop: 'documentDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '招标代理',
              prop: 'biddingAgent',
              inputType: 'input',
              span: 12,
            },
            {
              label: '招标代理编号',
              prop: 'biddingAgentId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '招标代理邮箱',
              prop: 'biddingAgentEmail',
              inputType: 'input',
              span: 12,
            },
            {
              label: '投标形式',
              prop: 'tenderType',
              inputType: 'select',
              span: 12,
              options: this.common().tenderType,
            },
            {
              label: '投标进度',
              prop: 'tenderProgress',
              inputType: 'select',
              span: 12,
              options: this.common().tenderProgress,
            },
            {
              label: '投标结果',
              prop: 'tenderResult',
              inputType: 'select',
              span: 12,
              options: this.common().tenderResult,
              onChange: (val) => {
                if (this.form.tenderResult === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  tenderResult: val,
                };
                if (val === 'bid_win') {
                  // 中标
                  this.isWinTheBid = true;
                } else {
                  // 除了中标以外的其他选项
                  this.isWinTheBid = false;
                }
              },
            },
            {
              label: '是否需要缴纳保证金',
              prop: 'isNeedBond',
              inputType: 'select',
              span: 12,
              options: this.common().bondIsCancel,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  isNeedBond: val,
                };
                this.changeBondFormItem();
              },
            },
          ],
        },
      ],
      formRules: {
        busiName: {
          required: true,
          message: '请输入项目信息概况',
          trigger: ['blur', 'change'],
        },
        purchaseModality: {
          required: true,
          message: '请选择项目采购形式',
          trigger: 'change',
        },
        marketType: {
          required: true,
          message: '请选择市场类型',
          trigger: 'change',
        },
        projectScale: {
          required: true,
          message: '请输入总标的金额(万元)',
          trigger: 'blur',
        },
        custName: {
          required: true,
          message: '请输入招标单位',
          trigger: ['blur', 'change'],
        },
        projectManager: {
          required: true,
          message: '请输入投标责任人',
          trigger: ['blur', 'change'],
        },
        productionCenter: {
          required: true,
          message: '请选择所属生产中心',
          trigger: 'change',
        },
        tenderDate: {
          required: true,
          message: '请选择投标时间',
          trigger: 'change',
        },
        sectionDivision: {
          required: true,
          message: '请输入标段划分',
          trigger: ['blur', 'change'],
        },
        projectBelong: {
          required: true,
          message: '请选择项目归属',
          trigger: 'change',
        },
        purchaseId: {
          required: true,
          message: '请输入招标编号',
          trigger: ['blur', 'change'],
        },
        documentAmount: {
          required: true,
          message: '请输入购买标书金额(元)',
          trigger: ['blur', 'change'],
        },
        documentType: {
          required: true,
          message: '请选择购买标书方式',
          trigger: 'change',
        },
        documentDate: {
          required: true,
          message: '请选择文件获取时间',
          trigger: 'change',
        },
        biddingAgent: {
          required: true,
          message: '请输入招标代理',
          trigger: ['blur', 'change'],
        },
        biddingAgentId: {
          required: false,
          message: '请输入招标代理编号',
          trigger: ['blur', 'change'],
        },
        biddingAgentEmail: {
          required: false,
          message: '请输入招标代理邮箱',
          trigger: ['blur', 'change'],
        },
        tenderType: {
          required: true,
          message: '请选择投标形式',
          trigger: 'change',
        },
        tenderProgress: {
          required: true,
          message: '请选择投标进度',
          trigger: 'change',
        },
        tenderResult: {
          required: true,
          message: '请选择投标结果',
          trigger: 'change',
        },
        isNeedBond: {
          required: true,
          message: '请选择是否需要缴纳保证金',
          trigger: 'change',
        },
      },
      // 投标文件上传数据
      tableData: [
        {
          name: '投标结果公示/文件',
          id: 'tenderResultDocumentCode',
          nameId: 'tenderResultDocumentName',
          statusId: 'tenderResultDocumentStatus',
          parames: {
            filePath: 'uploadFile//qlication',
            serviceCode: 'tenderResultDocument',
          },
        },
        {
          name: '投标文件上传',
          id: 'tenderDocumentCode',
          nameId: 'tenderDocumentName',
          statusId: 'tenderDocumentStatus',
          parames: {
            filePath: 'uploadFile//qlication',
            serviceCode: 'tenderDocument',
          },
        },
        {
          name: '招标文件上传',
          id: 'bidDocumentCode',
          nameId: 'bidDocumentName',
          statusId: 'bidDocumentStatus',
          parames: {
            filePath: 'uploadFile//qlication',
            serviceCode: 'bidDocument',
          },
        },
      ],
      // 投标情况复盘数据
      uploadTenderTableData: [
        {
          name: '投标审批表',
          id: 'fileCodeFst',
          nameId: 'fileNameFst',
          statusId: 'fileFstStatus',
          parames: {
            filePath: 'uploadFile//qlication',
            serviceCode: 'tender_file_first',
          },
        },
        {
          name: '检查投标文件明细表',
          id: 'fileCodeSec',
          nameId: 'fileNameSec',
          statusId: 'fileSecStatus',
          parames: {
            filePath: 'uploadFile//qlication',
            serviceCode: 'tender_file_second',
          },
        },
        {
          name: '投标文件审核记录表',
          id: 'fileCodeThr',
          nameId: 'fileNameThr',
          statusId: 'fileThrStatus',
          parames: {
            filePath: 'uploadFile//qlication',
            serviceCode: 'tender_file_third',
          },
        },
        {
          name: '投标复盘登记表',
          id: 'fileCodeFou',
          nameId: 'fileNameFou',
          statusId: 'fileFouStatus',
          parames: {
            filePath: 'uploadFile//qlication',
            serviceCode: 'tender_file_fourth',
          },
        },
      ],
      // 新增投标文件上传
      tableCols: [
        {
          label: '所需附件名称',
          prop: 'name',
          align: 'center',
        },
        {
          label: '文件名',
          prop: 'document',
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            if (d.code) {
              const filePath = `/api/fileupload/download?fileCode=${d.code}`;

              return (
                <div>
                  {
                    <el-link class="attachment" href={filePath} target="_blank">
                      {d.document}
                      {d.loading ? <i class="el-icon-loading"></i> : ''}
                    </el-link>
                  }
                </div>
              );
            }

            return (
              <div>
                {d.document}
                {d.loading ? <i class="el-icon-loading"></i> : ''}
              </div>
            );
          },
        },
        {
          label: '状态',
          prop: 'status',
          align: 'center',
        },
      ],
      uploadFileList: [],
      // 中标信息内容
      bidSecurityFormItemLayout: [
        {
          title: '中标信息',
          hide: true,
          formItems: [
            {
              label: '中标单位',
              prop: 'winningUnit',
              inputType: 'input',
              span: 12,
            },
            {
              label: '立项生产单元',
              prop: 'projectUnit',
              inputType: 'select',
              span: 12,
              options: this.common().productionCenterCode,
              onChange: (selectVal) => {
                this.form.projectUnit = selectVal;
              },
            },
            {
              label: '中标折扣',
              prop: 'tenderDiscount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '预计合同签订额(万元)',
              prop: 'predictAmount',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '招标有效年限',
              prop: 'ageLimit',
              inputType: 'input',
              span: 12,
            },
          ],
        },
        // 中标服务费内容
        {
          title: '中标服务费',
          hide: true,
          formItems: [
            {
              label: '缴纳形式',
              prop: 'payType',
              inputType: 'select',
              span: 12,
              options: this.common().payType,
            },
            {
              label: '缴纳金额(元)',
              prop: 'payAmount',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '缴纳编号',
              prop: 'payId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '是否已核销',
              prop: 'payIsCancel',
              inputType: 'select',
              span: 12,
              options: this.common().bondIsCancel,
              onChange: (val) => {
                if (this.form.payIsCancel === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  payIsCancel: val,
                };
                this.bidSecurityFormItemFormRules.paySheetId.required = val === 'true';
              },
            },
            {
              label: '报账单核销编号',
              prop: 'paySheetId',
              inputType: 'input',
              span: 12,
            },
          ],
        },
        // 投标保证金内容
        {
          title: '投标保证金',
          hide: true,
          formItems: [
            {
              label: '缴纳金额(万元)',
              prop: 'bondAmount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '缴纳时间',
              prop: 'bondDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '报账单编号',
              prop: 'bondSheetId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '退回时间',
              prop: 'bondReturnDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '退回金额(元)',
              prop: 'bondCancel',
              inputType: 'input',
              span: 12,
            },
            {
              label: '是否已核销',
              prop: 'bondIsCancel',
              inputType: 'select',
              span: 12,
              options: this.common().bondIsCancel,
            },
            {
              label: '核销报账单编号',
              prop: 'bondCancelSheetId',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      // 中标信息内容
      bidSecurityFormItemFormRules: {
        winningUnit: {
          required: false,
          message: '请输入中标单位',
          trigger: ['blur', 'change'],
        },
        projectUnit: {
          required: false,
          message: '请输入立项生产单元',
          trigger: ['blur', 'change'],
        },
        tenderDiscount: {
          required: false,
          message: '请输入中标折扣',
          trigger: ['blur', 'change'],
        },
        predictAmount: {
          required: false,
          message: '请输入预计合同签订额(万元)',
          trigger: ['blur', 'change'],
        },
        ageLimit: {
          required: false,
          message: '请输入招标有效年限',
          trigger: ['blur', 'change'],
        },
        payType: {
          required: false,
          message: '请选择缴纳形式',
          trigger: ['blur', 'change'],
        },
        payAmount: {
          required: false,
          message: '请输入缴纳金额(元)',
          trigger: ['blur', 'change'],
        },
        payId: {
          required: false,
          message: '请输入缴纳编号',
          trigger: ['blur', 'change'],
        },
        payIsCancel: {
          required: false,
          message: '请选择是否已核销',
          trigger: ['blur', 'change'],
        },
        paySheetId: {
          required: false,
          message: '请输入报账单核销编号',
          trigger: ['blur', 'change'],
        },
        bondAmount: {
          required: false,
          message: '请输入缴纳金额(万元)',
          trigger: ['blur', 'change'],
        },
        bondDate: {
          required: false,
          message: '请输入缴纳时间',
          trigger: ['blur', 'change'],
        },
        bondSheetId: {
          required: false,
          message: '请输入报账单编号',
          trigger: ['blur', 'change'],
        },
      },
      remarkFormItemLayout: [
        {
          title: '备注',
          formItems: [
            {
              label: '备注',
              prop: 'remark',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      remarkFormItemFormRules: {}, // 备注内容
      formChange: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.form.tenderResult === '中标') {
        this.isWinTheBid = true;
        this.isWinTheBidShow(this.isWinTheBid);
      }
    });
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
    // 中标状态
    isWinTheBid(val) {
      this.isWinTheBidShow(val);
      this.changeBondFormItem();
    },
    formChange(val) {
      const valFormName = [...new Set(val)];

      if (valFormName.length === 3) {
        this.submitForm(this.form);
      }
    },
  },
  methods: {
    // 用来判断投标结果下拉选项
    isWinTheBidShow(val) {
      console.log('val', val);
      if (val) {
        this.bidSecurityFormItemLayout[0].hide = false;
        this.bidSecurityFormItemLayout[1].hide = false;
        this.bidSecurityFormItemLayout[2].hide = true;
        this.changeRequired(
          [
            'winningUnit',
            'projectUnit',
            // 'tenderDiscount',
            'predictAmount',
            'ageLimit',
            'payType',
            // 'payAmount',
            // 'payId',
            // 'payIsCancel',
          ],
          true,
        );
      } else {
        this.bidSecurityFormItemLayout[0].hide = true;
        this.bidSecurityFormItemLayout[1].hide = true;
        this.changeRequired([
          'winningUnit',
          'projectUnit',
          // 'tenderDiscount',
          'predictAmount',
          'ageLimit',
          'payType',
          // 'payAmount',
          // 'payId',
          // 'payIsCancel',
        ]);
      }
    },
    changeRequired(props, boolean = false) {
      props.forEach((prop) => {
        this.bidSecurityFormItemFormRules[prop].required = boolean;
      });
    },
    // 中标后获取数据
    changeBondFormItem() {
      if (this.bidSecurityFormItemLayout[2]) {
        this.bidSecurityFormItemLayout[2].hide = !this.form.isNeedBond || this.form.isNeedBond !== 'true';
        this.bidSecurityFormItemFormRules.bondAmount.required = this.form.isNeedBond === 'true';
        this.bidSecurityFormItemFormRules.bondDate.required = this.form.isNeedBond === 'true';
        // this.bidSecurityFormItemFormRules.bondSheetId.required = this.form.isNeedBond === 'true';
      }
      this.$nextTick(() => {
        if (this.isEdit && this.$refs.bidSecurityFormItem) {
          this.$refs.bidSecurityFormItem.clearValidate();
        }
      });
    },
    // 请求数据
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        getTenderInfoById(row.id).then((res) => {
          if (res && res.code === '200') {
            this.isWinTheBidShow(res.data.tenderResult === 'bid_win');

            this.form = {
              ...this.form,
              ...res.data,
            };
            this.changeBondFormItem();
            // console.log('this.form', this.form);
            this.setTableData('tableData', res.data);
            this.setTableData('uploadTenderTableData', res.data);
          }
        });
      }
    },
    // 表单数据
    setTableData(name, data) {
      this[name] = this[name].map((tableItem) => ({
        ...tableItem,
        document: data[tableItem.nameId],
        code: data[tableItem.id],
        status: data[tableItem.statusId],
      }));
      this[name].splice(1, 0);
    },

    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
      if (this.$refs.bidSecurityFormItem) {
        this.$refs.bidSecurityFormItem.submitForm();
      }
      this.$refs.remarkFormItem.submitForm();
    },
    // 提交信息数据
    submitForm(val) {
      console.log('this.data', this.data, val);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;

      let parames = {
        ...val,
        id,
        // 投标信息
        busiId: val.busiId,
        tenderApplyId: val.tenderApplyId,
        busiName: val.busiName,
        purchaseModality: val.purchaseModality,
        marketType: val.marketType,
        projectScale: val.projectScale,
        custName: val.custName,
        projectManager: val.projectManager,
        productionCenter: val.productionCenter,
        tenderDate: val.tenderDate,
        sectionDivision: val.sectionDivision,
        projectBelong: val.projectBelong,
        purchaseId: val.purchaseId,
        documentAmount: val.documentAmount,
        documentType: val.documentType,
        documentDate: val.documentDate,
        biddingAgent: val.biddingAgent,
        biddingAgentId: val.biddingAgentId,
        biddingAgentEmail: val.biddingAgentEmail,
        tenderType: val.tenderType,
        tenderProgress: val.tenderProgress,
        tenderResult: val.tenderResult,

        // 中标信息
        winningUnit: val.winningUnit,
        projectUnit: val.projectUnit,
        tenderDiscount: val.tenderDiscount,
        predictAmount: val.predictAmount,
        ageLimit: val.ageLimit,
        // 中标服务费
        payType: val.payType,
        payAmount: val.payAmount,
        payId: val.payId,
        payIsCancel: val.payIsCancel,
        paySheetId: val.paySheetId,

        // 投标保证金
        bondAmount: val.bondAmount,
        bondDate: val.bondDate,
        bondSheetId: val.bondSheetId,
        bondReturnDate: val.bondReturnDate,
        bondCancel: val.bondCancel,
        bondIsCancel: val.bondIsCancel,
        bondCancelSheetId: val.bondCancelSheetId,

        // 编辑时从行上面带过来的数据
        bidDocumentCode: val.bidDocumentCode,
        bidDocumentName: val.bidDocumentName,
        bidDocumentStatus: val.bidDocumentStatus,
        tenderDocumentCode: val.tenderDocumentCode,
        tenderDocumentName: val.tenderDocumentName,
        tenderDocumentStatus: val.tenderDocumentStatus,
        tenderId: val.tenderId,

        file: val.file,
        fileCodeFou: val.fileCodeFou,
        fileCodeFst: val.fileCodeFst,
        fileCodeSec: val.fileCodeSec,
        fileCodeThr: val.fileCodeThr,
        fileFouStatus: val.fileFouStatus,
        fileFstStatus: val.fileFstStatus,
        fileNameFou: val.fileNameFou,
        fileNameFst: val.fileNameFst,
        fileNameSec: val.fileNameSec,
        fileNameThr: val.fileNameThr,
        fileSecStatus: val.fileSecStatus,
        fileThrStatus: val.fileThrStatus,
        // 备注
        remark: val.remark,
      };

      let api = addTenderInfo;

      let message = '新增成功';

      if (id) {
        parames = {
          ...parames,
          id: `${id}`,
        };
        message = '更新成功';
        api = editTenderInfo;
      }
      api(parames).then((res) => {
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
    formItemSubmitForm(val, type) {
      // 备注
      console.log('formItemSubmitForm', val);
      const params = {
        ...val,
      };

      this.form = {
        ...this.form,
        ...params,
      };
      this.formChange.push(type);
    },
    supplyFormItemSubmitForm(val) {
      const { configType, row } = this.data;

      let editDataObj = {};

      if (configType === 'add') {
        editDataObj = {
          // 新增时数据状态
          id: '',
          bidDocumentCode: '',
          bidDocumentName: '',
          bidDocumentStatus: '',
          tenderDocumentCode: '',
          tenderDocumentName: '',
          tenderDocumentStatus: '',
          tenderId: '',
        };
      } else {
        editDataObj = {
          // 其他情况数据状态
          id: this.form.id,
          bidDocumentCode: this.form.bidDocumentCode,
          bidDocumentName: this.form.bidDocumentName,
          bidDocumentStatus: this.form.bidDocumentStatus,
          tenderDocumentCode: this.form.tenderDocumentCode,
          tenderDocumentName: this.form.tenderDocumentName,
          tenderDocumentStatus: this.form.tenderDocumentStatus,
          tenderId: this.form.tenderId,
        };
      }

      this.form = {
        ...editDataObj,
      };
      // 投标信息
      const params = {
        busiId: val.busiId,
        tenderApplyId: val.tenderApplyId,
        busiName: val.busiName,
        purchaseModality: val.purchaseModality,
        marketType: val.marketType,
        projectScale: val.projectScale,
        custName: val.custName,
        projectManager: val.projectManager,
        productionCenter: val.productionCenter,
        tenderDate: val.tenderDate,
        sectionDivision: val.sectionDivision,
        projectBelong: val.projectBelong,
        purchaseId: val.purchaseId,
        documentAmount: val.documentAmount,
        documentType: val.documentType,
        documentDate: val.documentDate,
        biddingAgent: val.biddingAgent,
        biddingAgentId: val.biddingAgentId,
        biddingAgentEmail: val.biddingAgentEmail,
        tenderType: val.tenderType,
        tenderProgress: val.tenderProgress,
        tenderResult: val.tenderResult,
      };

      this.form = {
        ...this.form,
        ...params,
      };
    },
    bidSecurityFormItemSubmitForm(val) {
      // 投标保证金
      if (this.isWinTheBid) {
        const params = {
          // 中标信息
          winningUnit: val.winningUnit,
          projectUnit: val.projectUnit,
          tenderDiscount: val.tenderDiscount,
          predictAmount: val.predictAmount,
          ageLimit: val.ageLimit,
          // 中标服务费
          payType: val.payType,
          payAmount: val.payAmount,
          payId: val.payId,
          payIsCancel: val.payIsCancel,
          paySheetId: val.paySheetId,

          // 投标保证金
          bondAmount: parseFloat(val.bondAmount || 0),
          bondDate: val.bondDate,
          bondSheetId: val.bondSheetId,
          bondReturnDate: val.bondReturnDate,
          bondCancel: val.bondCancel,
          bondIsCancel: val.bondIsCancel,
          bondCancelSheetId: val.bondCancelSheetId,
        };

        this.form = {
          ...this.form,
          ...params,
        };
      } else {
        const params = {
          // 投标保证金
          bondAmount: parseFloat(val.bondAmount || 0),
          bondDate: val.bondDate,
          bondSheetId: val.bondSheetId,
          bondReturnDate: val.bondReturnDate,
          bondCancel: val.bondCancel,
          bondIsCancel: val.bondIsCancel,
          bondCancelSheetId: val.bondCancelSheetId,
        };

        this.form = {
          ...this.form,
          ...params,
        };
      }
    },
    remarkFormItemSubmitForm(val) {
      // 备注
      const params = {
        // 投标保证金
        remark: val.remark,
      };

      this.form = {
        ...this.form,
        ...params,
      };
      this.submitForm(this.form);
    },
    // 取消表单
    cancelForm() {
      this.form = {};
      this.formChange = [];
      this.$refs.supplyFormItem.cancelForm();
      if (this.$refs.bidSecurityFormItem) {
        this.$refs.bidSecurityFormItem.cancelForm();
      }
      this.$refs.remarkFormItem.cancelForm();
    },
    // 关闭预览
    closeEdit() {
      this.opportunitySelectionShow = false;
      this.opportunitySelectionData = {};
    },
    // 成功获取数据
    successEdit(selectTable) {
      console.log('selectTable', selectTable);
      this.selectTable = selectTable;
      getBusinessOpportunityById(selectTable.id).then((res) => {
        if (res && res.code === '200') {
          this.form = {
            ...this.form,
            // 投标部分信息
            busiId: selectTable.busiId,
            busiName: res.data.busiName,
            purchaseModality: res.data.purchaseModality,
            marketType: res.data.marketType,
            projectScale: res.data.projectScale,
            custName: res.data.custName,
            projectManager: res.data.projectManager,
          };
        }
      });

      this.closeEdit();
    },
    // 表单操作情况
    tableAction(type, row, name = 'tableData') {
      if (type === 'edit') {
        this.uploadFileIndex = row.index;
      }
      if (type === 'save') {
        const refsDom = this.$refs[`${name}Upload${row.index}`];

        if (Array.isArray(refsDom)) {
          refsDom[0].submitUpload(row.index);
        } else {
          refsDom.submitUpload(row.index);
        }
      }
      if (type === 'del') {
        this[name][row.index] = {
          id: this[name][row.index].id,
          nameId: this[name][row.index].nameId,
          statusId: this[name][row.index].statusId,
          name: this[name][row.index].name,
          parames: this[name][row.index].parames,
        };
        this[name].splice(1, 0);
      }
    },
    // 上传文件
    uploadChange(file, name = 'tableData') {
      const length = file.fileList.length - 1;

      this[name][file.rowIndex] = {
        ...this[name][file.rowIndex],
        document: file.fileList[length].name,
        file: file.fileList[length],
      };
      this[name].splice(1, 0);
    },
    // 取消上传
    uploadRemove(file) {
      console.log('uploadRemove', file);
    },
    // 上传前
    beforeUpload(file) {
      console.log('file', file);

      return this;
    },
    // 提交上传
    uploadSubmit(file, name = 'tableData') {
      const table = this[name][file.rowIndex];

      if (!table.file) {
        this.$notifyError('请先选择上传文件!!!');

        return;
      }
      this[name][file.rowIndex] = {
        ...table,
        loading: true,
      };
      this[name].splice(1, 0);
      this.$message({
        message: '文件正在上传中，请误关闭弹窗！',
        type: 'warning',
      });
      const wfForm = new FormData();

      wfForm.append('file', table.file.raw);
      Object.keys(table.parames).forEach((parame) => {
        wfForm.append(parame, table.parames[parame]);
      });
      // 上传文件情况判断
      uploadFile(wfForm).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '文件上传成功',
            type: 'success',
            position: 'bottom-right',
          });
          const fileCode = res.data;

          const list = fileCode.split(':');

          this.uploadFileList = [];
          this[name][file.rowIndex] = {
            ...table,
            code: list[1],
            loading: false,
            status: '上传成功',
          };
          this.form = {
            ...this.form,
            [table.nameId]: list[0],
            [table.id]: list[1],
            [table.statusId]: '上传成功',
          };
        } else {
          this.$notifyError(res.message);
          this[name][file.rowIndex] = {
            ...table,
            loading: false,
            status: '上传失败',
          };
        }
        // console.log('this.tableData', this[name]);
        this[name].splice(1, 0);
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
    min-height: auto;
  }
}
#upload {
  /deep/.content-view {
    margin-bottom: 0;
  }
}
</style>
