<template>
    <div  v-loading="loadingStart"
          :element-loading-text="loadtext"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
            class="manage-div">
      <!--标题-->
      <div class="heardTitle">
          <div class="flush">
            <el-button type="primary"  @click="initTable(pageIndex,10)" size="mini" icon="el-icon-refresh" circle></el-button>
          </div>
          <div class="buttons">
            <el-button type="danger"  @click="deleteIndex" size="mini" round>删除索引库</el-button>
            <el-button type="warning" @click="createIndex"   size="mini" round>重构索引库</el-button>
          </div>
      </div>
      <div class="content">
        <!--表单-->
        <div class="table-div">
          <el-table
                  :data="tableData"
                  style="width: 100%"
                  height="500">
            <el-table-column
                    fixed="left"
                    prop="name"
                    label="诗词名称"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="author"
                    label="作者"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="类型"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="origin"
                    label="来源"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="内容"
                    width="600">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="120">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
                <el-button type="text" @click="addPoem"  size="small">添加</el-button>
                <el-button type="text"  @click="deletePoem(scope.row.id)" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--翻页-->
          <el-pagination
                  background
                  layout="prev, pager, next"
                  @current-change="pageNum"
                  :total="page.total">
          </el-pagination>
        </div>
        <!--热词、远程词典-->
        <div class="operation">
          <div  class="hotWord">
            <h3>热词：搜索次数大于6次的搜索词显示</h3>
            <el-tag type="danger" class="elTag" v-for="item in hotWord">{{item}}</el-tag>
          </div>
          <div class="dictionaries">
            <h3>ES远程词典内容</h3>
            <dic class="dic-input">
              <el-input v-model="dicContent"  style="width: 200px"/>
              <el-button type="primary"  @click="insertDic" style="margin-left: 10px" size="small">添加词汇</el-button>
            </dic>
            <el-tag class="dic-tab"
                    v-for="tag in Dic"
                    :key="tag"
                    closable>
              {{tag}}
            </el-tag>
          </div>
        </div>
      </div>
      <!--弹窗-->
      <div>
        <el-dialog
                title="诗词详情"
                :visible="dialogVisible"
                :show-close="false"
                width="40%">
          <div>
            <el-form label-position="left" label-width="100px" :model="copyPoem">
              <el-form-item label="名称">
                <el-input v-model="copyPoem.name"></el-input>
              </el-form-item>
              <el-form-item label="作者">
                <el-input v-model="copyPoem.author"></el-input>
              </el-form-item>
              <el-form-item label="类别">
                <el-select v-model="copyPoem.categoryid" placeholder="类别">
                  <el-option v-for="item in Category" :label="item.name"  :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="外链">
                <el-input v-model="copyPoem.href" ></el-input>
              </el-form-item>
              <el-form-item label="来源">
                <el-input v-model="copyPoem.origin" ></el-input>
              </el-form-item>
              <el-form-item label="诗词内容">
                <el-input type="textarea" size="medium" v-model="copyPoem.content"></el-input>
              </el-form-item>
              <el-form-item label="作者生平">
                <el-input type="textarea" size="400" v-model="copyPoem.authordes"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
          <el-button   @click="updatePoem('close')">取 消</el-button>
          <el-button type="primary" @click="updatePoem">保存</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import {requestTableData,requestCategory,savePoem,deletePoemById} from 'network/manage'
  import {createIndex,deleteIndex,getHotWord} from 'network/esearch'
  import {getDic,addDic,deleteDic} from 'network/dic'

  export default {
    name: "manage",
    data() {
      return {
        tableData: [],
        dialogVisible: false,
        poem: {},
        copyPoem: {},
        Category: [],
        pageIndex:0,
        page:{
           total:0,//总条数
           pages:0,//总页数
          isFirstPage:'',
          isLastPage:'',
        },
        loadingStart:false,
        loadtext:'',
        hotWord:[],
        Dic:[],  //词典
        dicContent:""
      }
    },
    created() {
      this.initTable();
      this.getCategory();
      this.requestHotWord();
      this.requestDic()
    },
    methods: {
      initTable(num=1,size=10) {
        requestTableData(num,size).then(res => {
          //获取数组
          this.tableData = res.list
          this.page.total =res.total
          this.page.pages=res.pages
          this.$message.success("加载数据成功")
        })
      },
      getCategory() {
        requestCategory().then(res => {
          this.Category = res
        })
      },
      handleClick(prams) {
        this.dialogVisible = true
        this.poem = prams;
        this.copyPoem = Object.assign({}, this.poem);
      },
      updatePoem(prams) {
        if (prams == 'close') {
          this.copyPoem = this.poem
        }else{
          savePoem(this.copyPoem).then(res=>{
            if("成功"==res){
                this.initTable()
                this.$message.success("添加修改"+res);
            }else{
              this.$message.error("添加修改"+res);
            }          })
        }
        this.dialogVisible = false
      },
      addPoem(){
        this.dialogVisible=true;
        this.copyPoem={}
      },
      deletePoem(id){
        this.$confirm('此操作将永久删除该诗词, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePoemById(id).then(res=>{
            this.initTable()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      pageNum(num){
        this.pageIndex=num;
       this.initTable(num,10)
      },
      deleteIndex(){
        this.$confirm('此操作将永久清空索引库, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loadingStart=true
          this.loadtext='清除索引库中，请稍等'
          deleteIndex().then(res=>{
            this.$message.success(res)
            this.loadingStart=false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      createIndex(){
        this.$confirm('此操作将重构索引库, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loadingStart=true
          this.loadtext='重构索引库中，请稍等'
          createIndex().then(res=>{
            this.$message.success(res)
            this.loadingStart=false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重构'
          });
        });
      },
      requestHotWord(){
        getHotWord().then(res=>{
          this.hotWord=res;
        })
      },
      requestDic(){
         getDic().then(res=>{
           this.Dic=res;
         })
      },
      insertDic(){
        let tent= this.dicContent;
         addDic(tent).then(res=>{
           console.log(res)
         })
      }
    }
  }
</script>

<style scoped>

  .loadClass{
    disabled:true
  }
  .manage-div{
     width: 100%;
    height: 600px;
  }
  .heardTitle{
     line-height: 40px;
     height: 40px;
     width: 100%;
     background-color: #FFCC99;
     display: flex;
     justify-content: flex-end
  }
  .flush{
    flex: 1;
    padding-left: 100px;
  }
  .buttons{
    flex: 1;
  }

  .content{
    width: 100%;
    display: flex;
    height: 600px;
  }
  .table-div{
    width: 500px;
    flex: 3;
    text-align: center;
  }
  el-table-column{
    height: 50px;
  }
  .operation{
    flex: 1;
    width: 200px;
  }
  .hotWord{
    width: 100%;
    height: 300px;
    background-color: #ff8198;
  }
  .dictionaries{
    width: 100%;
    height: 300px;
    background-color:skyblue;
  }
  .elTag{
    margin: 10px;
  }
  .dic-input{
    display: flex;
  }
  .dic-tab{
   margin: 5px;
  }



</style>