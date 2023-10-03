<template>
  <div id="base">
    <wrapper title="公司资质" v-if="qualificationType === '0'">
      <page-table
        ref="pageTable"
        col-align="left"
        :data="companyTableData"
        :cols="companyTableCols"
        :selection="false"
        :operator="false"
        :showPage="false"
        reserveSelection
        hideDefaultIndex
      >
      </page-table>
    </wrapper>
    <wrapper title="人员资质" v-if="qualificationType === '1'">
      <page-table
        ref="pageTable"
        col-align="left"
        :data="tableData"
        :cols="tableCols"
        :selection="false"
        :operator="false"
        :showPage="false"
        reserveSelection
        hideDefaultIndex
      >
      </page-table>
    </wrapper>
  </div>
</template>

<script>
import wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import { inventory } from '@/api/qualificationManagement/qualificationInfo';

export default {
  name: 'baseInfo',
  components: {
    wrapper,
    PageTable,
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
      qualificationType: '0',
      companyTableData: [],
      companyTableCols: [
        {
          label: '下载人',
          prop: 'downloadPeople',
        },
        {
          label: '下载时间',
          prop: 'downloadTime',
        },
        {
          label: '申请资质类型',
          prop: 'qualificationType',
        },
        {
          label: '申请资质名称',
          prop: 'name',
        },
        {
          label: '资质等级',
          prop: 'level',
        },
      ],
      tableData: [],
      tableCols: [
        {
          label: '下载人',
          prop: 'downloadPeople',
        },
        {
          label: '下载时间',
          prop: 'downloadTime',
        },
        {
          label: '申请资质类型',
          prop: 'qualificationType',
        },
        {
          label: '姓名',
          prop: 'personName',
        },
        {
          label: '申请资质名称',
          prop: 'name',
        },
        {
          label: '资质等级',
          prop: 'level',
        },
      ],
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

      console.log('rowsssss', row);
      if (row && row.qualificationType) {
        const qualificationItem = this.common().qualificationType.filter(
          (qualification) => qualification.name === row.qualificationType || qualification.id === row.qualificationType,
        );

        this.qualificationType = qualificationItem && qualificationItem[0] && qualificationItem[0].id;
      }
      if (row && row.id) {
        inventory(row.id).then((res) => {
          if (res && res.code === '200') {
            console.log('this.qualificationType', this.qualificationType);
            if (this.qualificationType === '0') {
              this.companyTableData = res.data;
            } else {
              this.tableData = res.data;
            }
          }
        });
      }
    },
    cancelForm() {
      this.form = {};
    },
  },
  created() {
    this.inputDisabled = this.data.configType === 'detail';
    this.isEdit = ['add', 'edit'].includes(this.data.configType);
    this.isAdd = ['add'].includes(this.data.configType);
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
</style>
