<template>
  <div id="app">
    <el-container>
      <el-header class="el-header">诗词检索服务</el-header>
      <el-container>
        <el-aside class="el-aside" width="150px">
          <el-button type="primary" @click="clickRouter('/manage')"  plain round>搜索管理</el-button>
          <el-button type="success" @click="clickRouter('/search')"  plain round>搜索服务</el-button>
        </el-aside>
        <el-main  class="el-main">
         <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script >


export default {
  name: 'App',
  data(){
    return{

    }
  },
  methods:{
    clickRouter(param){
     this.$router.push(param)
    }
  }
}
</script>

<style scoped>
  @import "assets/css/base.css";

  .el-header {
    background-color: #009999;
    color: #ffffff;
    text-align: center;
    line-height: 60px;
    font-weight: 800;
    letter-spacing:5px;
    font-size: 20px;
    font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif
  }

  .el-aside {
    background-color: #66CCCC;
    color: #333;
    text-align: center;
    line-height: 200px;
    width: 100%;
  }

  .el-main {
    color: #333;
    padding: 0;
  }
</style>
