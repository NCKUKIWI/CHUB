<template>
  <div id="app">
    <div class="ui secondary pointing menu">
      <router-link :to="{path: '/'}" exact class="item" id="logo">
        <img style="width:50px;" src="./assets/images/logo.jpg">
      </router-link>
      <router-link :to="{path: '/about'}" class="item">
        About
      </router-link>
      <router-link :to="{path: '/people'}" class="item">
        People
      </router-link>
      <router-link :to="{path: '/group'}" class="item">
        Group
      </router-link>
      <router-link :to="{path: '/project'}" class="item">
        Project
      </router-link>
      <router-link :to="{path: '/activity'}" class="item">
        Activity
      </router-link>
      <router-link :to="{path: '/space'}" class="item">
        Space
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<!-- script -->
<script>
import './Semantic/semantic.min.js'

export default {
  name: 'app'
}
</script>



<!-- style -->

<style>@import "./Semantic/semantic.css";</style>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#logo{
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}
</style>

<style>
  .head h1{
    font-size: 80px;
  }
  .head{
    text-align: left;
    margin-left: 10%;
  }
  .head h2{
    margin-right: 50%;
  }
  .results{
    margin-top: 30px;
    margin-left: 10%;
    margin-right: 10%;
  }
  .results p{
    font-size: 50px;
    margin-bottom: 10px;
  }
</style>
