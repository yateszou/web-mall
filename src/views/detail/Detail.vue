<template>
    <div id="detail">
      <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
      <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
        <detail-swiper :top-images="topImages"/>
        <detail-base-info :goods="goods"/>
        <detail-shop-info :shop="shop"/>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
        <detail-param-info ref="params" :param-info="paramInfo"/>
        <detail-comment-info ref="comment" :comment-info="commentInfo"/>
        <goods-list ref="recommend" :goods="recommends"/>
      </scroll>
      <detail-bottom-bar @addCart="addToCart"/>
      <back-top @click.native="backClick" v-show="isShowBackTop"/>
      <!--<toast :message="message" :show="show"/>-->
    </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  import BackTop from 'components/content/backTop/BackTop'
  // import Toast from 'components/common/toast/Toast'

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail";
  import {debounce} from "common/utils";

  import { mapActions } from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      BackTop
      // Toast
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs:[],
        getThemeTopY: null,
        currentIndex:0,
        isShowBackTop: false
        // message:"",
        // show: false
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 1.获取顶部图片轮播数据
        // console.log(res);
        const data = res.result
        this.topImages = data.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺对象信息
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        // 5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 6.取出评论的信息
        if(data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

        if(data.rate.Crate !==0) {
          this.commentInfo = data.rate.list[0]
        }
      })

      // 3.请求推荐数据
      getRecommend().then(res => {
        // console.log(res);
        this.recommends = res.data.list
      })

      // 4.给getThemeTopY赋值
      this.getThemeTopY = debounce(() => {

        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop-44)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop-44)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-44)
        this.themeTopYs.push(Number.MAX_VALUE)
        console.log(this.themeTopYs);
      }, 100)
    },
    mounted() {

    },
    updated() {

    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      contentScroll(position) {
        // 1.获取y值
        const positionY = -position.y
        // 2.positionY和主题中值进行对比
        // [0, 6236, 7039, 7255]
        // positionY 在 0 和 6236 之间，index = 0
        // positionY 在 6236 和 7039 之间，index = 1
        // positionY 在 7039 和 7255 之间，index = 2
        // positionY 超过 7255 值，index = 3
        let length = this.themeTopYs.length
        for(let i = 0; i < length-1; i++) {
          // if (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
          //   console.log(i);
          // }

          if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }

          // if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          //   this.currentIndex = i
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }
        }

        // 3.是否显示回到顶部
        this.isShowBackTop = (-position.y) > 1000
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },
      addToCart() {
        // 1.获取购物车需要展示的商品信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        // 2.将商品添加到购物车
        // this.$store.cartList.push(product)
        // this.$store.commit('addCart', product)

        this.addCart(product).then(res => {
          this.$toast.show(res, 1500)
        })

        // this.$store.dispatch('addCart', product).then(res => {
        //   console.log(res);
        // })

        // 3.添加到购物车成功
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index:9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 59px);
  }
</style>
