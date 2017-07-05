<template>
	<div class="music">
<div class="hotlist">
        <div class="list-title">
          <p class="title-text">热门歌单</p>
        </div>
        <div class="list-content">
          <div class="list-item"
               v-for="item in songList"
               @click="comeinfo(item.dissid)">
            <div >
              <img :src="item.imgurl" class="imgtitle">
            </div>
            <div class="list-info">
              <p class="list-name">{{item.dissname}}</p>
              <div class="list-author">{{item.author}}
              
                 <div class="listen-count">
	                <img src="../../assets/icon-erji.svg" alt="">
	                <span>{{item.listennum}}</span>
	              </div>
              </div>
            </div>
          </div>
        </div>
</div>

<v-cd v-show="hashflag" :num='num'></v-cd>

<transition name="bar-slide">
      <div id="play-bar" v-show="!playPageShow">
        <audio id="music"
               :src="dataUrl"
               @timeupdate="updateTime"
               @ended="playContinue"
               autoplay></audio>
        <div class="play-bar-image-container" @touchstart="showPlayPage" @click="showPlayPage">
          <img class="play-bar-image" :src="coverImgUrl">
        </div>
        <p class="play-bar-text" @touchstart="showPlayPage" @click="showPlayPage">{{song.name}}</p>
        <img class="play-bar-button"
             :src="playing?iconPause:iconPlay"
             @touchend="tapButton"
             @click="tapButton">
      </div>
    </transition>



</div>
</template>
<script>
import {types} from '../../config/def'
import cd from './Cd.vue'
import {mapMutations, mapState, mapGetters} from 'vuex'
export default {
 	data(){
 		return{
 			 iconPlay: require('../../assets/icon-play.png'),
             iconPause: require('../../assets/icon-pause.png'),
 			songList:[],
 			hashflag:false,
 			hashurl:'',
 			num:'',
 			playPageShow: false,
            blurBgShow: false,
            rankshow: true,
 		}
 	},
 	components:{
 		'v-cd':cd
 	},
 	created() {
      this.getData();
  },
  methods:{
  	getData(){
  		 this.$store.dispatch('getRecommands').then((response) => {
  		 	console.log('加载成功');
  		 	console.log(response);
        this.songList = response.body.data.hotdiss.list
      }, (responce) => {
        this.loadingState = '加载失败'
      })
  	},
  	comeinfo(id){
  		this.hashflag = true;
  		this.num = id;
  		
  		//window.location.hash = this.$route.path+'/'+id
  	},
  	tapButton(event) {
        event.preventDefault()
        this.playing ? this.pause() : this.play()
      },
      showPlayPage(event) {
        event.preventDefault()
        this.playPageShow = true
      },
      hidePlayPage(event) {
        event.preventDefault()
        this.playPageShow = false
      },
      showBlurBg() {
        this.routerViewAnimation = 'fade'
        this.blurBgShow = true
      },
      hideBlurBg () {
        this.blurBgShow = false
      },
      updateTime() {
        this.$store.commit('updateCurrentTime', parseInt(document.getElementById('music').currentTime))
        this.$store.commit('updateDuration', parseInt(document.getElementById('music').duration))
      },
      ...mapMutations([
        'play', 'pause', 'playContinue'
      ])
  },
  computed: {
      ...mapGetters([
        'coverImgUrl'
      ]),
      ...mapState({
        dataUrl (state) {
          return 'http://ws.stream.qqmusic.qq.com/' + state.PlayService.song.id + '.m4a?fromtag=46'
        },
        playing: state => state.PlayService.playing,
        song: state => state.PlayService.song
      })
    },
    watch: {
      playing(val) {
        if (val) {
          document.getElementById('music').play()
        } else {
          document.getElementById('music').pause()
        }
      },
      song(song) {
        if (this.$store.state.PlayService.playList.length > 0 && typeof song.albummid === 'undefined') {
          this.$http.jsonp('http://120.27.93.97/weappserver/get_music_info.php', {
            params: {
              mid: song.mid
            },
            jsonp: 'callback'
          }).then((response) => {
            this.$store.commit('setAlbummid', response.data.albummid)
          })
        }
      }
    }
  
}
</script>

<style>
 .hotlist {
        display: flex;
        flex-direction: column;
        background: #fff;
        margin-top: 10px;
        box-shadow: 0 0 10px #DDD;
}
.list-title {
          height: 50px;
          text-align: center;
          line-height: 50px;
}
.list-content {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
       }   
          .list-item {
            width: 28%;
            height:200px;
            margin:10px 2%;
            overflow:hidden;
            cursor: pointer;
            position:relative
            }
            .list-img {
              position: relative;
              }
             .list-img  img {
                width: 100%;
              }
              .listen-count {
                position: absolute;
                bottom: 5px;
                right: 16px;
                color: #fff;
                font-size: 12px;
                display: flex;
                flex-direction: row;
                align-items: center;
                }
                
                .listen-count img {
                  width: 15px;
                  height: 15px;
                  display: inline-block;
                  margin-right: 3px;
                }
.listen-count img.imgtitle{
                	width:100%;
                	height:100%
                }
            .list-info {
              padding: 0 5px;
              font-weight: 300;
              font-size: 14px;
              position:absolute;
              bottom:0;left:O;width:100%;
              background: rgba(0,0,0,.7);
              color:#fff;
              }
               .list-info p{
               	padding:0;
                margin-top:5px;
                margin-bottom:5px
               }
              .list-name {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
              .list-author {
                color: #fff
              }
#play-bar {
    position: fixed;
    bottom: 0;
    width: 80%;
    height: 50px;
    background:#fff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-top:1px solid #efefef;
    z-index: 2;
  }

  .play-bar-image-container {
    width: 37.5px;
    height: 37.5px;
    padding-left: 15px;
    cursor: pointer;
  }

  .play-bar-image {
    width: 37.5px;
    height: 37.5px;
    border-radius: 5px;
    display: inline-block;
  }

  .play-bar-text {
    flex-grow: 1;
    padding-left: 10px;
    cursor: pointer;
  }

  .play-bar-button {
    width: 20px;
    height: 20px;
    padding-right: 15px;
    cursor: pointer;
  }

  .page-slide-enter-active {
    transition: all .3s ease;
  }

  .page-slide-leave-active {
    transition: all .3s ease-out;
  }

  .page-slide-enter, .page-slide-leave-active {
    transform: translateX(100%);
  }

  .fade-enter-active {
    transition: all .3s ease;
  }

  .fade-leave-active {
    transition: all .3s ease-out;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
  }

  .play-slide-enter-active {
    transition: all .3s ease;
  }

  .play-slide-leave-active {
    transition: all .3s ease-out;
  }

  .play-slide-enter, .play-slide-leave-active {
    transform: translateY(100vh);
  }

  .bar-slide-enter-active {
    transition: all .3s ease;
  }

  .bar-slide-leave-active {
    transition: all .3s ease-out;
  }

  .bar-slide-enter, .bar-slide-leave-active {
    margin-bottom: -50px;
  }


</style>
