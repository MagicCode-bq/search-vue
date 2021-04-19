import axios from "axios";


export  default  function request(config) {

  let  instance = new axios.create({
    baseURL:"http://localhost:8081",
    timeout:5000
  });


  instance.interceptors.response.use(res=>{
     return res.data
  })

  return instance(config)
}




