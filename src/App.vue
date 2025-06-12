<template>
  <div id="app">
    <nav>
      <router-link to="/">主页</router-link> |
      <router-link to="/products">商品管理</router-link> |
      <router-link to="/customers">客户管理</router-link> |
      <router-link to="/orders">订单管理</router-link>|
      <router-link to="/deliveries">配送管理</router-link>
  
    </nav>
    <router-view/>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app {
  padding: 20px;
}


nav {
  padding: 10px 0 30px 0;
  text-align: center;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  margin: 0 15px;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: #42b983;
  text-decoration: underline;
}
</style>
