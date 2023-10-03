# Vue-Style-Guide

### 1 Vue属性书写顺序

```javascript
export default {
  mixins,
  data,
  props,
  store，
  computed，
  route,
  created，
  ready，    // => 生命周期顺序不赘述
  event,
  watch,
  components,
  methods
}
```



### 2 组件

#### 2.1 命名

组件以驼峰命名

```html
<template>
  <myComponents></myComponents>
</template>
<script>
  import myComponents from './myComponents.vue'

  export default {
  components: {
  	  myComponents
    }
  }
</script>

```
#### 2.2 Vue组件的书写顺序
建议：template script style 的顺序书写
```vue
<template></template>
<script></script>
<style></style>
```
#### 2.3 组件引用

```javascript
  import myComponentsA from './myComponentsA.vue'  
  import myComponentsB from './myComponentsB.vue'
  import myComponentsC from './myComponentsC.vue'
  import myComponentsD from './myComponentsD.vue'
  export default {
    components: {
  	  myComponentsA,
      myComponentsB,
      myComponentsC,
      myComponentsD,
    }
  }
```

### 3 事件

```html
<!-- bad -->
<a v-on:click="pass()">pass</a>

<!-- good -->
<a @click="pass">pass</a>
```

### 4 注释

* 1、公共的函数方法、常量和重要变量的定义。

* 2、业务系统中，晦涩难懂的需求。

* 3、多步骤的流程。最好用1，2，3，4··· 标明顺序。

* 4、复杂的算法。
