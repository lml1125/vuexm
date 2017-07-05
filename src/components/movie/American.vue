<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>电影管理</el-breadcrumb-item>
        <el-breadcrumb-item>北美票房榜</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="电影名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="getmovie">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="newmovie" highlight-current-row v-loading="listLoading"
                style="width: 100%;">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="title" label="电影名" sortable></el-table-column>
        <el-table-column prop="genres" label="类型" width="150" sortable></el-table-column>
        <!--<el-table-column prop="name" label="作者" width="150" sortable></el-table-column>-->
        <el-table-column prop="year" label="上映时间" width="150" sortable></el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">
            <el-button size="small" @click="showSeeDialog(scope.$index,scope.row)">查看</el-button>
            <el-button type="danger" @click="delmovie(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

  


      <el-dialog title="查看" v-model="seeVisible" :close-on-click-modal="false">
        <el-row>
				  <el-col :span="8">
				  	<img :src="seeForm.images.large" class="image">
				  </el-col>
				  <el-col :span="14">
				   <div class="movie_box">
				  	<h3>{{seeForm.title}}</h3>
				  	<p>导演: <span v-for="casts in seeForm.directors">{{casts.name}}</span></p>
				  	<p>主演: <span v-for="casts in seeForm.casts">{{casts.name}}  </span></p>
				  	<P>类型：<span v-for="item in seeForm.genres">{{item}} </span></P>
				  	<p>上映时间：{{seeForm.year}}</p>
				  	<div class="desc">
				  		
				  	</div>
				  	
				  	<div class="rate_box">
				  		<p>评分：</p>
				  		<div class="rate_div"><el-rate
							  v-model="seeForm.rating.average"
							  disabled
							  show-text
							  text-color="#ff9900"
							  text-template="{value}">
							</el-rate></div>
				  	</div>
				  </div>	
				  </el-col>
				</el-row>
        
        
        
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="seeVisible = false">取消</el-button>
          
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>
<script>
  import util from '../../common/util'
  import {reqGetBookListPage, reqDeleteBook, reqEditBook, reqBatchDeleteBook, reqAddBook} from '../../api/api';

  export default{
    data(){
      return {
        filters: {
          name: ''
        },
        total: 0,
        page: 1,
        newmovie: [],
        listLoading:false,//加载
        seeVisible:false,//查看
       
        seeForm: {
          id: 0,
          title: '',
          genres: '',
          name: '',
          images:'',
          rating:{
          	average:''
          }
          
        },
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page = val;
        this.getmovie();
      },
      //获取用户列表
      getmovie() {
        this.$http.jsonp("https://api.douban.com//v2/movie/us_box").then((res)=>{
        	 console.log("电影加载成功");
        	 this.total = res.body.total;
        	 
        	 if(this.filters.name){
        	  	this.newmovie = res.body.subjects;
		      		return this.newmovie = this.newmovie.filter((item)=>{
		      			 return item.title == this.filters.name
		      		})
        	}else{
        		this.newmovie = res.body.subjects;
        	}
        	 
        },(res)=>{
        	console.log("电影加载失败");
        })
      },
      //删除
      delmovie: function (index, row) {
        this.$confirm(`确认删除 ${row.title} 该记录吗?`, '提示', {type: 'warning'}).then(() => {
          this.listLoading = true;
          this.newmovie = this.newmovie.filter((item)=>{
          	this.listLoading = false;
          	this.$message({
              message: '删除成功',
              type: 'success'
            });
		      		 return !row.title
		      })
          
          this.getmovie();
          
        }).catch(() => {
        });
      },
      //显示查看界面
      showSeeDialog: function (index, row) {
        this.seeVisible = true;
        this.seeForm = Object.assign({}, row);
      },
      //编辑
     /* editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.editForm);
              para.publishAt = (!para.publishAt || para.publishAt == '') ? '' : util.formatDate.format(new Date(para.publishAt), 'yyyy-MM-dd');
              reqEditBook(para).then((res) => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getBooks();
              });
            });
          }
        });
      },*/
    },
    mounted() {
      this.getmovie();
    }
  
    
}    
</script>

<style>
  .demo-table-expand label {
    font-weight: bold;
  }
  .movie_box {padding-left:20px;}
  .movie_box p span{
  	color:blue
  }
  .rate_box{
  	overflow:hidden
  }
  .rate_box p{
  	float:left;
  	padding:0;margin:0 10px 0 0
  }
  .rate_div{
  	float:left;
  }
  .el-rate__icon{
  	font-size:16px;
  }
</style>
