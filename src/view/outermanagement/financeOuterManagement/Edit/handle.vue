<template>
  <div id="base">
    <div class="cont pd-10">
      <div class="printTable tx-center" id="printTable" ref="printTable" style="padding: 10px 10px">
        <table border="1">
          <caption class="caption">
            跨区域涉税事项报告表
          </caption>
          <tbody>
            <tr>
              <td>纳税人名称</td>
              <td colspan="2">{{ form.subjectName }}</td>
              <td>纳税人识别号(统一社会信用代码)</td>
              <td colspan="2">{{ form.subjectTaxNo }}</td>
            </tr>
            <tr>
              <td>经办人</td>
              <td>{{ form.operatorPName }}</td>
              <td>座机</td>
              <td></td>
              <td>手机</td>
              <td>{{ form.operatorTel }}</td>
            </tr>
            <tr>
              <td>跨区域涉税事项联系人</td>
              <td>{{ form.contactPName }}</td>
              <td>座机</td>
              <td></td>
              <td>手机</td>
              <td>{{ form.contactTel }}</td>
            </tr>
            <tr>
              <td>跨区域经营地址</td>
              <td colspan="5">{{ form.manageLocalAll }}</td>
            </tr>
            <tr>
              <td>经营方式</td>
              <td colspan="5">
                建筑安装
                <span class="rectangle ml-3 mr-5">
                  <i
                    class="layui-icon layui-icon-ok"
                    th:style="'display:' + @{(${financeOutermanagDto.modeType eq 'mode_type_1'} ? 'inline' : 'none')} + ''"
                  ></i>
                </span>
                装饰修饰
                <span class="rectangle ml-3 mr-5"></span>
                修理修配
                <span class="rectangle ml-3 mr-5">
                  <i
                    class="layui-icon layui-icon-ok"
                    th:style="'display:' + @{(${financeOutermanagDto.modeType eq 'mode_type_2'} ? 'inline' : 'none')} + ''"
                  ></i>
                </span>
                加工
                <span class="rectangle ml-3 mr-5"></span>
                批发
                <span class="rectangle ml-3 mr-5"></span>
                零售
                <span class="rectangle ml-3 mr-5"></span>
                批零兼营
                <span class="rectangle ml-3 mr-5"></span>
                零批兼营
                <span class="rectangle ml-3 mr-5"></span>
                其他
                <span class="rectangle ml-3 mr-5"></span>
              </td>
            </tr>
            <tr>
              <td>合同名称</td>
              <td colspan="2">{{ form.hireName }}</td>
              <td>合同编号</td>
              <td colspan="2">{{ form.hireOrderId }}</td>
            </tr>
            <tr>
              <td>合同金额</td>
              <td colspan="2">{{ form.taxAmount }}</td>
              <td>合同有效期限</td>
              <td colspan="2">
                {{ form.startTime }} 至
                {{ form.endTime }}
              </td>
            </tr>
            <tr>
              <td>合同相对方名称</td>
              <td colspan="2">{{ form.hireOwnerName }}</td>
              <td>合同相对方纳税人识别号(统一社会信用代码)</td>
              <td colspan="2">{{ form.hireOwnerTaxNo }}</td>
            </tr>
            <tr>
              <td rowspan="2">延长有效期</td>
              <td colspan="2">跨区域涉税事项报验管理编号</td>
              <td colspan="3">{{ form.taxNumber }}</td>
            </tr>
            <tr>
              <td colspan="2">最新有效期止</td>
              <td colspan="3">
                {{ form.sExtendTime }} 至
                {{ form.eExtendTime }}
              </td>
            </tr>
            <tr>
              <td colspan="6">
                <p class="tx-left">
                  纳税人声明：我承诺，上述填报内容是真实的、可靠的、完整的，并愿意承担相应法律责任。
                </p>
                <p class="mt-30 tx-right pr-30"><span class="pr-30">经办人： </span>纳税人(盖章)</p>
                <p class="tx-right mb-30 pr-25">
                  年 <span class="innBlock" style="width: 30px"></span>月
                  <span class="innBlock" style="width: 30px"></span>日
                </p>
                <p>
                  税务机关事项告知：纳税人应当在跨区域涉税事项报验管理有效期内在经营地从事经营活动，若合同延期，可向经营地或机构所在地的税务机关办理报验管理有效期的延期手续。
                </p>
              </td>
            </tr>
            <tr>
              <td colspan="6" class="tx-center f-14 f-weight">以下由税务机关填写</td>
            </tr>
            <tr>
              <td colspan="6">
                <p class="tx-left">
                  跨区域涉税事项报验管理编号：
                  <span class="pl-50"> 税跨报〔 〕 号</span>
                </p>
                <p class="tx-left mt-20">
                  经办人：
                  <span class="ml-40">负责人： </span>
                </p>
                <p class="tx-right pr-30">税务机关(盖章)</p>
                <p class="tx-right pr-30">
                  年 <span class="innBlock" style="width: 30px"></span>月
                  <span class="innBlock" style="width: 30px"></span>日
                </p>
                <p class="mb-20 mt-15">税务机关联系电话：</p>
              </td>
            </tr>
            <tr>
              <td colspan="3">跨区域涉税事项报验管理有效日期</td>
              <td colspan="3">
                自 <span class="innBlock" style="width: 30px"></span>年
                <span class="innBlock" style="width: 20px"></span>月
                <span class="innBlock" style="width: 20px"></span>日起至
                <span class="innBlock" style="width: 30px"></span>年
                <span class="innBlock" style="width: 20px"></span>月
                <span class="innBlock" style="width: 20px"></span>日
              </td>
            </tr>
            <tr>
              <td colspan="3">延长后的跨区域涉税事项报验管理有效日期</td>
              <td colspan="3">
                自 <span class="innBlock" style="width: 30px"></span>年
                <span class="innBlock" style="width: 20px"></span>月
                <span class="innBlock" style="width: 20px"></span>日起至
                <span class="innBlock" style="width: 30px"></span>年
                <span class="innBlock" style="width: 20px"></span>月
                <span class="innBlock" style="width: 20px"></span>日
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'; // 转图片打印需要先安装html2Canvas和print-js
import printJS from 'print-js';
import { detailPrintPage } from '@/api/outermanagement/financeOuterManagement';

export default {
  name: 'baseInfo',
  components: {},
  props: {
    show: Boolean,
    data: {},
  },
  inject: ['common'],
  data() {
    const { configType } = this.data;

    return {
      /** 输入禁用 */
      form: {
        prePaymentDtos: [],
        subjectTaxNoArray: [],
      },
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  watch: {
    data(val) {
      this.reqDetail();
    },
  },
  methods: {
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        detailPrintPage(row.id).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              ...res.data,
            };
          }
        });
      }
    },
    submitFormItem() {
      this.submitForm();
    },
    submitForm(val) {
      window.pageYoffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const htmlDom = document.getElementById('printTable');
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const that = this;

      html2canvas(this.$refs.printTable, {
        logging: false,
        width: htmlDom.clientWidth + 10,
        height: htmlDom.clientHeight + 50,
        scrollY: -170,
        scrollX: 0,
        backgroundColor: null,
        useCORS: true,
        scale: 2, // 放大
        dpi: 300,
        ignoreElements: (element) => element.className.indexOf('no-want-print') > -1,
      }).then((canvas) => {
        const url = canvas.toDataURL();

        that.img = url;
        printJS({
          printable: url,
          type: 'image',
          documentTitle: that.title,
        });
      });
    },
    cancelForm() {
      this.form = {};
    },
  },
  created() {
    this.reqDetail();
  },
};
</script>

<style lang="less" scoped>
#base {
  .printTable {
    width: 100%;
    box-sizing: border-box;
    margin: 0 auto;
    border: 1px solid #333;
    padding: 50px 10px;
    table {
      width: 100%;
    }
  }

  table td {
    padding: 5px 10px;
    font-size: 14px;
    text-align: left;
  }

  table .caption {
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-bottom: 15px;
  }

  table .rectangle {
    border: 1px solid #333;
    width: 11px;
    height: 11px;
    display: inline-block;
    *zoom: 1;
    *display: inline;
    position: relative;
    vertical-align: middle;
  }

  table .rectangle i {
    font-size: 14px;
    font-weight: bold;
    position: absolute;
    top: -1px;
  }
}
</style>
