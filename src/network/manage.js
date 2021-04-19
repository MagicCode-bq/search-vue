import request from './request'

export function requestTableData(num ,size){
  return request({
     url:"/poem/page",
     params:{
       num:num,
       size:size
     }
  })
}

export function requestCategory() {
   return request({
        url:"/category/all",
        prams:{
        }
      })
}

export function  savePoem(config) {
  return  request({
     url:"/poem/save",
     method:'post',
     data:config
  })
}

export function deletePoemById(config) {

  return request({
    url:"/poem/delete",
    prams:{
      id:config
    }
  })

}