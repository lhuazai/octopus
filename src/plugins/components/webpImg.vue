<template lang="pug">
  .webp-img
</template>
<script>
import { checkWebp } from '@/libs/utils';

export default {
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      supportWebp: false
    };
  },
  computed: {
    _src () {
      return '';
      // return this.supportWebp
      //   ? require(`@p/${this.src}.webp`)
      //   : require(`@p/${this.src}`);
    }
  },
  async mounted () {
    this.supportWebp = checkWebp();
  }
};
</script>
