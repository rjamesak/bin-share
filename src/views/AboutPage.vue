<template>
  <div class="about">
    <navbar />
    <h1>About Bin Share</h1>
    <p>
      Bin Share is a trash sharing application that allows you to share your
      trash bin with neighbors.
    </p>
    <p>
      Why should I use bin space? Several reasons! You may save money on your
      trash bill. You might help others save money on their trash bill. You
      might keep your neighborhood streets a little cleaner.
    </p>
    <p>
      What’s the cost of using Bin Space? Nothing! It’s free and simple to use.
      But we’ve provided some instructions in case you need a little help.
    </p>
    <ol>
      How to use Bin Share:
      <li>
        <router-link :to="{ name: 'Signup' }">Sign up</router-link>
      </li>
      <li>
        Look for available bins on the map. They are marked with the
        <img
          class="trash-can-image"
          src="https://raw.githubusercontent.com/rjamesak/assets/master/trash-can.svg"
          alt=""
        />
        marker.
      </li>
      <li>
        Don't worry about sharing your bin, you can stop sharing it at any time!
      </li>
    </ol>
    <ol>
      How to share your bin:
      <li>
        Provide your address in the
        <router-link :to="{ name: 'Profile' }">user profile</router-link>
        section.
      </li>
      <li>
        Head to the
        <router-link :to="{ name: 'Map' }">Map</router-link>
        and click the 'Share My Bin' button.
      </li>
    </ol>
    <ol>
      How to stop sharing your bin:
      <li>
        Go to the
        <router-link :to="{ name: 'Map' }">Map</router-link>
        and click the 'Stop Sharing My Bin' button.
      </li>
    </ol>
  </div>
</template>

<script>
import navbar from "@/components/navbar.vue";
export default {
  components: {
    navbar,
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: auto;
  max-width: 320px;
  padding-top: 24px;
}
ol {
  display: flex;
  flex-direction: column;
  max-width: 320px;
  padding-top: 20px;
  margin: auto;
}
.trash-can-image {
  height: 24px;
  width: 24px;
}
</style>
