<template>
  <div class="detail">
    <!-- 详情页面 -->
    <!-- 标题 -->
    <van-nav-bar title="文章详情" fixed />
    <!-- 文章标题 -->
    <van-cell title-class="d-title" :title="detailObj.title" />
    <!-- 作者区域 -->
    <van-cell>
      <template slot="title">
        <div class="author">
          <div class="a-img">
            <img :src="detailObj.aut_photo" alt="">
          </div>
          <div class="a-name">
            <div class="name">{{ detailObj.aut_name }}</div>
            <div class="name">{{ detailObj.pubdate | relativetime }}</div>
          </div>
          <div>
            <van-button @click="follow" type="info" size="small" round>
              <van-icon name="plus" v-if="!detailObj.is_followed" />
              {{ detailObj.is_followed ? '取消关注' : '关注' }}
            </van-button>
          </div>
        </div>
      </template>
    </van-cell>
    <!-- 内容区域 -->
    <van-cell>
      <template slot="title">
        <div v-html="detailObj.content"></div>
      </template>
    </van-cell>
    <!-- 点赞&不喜欢 -->
    <div class="d-btn">
      <van-button class="d-btn1" :type="detailObj.attitude === 1 ? 'danger': 'default'" plain><van-icon name="like-o" />点赞</van-button>
      <van-button class="d-btn1" :type="detailObj.attitude === 0 ? 'danger': 'default'" plain><van-icon name="like-o" />不喜欢</van-button>
    </div>
    <!-- 留言 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div v-for="(item, index) in commentList" :key="index">
        <comment :isa="true" v-model="show" :itemobj="item" />
      </div>
    </van-list>
    <!-- 留言输入框:需求当前文章的id 我们将整个文章详情传入 -->
    <addComment :detailObj="detailObj" :isa="true" :commentList="commentList" />
    <!-- 回复留言的面板 -->
    <repaly :artid="artid" v-model="show" />
  </div>
</template>

<script>
// 导入 取关的 接口
import { apiUnFollow, apiFollow } from '@/api/user'
// 导入 得到评论的 接口
import { apiGetPageComment } from '@/api/commnet'
// 导入留言回复
import repaly from '@/components/repaly'
// 导入留言
import comment from '@/components/comment'
// 导入留言输入框
import addComment from '@/components/addcomment'
// 导入请求文章数据的接口
import { apiGetArticlList } from '@/api/article'
export default {
  data () {
    return {
      // 文章的 id
      artid: '',
      // 文章详情对象
      detailObj: {},
      // 文章的评论列表数组:
      commentList: [],
      // list 的加载状态
      loading: false,
      // list 是否完结
      finished: false,
      // 文章的偏移量
      offset: '',
      // 每页的条数
      limit: 10,
      // 结束的 id
      endid: '',
      // 控制面板是否显示
      show: false
    }
  },
  methods: {
    // 得到文章详情
    async getArtieDetail () {
      let res = await apiGetArticlList(this.$http, this.artid)
      this.detailObj = res
    },
    // 关注 & 取消关注
    async follow () {
      // 得到当前作者的关注状态
      let isFollow = this.detailObj.is_followed
      if (isFollow) {
        // 已经关注
        await apiUnFollow(this.$http, this.detailObj.aut_id)
        // 将数据源中关注状态改为没有关注
        this.detailObj.is_followed = false
      } else {
        // 未关注
        await apiFollow(this.$http, this.detailObj.aut_id)
        // 将数据源中关注状态改为已经关注
        this.detailObj.is_followed = true
      }
    },
    // 加载 List 时会执行
    async onLoad () {
      // 请求数据源 commentList
      let res = await apiGetPageComment(this.$http, {
        source: this.artid,
        offset: this.offset || undefined,
        limit: this.limit
      })
      // 保存数据
      // 评论数据源
      this.commentList = [...this.commentList, ...res.results]
      // 保存结束 id
      this.endid = res.end_id
      // 保存偏移量
      this.offset = res.last_id
      if (this.offset === this.endid) {
        this.finished = true
      }
      // 重新加载状态
      this.loading = false
    }
  },
  created () {
    // 得到文章 id
    this.artid = this.$route.params.artid
    // 得到文章详情
    this.getArtieDetail()
  },
  components: {
    comment,
    addComment,
    repaly
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar.van-hairline--bottom {
  background: #3296fa;
  .van-nav-bar__title.van-ellipsis {
    color: #fff;
  }
}

.detail {
  margin-top: 46px;
  margin-bottom: 80px;
  .d-title {
    font-size: 20px;
    font-weight: 700;
    line-height: 30px;
  }
  .author {
    display: flex;
    align-items: center;
    .a-img {
      img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
    .a-name {
      flex: 1;
    }
  }
  .d-btn {
    text-align: center;
    .d-btn1 {
      margin: 0 10px;
      border-radius: 44px;
    }
  }
}
</style>
