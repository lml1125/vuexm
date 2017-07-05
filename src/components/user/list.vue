<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="filters">
            <el-form-item>
              <el-input v-model="filters.name" placeholder="姓名" style="min-width: 240px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getUser">查询</el-button>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="addUser">增加用户</el-button>
          </el-form-item>
          </el-form>
        </el-col>

      <!--列表-->
      <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
        <!--<el-table-column type="index"  width="60">
        </el-table-column>-->
        <el-table-column prop="num" label="编号" width="80">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120" sortable>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="100" sortable>
        </el-table-column>
        <el-table-column prop="birth" label="生日" width="120" sortable>
        </el-table-column>
        <el-table-column prop="addr" label="地址" min-width="180" sortable>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="deleteData(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-col>
    
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>
  
    
    <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input v-model="editForm.sex" auto-complete="off" :formatter="formatSex"></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="sex">
            <el-input v-model="editForm.age" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
          </el-form-item>
          <el-form-item label="地址" prop="addr">
            <el-input type="trext" v-model="editForm.addr"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
      </el-dialog>
      
      
      <!--新增界面-->
      <el-dialog title="新增用户" v-model="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input v-model="addForm.sex" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model="addForm.age" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
          </el-form-item>
          <el-form-item label="地址" prop="addr">
            <el-input type="text" v-model="addForm.addr"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
    
    
    
  </el-row>
</template>

<script>
  import util from '../../common/util'
  import {reqEditUser,reqGetUserList,reqGetUseradduser} from '../../api/api';
  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        loading: false,
        users: [
        ],
        total: 0,
        page: 1,//分页
        
        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            {required: true, message: '请输入名字', trigger: 'blur'}
          ]
        },
        editForm: {
          id: 0,
          num:'',
          name: '',
          sex: '',
          age: '',
          addr: '',
          birth:''
        },
        
        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            {required: true, message: '请输入书名', trigger: 'blur'}
          ]
        },
        addForm: {
          name: '',
          sex: '',
          age: '',
          addr: '',
          birth:''
        }
        
        
      }
    },
    methods: {
    	handleCurrentChange(val) {
        this.page = val;
        this.getUser();
      },
      //性别显示转换
      formatSex: function (row, column) {
        return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
      },
      //获取用户列表
      getUser: function () {
        let para = {
        	page: this.page,
          name: this.filters.name
        };
        this.loading = true;
        //NProgress.start();
        reqGetUserList(para).then((res) => {
        	this.total = res.data.total;
          this.users = res.data.users;
          console.log(this.users);
          this.loading = false;
          //NProgress.done();
        });
      },
      //显示编辑界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.editForm);
              para.publishAt = (!para.publishAt || para.publishAt == '') ? '' : util.formatDate.format(new Date(para.publishAt), 'yyyy-MM-dd');
              console.log(para);
              reqEditUser(para).then((res) => {
              	alert(1111);
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getUser();
              });
            });
          }
        });
      },
      //删除
      deleteData:function(index,row){
      	this.$confirm(`确认删除选中姓名为 ${row.name} 的记录吗？`, '提示', {
          type: 'warning'
        }).then(() => {
            this.users = this.users.filter((item)=>{
      		    return item.name!=row.name
           	})
          });
      	
      },
      addUser: function () {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          sex: '',
          age: '',
          addr: '',
          birth:''
        };
      },
      //新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            para.publishAt = (!para.publishAt || para.publishAt == '') ? '' : util.formatDate.format(new Date(para.publishAt), 'yyyy-MM-dd');
            reqGetUseradduser(para).then((res) => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.$refs['addForm'].resetFields();
              this.addFormVisible = false;
              this.getUser();
            });
          }
        });
      },
    },
    mounted() {
      this.getUser();
    }
  }
</script>

<style scoped>

</style>
