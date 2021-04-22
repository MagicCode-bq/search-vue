import request from './request'


//重构索引库
export  function createIndex() {
    return request({
      url:"/es/build"
    })
}

//清除索引库
export  function deleteIndex() {
  return request({
    url:"/es/clear"
   })
}

//搜索
export  function search(config) {
  return request({
     url:"/search/index",
     params:{
       context:config.searchText,
       type:config.searchType,
       author:config.searchAuthor,
     }
 })
}

//返回诗词数量大于10的作者
export  function questAuthor() {
   return request({
        url:"/search/author"
   })

}

//返回热词
export  function getHotWord() {
     return request({
       url:"/search/hotWord"
     })
}