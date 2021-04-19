import  vue  from 'vue'
import  VueRouter  from 'vue-router'


vue.use(VueRouter)


let  vueRouter = new VueRouter({
    routes:[
        {
        path:"/search",
        name:'search',
        component:()=>import('views/search')
       }, {
        path: "/manage",
        name: 'manage',
        component: () => import('views/manage')
      }
    ]
 });



export  default  vueRouter