<template>
  <grid-view>
    <goods-list-item v-for="item in categoryDetail" :goods-item="item"/>
  </grid-view>
  <!--<goods-list>-->
    <!--<goods-list-item v-for="(item, index) in categoryDetail" :key="index" :goods="item"></goods-list-item>-->
  <!--</goods-list>-->
</template>

<script>
  import GridView from 'components/common/gridView/GridView'
  import GoodsListItem from 'components/content/goods/GoodsListItem'
  // import GoodsList from "../../../components/content/goods/GoodsList";

  export default {
    name: "TabContentDetail",
    components: {
      GridView,
      // GoodList,
      GoodsListItem
    },
    props: {
      categoryDetail: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>

</style>
