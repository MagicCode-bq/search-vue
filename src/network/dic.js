import request from './request'


//获取词典内容
export  function getDic() {
      return  request({
        url:"/search/dic"
      })
}

//添加词典内容
export  function addDic(word) {
    return request({
      url:"/search/dic/add",
      data:{
        word
      }
    })
}

//删除词典内容
export  function deleteDic(word) {
  return request({
    url:"/search/dic/delete",
    data:{
      word
    }
  })
}