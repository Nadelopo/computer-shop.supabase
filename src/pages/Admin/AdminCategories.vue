<script setup lang="ts">
import { ref } from 'vue'
import { useCategoriesStore } from '@/stores/categoriesStore'
import VInputFile from '@/components/UI/VInputFile.vue'
import VInputText from '@/components/UI/VInputText.vue'
import CategoriesList from '@/components/Admin/CategoriesList.vue'
import VButton from '@/components/UI/VButton.vue'
import type { IcategoryC } from '@/types/tables'

const { createCategory } = useCategoriesStore()

let form = ref<IcategoryC>({
  img: '',
  title: '',
  enTitle: '',
})

const create = () => {
  createCategory(form.value)
  form.value = {
    img: '',
    title: '',
    enTitle: '',
  }
}
</script>

<template>
  <div>
    <form class="list__form" @submit.prevent="create">
      <div>
        <label>загрузить изображение</label>
        <v-input-file v-model="form.img" class="mt-4" folder="categories" />
      </div>
      <div>
        <label>наименование на английском</label>
        <v-input-text v-model="form.enTitle" />
      </div>
      <div>
        <label>наименование на русском</label>
        <v-input-text v-model="form.title" />
      </div>
      <div>
        <v-button>создать категорию</v-button>
      </div>
    </form>
    <hr class="my-8" />
    <div class="text-2xl font-bold mb-16">Изменение категоирии</div>
    <CategoriesList />
  </div>
</template>
