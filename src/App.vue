<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.form-items {
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  margin: 10px;
}

.submit-button {
  background-color: #4caf50; /* Green */
  border-radius: 12px;
  border: thin solid darkslategrey;
  color: white;
  padding: 8px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
}
.submit-button:hover {
  cursor: pointer;
}
</style>
