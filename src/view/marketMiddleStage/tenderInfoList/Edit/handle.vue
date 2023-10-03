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
      @submit="supplyFormItemSubmitForm"
    />
    <!-- 投标文件上传 -->
    <wrapper :key="'uploadTender'" :title="'投标文件上传'" :isFold="false">
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
        <!--新增-投标文件上传-操作  -->
        <template slot-scope="scope" slot="operator">
          <flex>
            <el-button
              type="text"
              size="small"
              title="选择文件"
              icon="iconfont icon-yulan"
              @click.prevent.stop="
                openDialog('detail', '选择文件', {
                  row: scope.row,
                  type: 'base',
                  configType: 'detail',
                })
              "
            >
              选择文件
            </el-button>
            <el-button
              type="text"
              size="small"
              title="删除"
              icon="iconfont icon-shanchu"
              @click.prevent.stop="
                openDialog('delete', '删除', {
                  row: scope.row,
                  type: 'delete',
                  configType: 'delete',
                })
              "
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="small"
              title="上传"
              icon="iconfont icon-bianji"
              @click.prevent.stop="
                openDialog('edit', '上传', {
                  row: scope.row,
                  type: 'handle',
                  configType: 'edit',
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
      @submit="bidSecurityFormItemSubmitForm"
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
            <!--新增-投标情况复盘-操作  -->
            <el-button
              type="text"
              size="small"
              title="选择文件"
              icon="iconfont icon-yulan"
              @click.prevent.stop="
                openDialog('detail', '选择文件', {
                  row: scope.row,
                  type: 'base',
                  configType: 'detail',
                })
              "
            >
              选择文件
            </el-button>
            <el-button
              type="text"
              size="small"
              title="删除"
              icon="iconfont icon-shanchu"
              @click.prevent.stop="
                openDialog('delete', '删除', {
                  row: scope.row,
                  type: 'delete',
                  configType: 'delete',
                })
              "
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="small"
              title="上传"
              icon="iconfont icon-bianji"
              @click.prevent.stop="
                openDialog('edit', '上传', {
                  row: scope.row,
                  type: 'handle',
                  configType: 'edit',
                })
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
      @submit="remarkFormItemSubmitForm"
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
import OpportunitySelection from '@/view/common/opportunitySelection.vue';
import { editTenderInfo } from '@/api/marketMiddleStage/tenderInfoList';

export default {
  name: 'handleInfo',
  components: {
    FormItem,
    Wrapper,
    PageTable,
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
      form: {},
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
                this.form.purchaseModality = val;
              },
            },
            {
              label: '市场类型',
              prop: 'marketType',
              inputType: 'select',
              span: 12,
              options: this.common().marketType,
              onChange: (val) => {
                this.form.marketType = val;
              },
            },
            {
              label: '总标的金额(万元)',
              prop: 'projectScale',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '招标单位',
              prop: 'custName',
              inputType: 'input',
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
                this.form.productionCenterCode = val;
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
              label: '购买标书金额',
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
                this.form.tenderResult = val;
                console.log(val);
                if (val === 'bid_win') {
                  // 中标
                  this.isWinTheBid = true;
                } else {
                  // 除了中标以外的其他选项
                  this.isWinTheBid = false;
                }
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
          trigger: ['blur', 'change'],
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
          message: '请输入购买标书金额',
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
          required: true,
          message: '请输入招标代理编号',
          trigger: ['blur', 'change'],
        },
        biddingAgentEmail: {
          required: true,
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
      },
      uploadTenderTableData: [], // 投标文件上传 数据
      // 投标文件上传 表单内容
      tableCols: [
        {
          label: '所需附件名称',
          prop: 'productionCenter',
          align: 'center',
        },
        {
          label: '文件名',
          prop: 'busiId',
          align: 'center',
        },
        {
          label: '状态',
          prop: 'busiName',
          align: 'center',
        },
      ],
      bidSecurityFormItemLayout: [],
      bidSecurityFormItemFormRules: {},
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
      remarkFormItemFormRules: {},
    };
  },
  mounted() {
    // 先判断中标状态
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
    isWinTheBid(val) {
      this.isWinTheBidShow(val);
    },
  },
  methods: {
    // 用来判断投标结果下拉选项
    isWinTheBidShow(val) {
      if (val) {
        this.bidSecurityFormItemLayout = [
          {
            title: '中标信息',
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
                inputType: 'input',
                span: 12,
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
          {
            title: '中标服务费',
            formItems: [
              {
                label: '缴纳形式',
                prop: 'payType',
                inputType: 'input',
                span: 12,
              },
              {
                label: '缴纳金额(万元)',
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
              },
              {
                label: '报账单核销编号',
                prop: 'paySheetId',
                inputType: 'input',
                span: 12,
              },
            ],
          },
          {
            title: '投标保证金',
            formItems: [
              {
                label: '缴纳金额(万元)',
                prop: 'bondAmount',
                inputType: 'inputNumber',
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
                label: '退回金额(万元)',
                prop: 'bondCancel',
                inputType: 'inputNumber',
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
        ];
        this.bidSecurityFormItemFormRules = {
          winningUnit: {
            required: true,
            message: '请输入中标单位',
            trigger: ['blur', 'change'],
          },
          projectUnit: {
            required: true,
            message: '请输入立项生产单元',
            trigger: ['blur', 'change'],
          },
          tenderDiscount: {
            required: true,
            message: '请输入中标折扣',
            trigger: ['blur', 'change'],
          },
          predictAmount: {
            required: true,
            message: '请输入预计合同签订额(万元)',
            trigger: ['blur', 'change'],
          },
          ageLimit: {
            required: true,
            message: '请输入招标有效年限',
            trigger: ['blur', 'change'],
          },
          payType: {
            required: true,
            message: '请选择缴纳形式',
            trigger: ['blur', 'change'],
          },
          payAmount: {
            required: true,
            message: '请输入缴纳金额(万元)',
            trigger: ['blur', 'change'],
          },
          payId: {
            required: true,
            message: '请输入缴纳编号',
            trigger: ['blur', 'change'],
          },
          payIsCancel: {
            required: true,
            message: '请选择是否已核销',
            trigger: ['blur', 'change'],
          },
          paySheetId: {
            required: true,
            message: '请输入报账单核销编号',
            trigger: ['blur', 'change'],
          },
          bondAmount: {
            required: true,
            message: '请输入缴纳金额(万元)',
            trigger: ['blur', 'change'],
          },
          bondDate: {
            required: true,
            message: '请输入缴纳时间',
            trigger: ['blur', 'change'],
          },
          bondSheetId: {
            required: true,
            message: '请输入报账单编号',
            trigger: ['blur', 'change'],
          },
          bondReturnDate: {
            required: true,
            message: '请输入退回时间',
            trigger: ['blur', 'change'],
          },
          bondCancel: {
            required: true,
            message: '请输入退回金额(万元)',
            trigger: ['blur', 'change'],
          },
          bondIsCancel: {
            required: true,
            message: '请输入是否已核销',
            trigger: ['blur', 'change'],
          },
          bondCancelSheetId: {
            required: true,
            message: '请输入核销报账单编号',
            trigger: ['blur', 'change'],
          },
        };
      } else {
        this.bidSecurityFormItemLayout = [
          {
            title: '投标保证金',
            formItems: [
              {
                label: '缴纳金额(万元)',
                prop: 'bondAmount',
                inputType: 'inputNumber',
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
                label: '退回金额(万元)',
                prop: 'bondCancel',
                inputType: 'inputNumber',
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
        ];
        this.bidSecurityFormItemFormRules = {
          bondAmount: {
            required: true,
            message: '请输入缴纳金额(万元)',
            trigger: ['blur', 'change'],
          },
          bondDate: {
            required: true,
            message: '请输入缴纳时间',
            trigger: ['blur', 'change'],
          },
          bondSheetId: {
            required: true,
            message: '请输入报账单编号',
            trigger: ['blur', 'change'],
          },
          bondReturnDate: {
            required: true,
            message: '请输入退回时间',
            trigger: ['blur', 'change'],
          },
          bondCancel: {
            required: true,
            message: '请输入退回金额(万元)',
            trigger: ['blur', 'change'],
          },
          bondIsCancel: {
            required: true,
            message: '请输入是否已核销',
            trigger: ['blur', 'change'],
          },
          bondCancelSheetId: {
            required: true,
            message: '请输入核销报账单编号',
            trigger: ['blur', 'change'],
          },
        };
      }
      this.$nextTick(() => {
        this.$refs.bidSecurityFormItem.clearValidate();
      });
    },
    // 请求数据
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        this.form = {
          ...this.form,
          ...row,
        };
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
      this.$refs.bidSecurityFormItem.submitForm();
      this.$refs.remarkFormItem.submitForm();
    },
    // 提交表单
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;

      const param = {
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
      const message = configType === 'add' ? '新增成功' : '修改成功';

      console.log('param=====', param);

      editTenderInfo(param).then((res) => {
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
    // 提交文件操作
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
          bondAmount: val.bondAmount,
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
          bondAmount: val.bondAmount,
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
    // 取消提交表单
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
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
      this.form = {
        ...this.form,
        ...selectTable,
      };
      this.closeEdit();
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
}
</style>
