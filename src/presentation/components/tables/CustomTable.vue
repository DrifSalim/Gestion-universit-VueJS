<script setup lang="ts">

import { defineProps } from 'vue';



defineProps<{

  idAttribute: string,

  columns: { field: string, label: string, formatter: Function | null, onClick: Function | null, style: string | null}[],

  data: any[]

}>();



</script>



<template>

  <table class="table table-striped">

    <thead>

    <tr>

      <th v-for="column in columns" :key="column.field">{{ column.label }}</th>

    </tr>

    </thead>

    <tbody>

    <tr v-for="item in data" :key="item[idAttribute]">

      <td v-for="column in columns" :key="column.field"

          @click="column.onClick ? column.onClick(item) : () => { }" :style="column.style">

                    <span :class="{ clickable: column.onClick }">

                        <template v-if="column.formatter"><span v-html="column.formatter(item)"></span></template>

                        <template v-else>{{ item[column.field] }}</template>

                    </span>

      </td>

    </tr>

    </tbody>

  </table>

</template>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>