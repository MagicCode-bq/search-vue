<template>
    <div class="manage-div">
      <!--标题-->
      <div class="heardTitle">
          <div class="flush">
            <el-button type="primary"  @click="initTable(pageIndex,10)" size="mini" icon="el-icon-refresh" circle></el-button>
          </div>
          <div class="buttons">
            <el-button type="danger" size="mini" round>删除索引库</el-button>
            <el-button type="warning" size="mini" round>重构索引库</el-button>
          </div>
      </div>
      <!--表单-->
      <div class="content">
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
        <div class="operation">
          内容
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
        }
      }
    },
    created() {
      this.initTable();
      this.getCategory();
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
      }
    }
  }
</script>

<style scoped>
  .manage-div{
     width: 100%;
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
  }
  .table-div{
    width: 500px;
    flex: 3;
    text-align: center;
  }
  .operation{
    flex: 1;
    background-color: #009999;
    width: 200px;
  }
  el-table-column{
    height: 50px;
  }

</style>