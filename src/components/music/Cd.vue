<template>
  <div id="singer">
  <div class="sinleft">
   <div class="singer-photo">
      <img alt="cdlogo" :src="headerData.logo">
    </div>
    <div id="singer-header" class="header border-1px border-1px-after" v-if="headerData!=null">
      <div class="header-blank"></div>
      <div class="header-warp">
        <div class="singer-info">
          <h1 class="singer-name">{{headerData.dissname}}</h1>
          <p class="singer-fans">{{headerData.visitnum}}播放 来自：{{headerData.nick}}</p>
        </div>
        <div class="play-button" @click="play(0)">
          <img src="../../assets/icon-play.png">
        </div>
      </div>
    </div>
  </div>	  
    
    
    <div class="list" v-if="headerData!=null">
      <ul>
        <li class="border-1px border-1px-after" v-for="(item,index) in headerData.songlist">
          <div class="music-info" @click="play(index)">
            <div class="music-name">
              {{item.name}}
            </div>
            <div class="music-singer">
              <span v-for="singername in item.singer">{{singername.name}}-</span>
              <span>{{item.subtitle}}</span>
            </div>
          </div>
          <div class="action-button" @touchend.prevent="showMenu(index)" @click="showMenu(index)">
            <button type="button" class="el-button el-button--danger el-button--lagre"><span>播放</span></button>
          </div>
        </li>
      </ul>
      <div class="list-title">
        <p>简介</p>
      </div>
      <div class="singer-brief">
        <p>{{headerData.desc}}</p>
      </div>
    </div>

    
    
    
  </div>
</template>

<script>
	export default{
		props:['num'],
    data(){
      return {
        number:this.num,
        headerData:''
      }
    },
    created(){
    	this.getData();
    },
    methods:{
       getData(){
       	this.$store.dispatch('getCdList', '2967860608').then((response) => {
           this.headerData = response.body.cdlist[0]
           console.log(this.headerData)
         })
       },
       play: function (index) {
        let list = []
        this.headerData.songlist.forEach(item => {
          list.push({
            id: item.id,
            mid: item.mid,
            name: item.name,
            singer: item.singer
          })
        })
        this.$store.commit('setPlayList', {
          index: index,
          list: list
        })
        this.$store.commit('play')
      },
       showMenu: function (num) {
        this.menuedIndex = num
        let that = this
        this.$store.dispatch('notifyActionSheet', {
          menus: {
            'title.noop': this.headerData.songlist[num].name + '<br/><span style="color:#666;font-size:12px;">' + this.getSingerStr(this.headerData.songlist[num].singer) + '</span>',
            playAsNext: '下一首播放',
            addToPlayList: '添加到播放列表'
          },
          handler: {
            ['cancel'](){
            },
            ['playAsNext'](){
              that.$store.commit('addToPlayListAsNextPlay', {
                id: that.headerData.songlist[that.menuedIndex].id,
                mid: that.headerData.songlist[that.menuedIndex].mid,
                name: that.headerData.songlist[that.menuedIndex].name,
                singer: that.headerData.songlist[that.menuedIndex].singer
              })
            },
            ['addToPlayList'](){
              that.$store.commit('addToPlayList', {
                id: that.headerData.songlist[that.menuedIndex].id,
                mid: that.headerData.songlist[that.menuedIndex].mid,
                name: that.headerData.songlist[that.menuedIndex].name,
                singer: that.headerData.songlist[that.menuedIndex].singer
              })
            }
          }
        })
      },
      getSingerStr: val => {
        if (typeof val === 'string') {
          return val
        } else if (val instanceof Array) {
          let singer = ''
          val.forEach(item => {
            singer = singer + item.name + ' '
          })
          return singer
        }
      }
    }
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  * {
    margin: 0;
    padding: 0;
  }

  .tab-swiper {
    background-color: #fff;
    height: 100px;
  }

  /*border-1px 部分*/
  .border-1px {
    position: relative;
  }

  .border-1px-after:after {
    border-top: 1px solid rgba(255, 255, 255, .15);
    content: ' ';
    display: block;
    width: 100%;
    position: absolute;
    left: 0;
  }

  .border-1px-before:before {
    border-top: 1px solid rgba(255, 255, 255, .15);
    content: ' ';
    display: block;
    width: 100%;
    position: absolute;
    left: 0;
  }

  .border-1px:before {
    top: 0;
  }

  .border-1px:after {
    bottom: 0;
  }

  @media (-webkit-min-device-pixel-ratio: 1.5), (min-device-pixel-ratio: 1.5) {
    .border-1px:after, .border-1px:before {
      -webkit-transform: scaleY(.7);
      -webkit-transform-origin: 0 0;
      transform: scaleY(.7);
    }

    .border-1px:after {
      -webkit-transform-origin: left bottom;
    }
  }

  @media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
    .border-1px:after, .border-1px:before {
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
    }
  }

  #singer {
    display: flex;
    width: 100%;
    min-height: 100%;
    overflow-x: hidden;
    position: absolute;
    top: 0;
    background: #fff;
    z-index: 2;
    padding-top:10px;
  }

  .singer-photo {
    position: fixed;
    width: 100%;
    padding-right:20px;
    height: 100vw;
  }

  .singer-photo img {
    width: 100%;
    max-width: 68vh;
    height: 100vw;
    max-height: 68vh;
  }
.singer-name{
	color:#fff;
	font-size:20px;
}
.singer-fans{
	font-size:14px;
	color:#fff
}
  .header-bar {
    position: fixed;
    top: 0;
    height: 50px;
    width: 100%;
    max-width: 68vh;
    z-index: 2;
  }

  .header-bar .back-button {
    /*    width:25px;*/
    height: 25px;
    margin: 12.5px;
    margin-left: 5px;
    float: left;
    cursor: pointer;
  }

  .header-bar .back-button .back-icon {
    width: 25px;
    height: 25px;
    float: left;
  }

  .header-bar .back-button .back-icon img {
    width: 25px;
  }

  .header-bar .back-button .back-text {
    line-height: 25px;
    float: left;
  }

  .header {
    width: 100%;
    max-width: 68vh;
    height: 100vw;
    max-height: 68vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .header-blank {
    display: flex;
    flex-grow: 1;
  }

  .header-warp {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    /*background: -webkit-linear-gradient(top, rgba(255, 255, 255, 0), rgb(135, 112, 101));*/
  }

  .header-warp .play-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid #eee;
    background: rgba(255, 255, 255, 0.43);
  }

  .header-warp .play-button img {
    display: inline-block;
    width: 25px;
    height: 25px;
  }

  .list {
    /*background: rgb(135, 112, 101);*/
    z-index: 1;
    width:50%;
    height:500px;
    padding-left:50px;
    overflow-y:auto;
    padding-bottom: 50px;
  }

  .list .list-title {
    text-align: center;
    line-height: 40px;
  }

  .list ul {
    list-style: none;
    padding-left: 10px;
  }

  .list ul li {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    cursor: pointer;
  }

  .list ul li .music-info {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
  }

  .list ul li .music-info .music-name {
    width: 100%;
    color: #000;
    line-height: 22px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .dark {
    color: #fff !important;
  }

  .list ul li .music-info .music-singer {
    color: #aaa;
    font-size: 14px;
    line-height: 22px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .list ul li .action-button {
    width: 25px;
    height: 25px;
    margin-right: 10px;
  }

  .list ul li .action-button img {
    width: 25px;
    height: 25px;
  }

  .list .singer-brief {
    font-size: 14px;
    padding: 10px;
  }
</style>
