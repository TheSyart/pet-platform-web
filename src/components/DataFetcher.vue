<!-- DataFetcher.vue -->
<template>
  <div>
    <!-- 此处无视图渲染，仅作为数据请求组件 -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    dataType: {
      type: String,
      required: true
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      let apiUrl;
      // 根据 dataType 动态选择 API 地址
      switch (this.dataType) {
        case 'petBreeds':
          apiUrl = '/api/encyclopedia/allBreed';
          break;
        case 'empJob':
          apiUrl = '/api/emp/allJob';
          break;
        case 'shoppingType':
          apiUrl = '/api/petShopping/allType';
          break;
        case 'petCoat':
          apiUrl = '/api/myPet/queryPetCoat';
          break;
        case 'petDetails':
          apiUrl = '/api/myPet/queryPetDetails';
          break;
        case 'petService':
          apiUrl = '/api/petService/allServiceType';
          break;
        case 'petOrder':
          apiUrl = '/api/petOrder/queryAllOrderType';
          break;
        default:
          console.error('未知的数据类型');
          return;
      }

      axios.get(apiUrl, {
        headers: {
          'token': `${localStorage.getItem('jwt')}`
        }
      }).then((response) => {
        this.options = response.data.data; // 获取数据
        this.$emit('data-fetched', this.options); // 发送数据给父组件
      }).catch(error => {
        console.error(`获取${this.dataType}失败`, error);
        this.$emit('data-fetched', []); // 发送空数组表示请求失败
      });
    }
  }
};
</script>
