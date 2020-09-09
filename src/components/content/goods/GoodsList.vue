<template>
    <!--<div class="goods">-->
      <!--<goods-list-item v-for="item in goods" :goods-item="item"/>-->
    <!--</div>-->
  <grid-view>
    <goods-list-item v-for="item in goods" :goods-item="item"/>
  </grid-view>
</template>

<script>
  import GridView from 'components/common/gridView/GridView'
  import GoodsListItem from './GoodsListItem'

  export default {
    name: "GoodsList",
    components: {
      GridView,
      GoodsListItem
    },
    props: {
      goods: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .goods {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    padding: 2px;
  }


</style>
