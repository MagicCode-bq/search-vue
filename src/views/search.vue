<template>
     <div class="searchDiv">
          <div class="searchInput">
            <div class="inputItem">
              <el-input v-model="searchTent.searchText" placeholder="赶快搜点什么吧,点击搜索才去搜索内容哦"/>
              <el-button  style="margin-left: 5px"  @click="searchContent"  type="primary" >搜索</el-button>
            </div>
            <div class="FilterConditions">
              <div class="poemType">
                诗词类型:
                <span v-for="(item,index) in poemType" @click="clickType(index,item)"  :class="{typeClass:index==ActiveIndex}">{{item}}</span>
               </div>
               <div class="poemAuthor">
                作者选择：
                 <span v-for="(item,index) in poemAuthors" @click="clickAuthor(index,item)" :class="{typeClass:index==activeAuthorIndex}">{{item.author}}</span>
               </div>
            </div>
          </div>
          <div class="searchContent">
            <el-row :gutter="20">
              <el-col class="col" :span="6" v-for="item in poems">
                <el-card shadow="hover">
                   <h4 class="card-h4"  @click="clickCard(item)"  v-html="item.name"></h4>
                  <span class="card-author" v-html="item.author"></span>
                   <span class="card-type">类别:{{item.type}}</span>
                 </el-card>
              </el-col>
            </el-row>
          </div>
          <el-drawer
               :title="poem.name"
               :visible.sync="drawer"
               :direction="direction">
         <div class="drawer-content">
           <h4>作者名称:</h4>
          <p v-html="poem.author"/>
           <h4>作者生平:</h4>
          <p v-html="poem.authordes"/>
           <h4>诗词分类:</h4>
          <p v-html="poem.type"></p>
           <h4>诗词内容:</h4>
          <p v-html="poem.content"></p>
         </div>
         </el-drawer>
     </div>
</template>

<script>
  import {questAuthor,search} from 'network/esearch'

  export default {
    name: "search",
    data(){
      return{
        poemType:["所有","唐诗","宋词"],
        poemAuthors:[{author:"所有"}],
        ActiveIndex:0,
        activeAuthorIndex:0,
        searchTent:{
          searchText:'',
          searchType:'所有',
          searchAuthor:'所有'
        },
        poems:[],
        poem:{},
        drawer:false,
        direction: 'rtl'
      }
    },
    created() {
     this.queryAuthorSize();
     this.searchContent();
      },
    methods:{
      clickType(index,item){
        this.ActiveIndex=index;
        this.searchTent.searchType=item;
      },
      clickAuthor(index,item){
        this.activeAuthorIndex=index;
        this.searchTent.searchAuthor=item.author;
      },
      queryAuthorSize(){
        questAuthor().then(res=>{
          this.poemAuthors.push(...res);
        })
      },
      searchContent(){
        search(this.searchTent).then(res=>{
          this.poems=[]
         this.poems.push(...res)
        })
      },
      clickCard(poem){
        this.drawer=true
       this.poem=poem;
      }
    }
  }
</script>

<style scoped>
  .searchDiv{
      height: 600px;
  }
  .searchInput{
    width: 100%;
    height: 200px;
  }
  .inputItem{
    width: 800px;
    margin: 0 auto;
    padding-top: 35px;
    display: flex;
  }
  .FilterConditions{
    width: 800px;
    margin: 0 auto;
    padding-top: 35px;
  }

  .poemType{
    margin: 20px 0px;
  }
  .poemType>span{
     margin-left: 10px;
     cursor:pointer;
     padding: 5px;
  }
  .poemAuthor>span{
    margin-right: 10px;
    cursor:pointer;
    padding: 5px;
  }

  .searchContent{
       width: 100%;
       height: 600px;
       padding: 10px 60px;
  }
  .col{
    margin-bottom: 10px;
  }
  .card-h4{
    margin-bottom: 10px;
    cursor:pointer;
  }
  .card-type{
   margin-left: 100px;
  }
  .card-author{

  }
  .drawer-content>h4{
    margin: 10px 0px;
  }


  .typeClass{
     color: white;
     background-color: #ff8198;
  }

</style>