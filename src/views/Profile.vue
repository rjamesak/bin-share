<template>
  <div class="profile">
    <h1>Profile Page</h1>
    <p>{{ this.user }}</p>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Profile",
  components: {},
  props: {
    user: {
      type: Object,
      default: function () {
        return { user: "none" };
      },
    },
  },
};
</script>
