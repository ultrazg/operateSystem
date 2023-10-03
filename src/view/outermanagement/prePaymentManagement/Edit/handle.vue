<template>
  <div id="base">
    <div class="cont pd-10">
      <div class="printTable tx-center" id="printTable" ref="printTable" style="padding: 10px 10px">
        <table border="1">
          <caption class="caption">
            A06735增值税预缴税款表
          </caption>
          <caption class="caption-foot f-14 mb-5">
            <p class="mb-5">
              税款所属时间： {{ form.prePaymentDtos[0] && form.prePaymentDtos[0].ascriptionSTime }} 至
              {{ form.prePaymentDtos[0] && form.prePaymentDtos[0].ascriptionETime }}
            </p>
            <p>
              纳税人识别号 ：
              <span class="rectangle mr-5" v-for="item in form.subjectTaxNoArray" :key="item">{{ item }}</span
              >&nbsp;
              <!-- </div> -->
              <span class="ml-30"
                >是否适用一般计税方法
                <span class="ml-30"
                  >是
                  <span class="rectangle"
                    ><i
                      class="layui-icon layui-icon-ok"
                      v-if="form.taxType === 'TAX_TYPE_001'"
                      th:style="'display:block'"
                    ></i></span
                  >&nbsp;&nbsp;否
                  <span class="rectangle"
                    ><i
                      class="layui-icon layui-icon-ok"
                      v-if="form.taxType === 'TAX_TYPE_001'"
                      th:style="'display:block'"
                    ></i
                  ></span>
                </span>
              </span>
            </p>
          </caption>
          <tbody>
            <tr>
              <td width="130">纳税人名称：(公章)</td>
              <td width="80">{{ form.subjectName }}</td>
              <td width="130"></td>
              <td width="130"></td>
              <td width="130">金额单位：&nbsp;&nbsp;元 <br />(列至角分)</td>
              <td width="130">{{ form.prePaymentDtos[0] && form.prePaymentDtos[0].taxAmount }}</td>
            </tr>
            <tr>
              <td colspan="2">项目编号</td>
              <td>{{ form.erp }}</td>
              <td>项目名称</td>
              <td colspan="2">{{ form.projectName }}</td>
            </tr>
            <tr>
              <td colspan="2">项目地址</td>
              <td colspan="4">{{ form.manageLocalAll }}</td>
            </tr>
            <tr>
              <td rowspan="2" colspan="2">预征项目和栏次</td>
              <td>销售额</td>
              <td>扣除金额</td>
              <td>预征率</td>
              <td>预征税额</td>
            </tr>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
            </tr>
            <tr>
              <td>{{ form.modeTypeName }}</td>
              <td>1</td>
              <td>{{ form.prePaymentDtos[0] && form.prePaymentDtos[0].salesVolume }}</td>
              <td>{{ form.prePaymentDtos[0] && form.prePaymentDtos[0].deduction }}</td>
              <td>{{ form.taxRate }}</td>
              <td>{{ form.prePaymentDtos[0] && form.prePaymentDtos[0].taxAmount }}</td>
            </tr>
            <tr>
              <td>合计</td>
              <td>1</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>授 <br />权 <br />声 <br />明</td>
              <td colspan="2" class="tx-left">
                如果你已委托代理人填报，请填写下列资料： <br />
                为代理一切税务事宜，现授权 (地址) 为本次纳税人的代理填报人，任何与本表有关的往来文件，都
              </td>
              <td>填 <br />表 <br />人 <br />申 <br />明</td>
              <td colspan="2" class="tx-left">
                以上内容是真实的、可靠的、完整的。
                <p class="mt-30">纳税人签字：</p>
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
import { prePaymentPrintPage } from '@/api/outermanagement/prePaymentManagement';

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
        prePaymentPrintPage(row.id).then((res) => {
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
    width: 13px;
    height: 13px;
    font-size: 12px;
    line-height: 13px;
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
