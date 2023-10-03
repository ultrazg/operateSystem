<template>
  <div class="sideMenu">
    <el-menu
      class="el-menu-vertical"
      :collapse="openMenu"
      background-color="none"
      text-color="#333"
      active-text-color="#5189FF"
      :default-active="defaultActive"
      unique-opened
    >
      <template v-for="itemPar in menuData">
        <el-submenu :index="itemPar.name" v-if="itemPar.children && itemPar.children.length > 0" :key="itemPar.name">
          <template slot="title">
            <svg class="iconSvg" v-if="itemPar && itemPar.meta && itemPar.meta.icon" aria-hidden="true">
              <use v-bind:xlink:href="`#${itemPar.meta.icon}`"></use>
            </svg>
            <!-- <em :class="itemPar.meta.icon ? itemPar.meta.icon : 'noIcon'"></em> -->
            <span slot="title">{{ itemPar.meta.title }}</span>
          </template>
          <template v-for="itemSon in itemPar.children">
            <!-- 二级 -->
            <el-menu-item
              @click="activeTage(itemSon)"
              v-if="(!itemSon.children || itemSon.children.length <= 0) && !itemSon.meta.hidden"
              :key="itemSon.name"
              :index="itemSon.name"
            >
              <svg class="iconSvg" v-if="itemSon && itemSon.meta && itemSon.meta.icon" aria-hidden="true">
                <use v-bind:xlink:href="`#${itemSon.meta.icon}`"></use>
              </svg>
              <!-- <em :class="itemSon.meta.icon ? itemSon.meta.icon : 'noIcon'"></em> -->
              <span slot="title">{{ itemSon.meta.title }}</span>
            </el-menu-item>
            <!-- 三级 -->
            <el-submenu
              v-if="itemSon.children && itemSon.children.length >= 1"
              :key="itemSon.name"
              :index="itemSon.name"
            >
              <span slot="title">
                <em
                  class="pos-r"
                  :class="itemSon && itemSon.meta.icon ? itemSon.meta.icon : 'noIcon'"
                  style="top: -2px"
                ></em>
                {{ itemSon.meta.title }}
              </span>
              <template v-for="itemSonSub in itemSon.children">
                <el-menu-item
                  @click="activeTage(itemSonSub)"
                  :index="itemSonSub.name"
                  :key="itemSonSub.name"
                  v-if="(!itemSonSub.children || itemSonSub.children.length <= 0) && !itemSonSub.meta.hidden"
                >
                  <svg class="iconSvg" v-if="itemSon && itemSon.meta && itemSonSub.meta.icon" aria-hidden="true">
                    <use v-bind:xlink:href="`#${itemSonSub.meta.icon}`"></use>
                  </svg>
                  <!-- <em :class="itemSonSub.meta.icon ? itemSonSub.meta.icon : 'noIcon'"></em> -->
                  <span slot="title">{{ itemSonSub.meta.title }}</span>
                </el-menu-item>
                <!-- 四级 -->
                <el-submenu
                  v-if="itemSonSub.children && itemSonSub.children.length >= 1"
                  :key="itemSonSub.name"
                  :index="itemSonSub.name"
                >
                  <span slot="title">
                    <em
                      class="pos-r"
                      :class="itemSonSub.meta.icon ? itemSonSub.meta.icon : 'noIcon'"
                      style="top: -2px"
                    ></em>
                    {{ itemSonSub.meta.title }}
                  </span>
                  <el-menu-item
                    @click="activeTage(itemSonSubsub)"
                    :index="itemSonSubsub.name"
                    v-for="itemSonSubsub in itemSonSub.children"
                    :key="itemSonSubsub.name"
                  >
                    <svg
                      class="iconSvg"
                      v-if="itemSonSubsub && itemSonSubsub.meta && itemSonSubsub.meta.icon"
                      aria-hidden="true"
                    >
                      <use v-bind:xlink:href="`#${itemSonSubsub.meta.icon}`"></use>
                    </svg>
                    <!-- <em :class="itemSonSubsub.meta.icon ? itemSonSubsub.meta.icon : 'noIcon'"></em> -->
                    <span slot="title">{{ itemSonSubsub.meta.title }}</span>
                  </el-menu-item>
                </el-submenu>
              </template>
            </el-submenu>
          </template>
        </el-submenu>
        <el-menu-item
          v-if="!itemPar.children || itemPar.children.length == 0"
          @click="activeTage(itemPar)"
          :key="itemPar.name"
        >
          <svg class="iconSvg" v-if="itemPar && itemPar.meta && itemPar.meta.icon" aria-hidden="true">
            <use v-bind:xlink:href="`#${itemPar.meta.icon}`"></use>
          </svg>
          <!-- <em :class="itemPar && itemPar.meta.icon ? itemPar.meta.icon : 'noIcon'"></em> -->
          <span slot="title" v-if="itemPar && itemPar.meta">{{ itemPar.meta.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '', // 当前选中菜单的title名
    };
  },
  props: {
    menuData: {
      type: Array,
      default() {
        return [];
      },
    },
    defaultActive: {
      type: String,
      default: '',
    },
    openMenu: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 左侧菜单激活时候
    activeTage(item) {
      console.log(item, 'itemas');
      this.$emit('on-select', {
        name: item.name,
        title: item.meta.title,
        icon: item.icon,
        notkeepAlive: item.meta.notkeepAlive || false,
        target: item.meta.target || false,
        params: item.meta.params,
        query: item.meta.query || {},
      });
    },
  },
};
</script>

<style lang="less">
.sideMenu {
  // background: #ffffff;
  margin: 0 10px;
  .iconSvg {
    width: 1.3em;
    height: 1.3em;
    vertical-align: -0.3em;
    fill: currentColor;
    overflow: hidden;
    padding-right: 11px;
  }
  .noIcon {
    display: inline-block;
    padding-left: 4px;
  }
  // 滚动条
  &::-webkit-scrollbar-track-piece {
    //滚动条凹槽的颜色，还可以设置边框属性
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    //滚动条的宽度
    width: 2px;
    height: 2px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    //滚动条的设置
    background-color: transparent;
    background-clip: padding-box;
    min-height: 28px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: transparent;
  }
  .el-menu {
    background-color: transparent;
  }
  .el-menu-vertical {
    width: 100%;
    border: 0;
    background: transparent !important;
    // padding-bottom: 50px;
    > .el-menu-item {
      span {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #141414;
      }
    }
    .el-submenu {
      &.is-opened {
        .el-submenu__title {
          background: #fff0ee !important;
          border-radius: 4px;
          box-shadow: 0px 4px 8px 0px rgba(114, 64, 64, 0.18);
          margin-bottom: 8px;
          span {
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #141414;
          }
        }
        ul.el-menu {
          padding-left: 40px;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            width: 1px;
            background: #ececec;
            top: 0;
            bottom: 0;
            height: calc(100% - 20px);
            left: 20px;
          }
          li {
            width: 100%;
            position: relative;
            &::after {
              content: '';
              position: absolute;
              width: 15px;
              left: -20px;
              top: 50%;
              height: 1px;
              background: #ececec;
              transform: translateY(-50%);
            }
            span {
              font-size: 12px;
              color: #141414;
              font-weight: 400;
            }
          }
        }
      }
      &.is-active {
        .el-menu {
          .el-menu-item.is-active {
            background: rgba(255, 226, 214, 0.44) !important;
            border-radius: 4px;
          }
        }
      }
    }
  }
  .el-menu-item.is-active {
    em {
      // color: #ef2d32 !important;
      // font-weight: 600;
    }
    span {
      color: #ef2d32 !important;
      font-weight: 400;
    }
  }

  .el-submenu {
    > .el-submenu__title {
      height: 50px;
      line-height: 50px;
    }
  }

  .el-menu--vertical {
    .el-menu-item.is-active {
      background-color: #0d1831 !important;
      // border-right: 2px solid #2573F1;
      em {
        // color: #444444 !important;
      }
    }
  }

  .el-menu-item,
  .el-submenu__title {
    background: transparent !important;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    em {
      font-size: 20px;
      // color: none !important;
      // color: #444444;
    }
    em.iconfont {
      margin-right: 8px;
    }
    em.el-submenu__icon-arrow {
      margin-top: -4px;
      color: #444444;
      font-size: 14px;
      font-weight: 600;
      right: 10px;
    }
    &:hover {
      // background-color: #2573F1 !important;
      // box-shadow: 0px 0px 11px 2px #f5f5f5;
      color: #ef2d32 !important;
      em {
        color: #ef2d32 !important;
      }
      span {
        color: #ef2d32 !important;
      }
    }
  }

  .el-menu--collapse li[role='menuitem'].el-submenu.is-active .el-submenu__title {
    em {
      color: #fff !important;
    }
    background-color: #2573f1 !important;
  }
}
</style>
