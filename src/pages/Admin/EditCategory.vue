<script setup lang="ts">
import { ref, watch, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCategoriesStore } from '@/stores/categoriesStore'
import { removeFromStorage } from '@/utils/storageQueris'
import VInputText from '@/components/UI/VInputText.vue'
import VInputFile from '@/components/UI/VInputFile.vue'
import VLoader from '@/components/UI/Vloader.vue'
import VButton from '@/components/UI/VButton.vue'
import type { IcategoryR, IcategoryU } from '@/types/tables'

const { categories } = storeToRefs(useCategoriesStore())
const { updateCategory } = useCategoriesStore()
const categoryId = Number(useRoute().params.id)
const router = useRouter()

const loader = ref(false)
let oldImg: string | undefined = undefined
const newCategory = ref<IcategoryU | null>(null)

const setNewCategory = () => {
  const currentCategory: IcategoryR | undefined = categories.value.find(
    (e) => e.id === categoryId
  )
  if (currentCategory) {
    newCategory.value = {
      id: currentCategory.id,
      enTitle: currentCategory.enTitle,
      img: currentCategory.img,
      title: currentCategory.title,
    }
  }
}

onBeforeMount(() => {
  if (categories.value.length) {
    setNewCategory()
  }
})

watch(categories, (cur) => {
  if (cur.length) {
    setNewCategory()
  }
})

watch(
  () => newCategory.value,
  (cur) => {
    if (!oldImg && cur?.title) {
      const path = cur.img.split('/')
      oldImg = path.at(-1)
    }
    if (cur?.title) {
      loader.value = true
    }
  }
)

const save = async () => {
  if (newCategory.value) {
    await updateCategory(newCategory.value)
    newCategory.value = {
      id: 0,
      enTitle: '',
      img: '',
      title: '',
    }
    setTimeout(() => (loader.value = false))
    if (oldImg) {
      const data = await removeFromStorage('categories', oldImg)
      if (data) {
        router.push({
          name: 'AdminCategories',
        })
      }
    }
  }
}
</script>

<template>
  <div class="container">
    <form
      v-if="loader && newCategory"
      class="list__form mt-16"
      @submit.prevent="save"
    >
      <div>
        <label>???????????????????????? ???? ??????????????</label>
        <v-input-text v-model="newCategory.title" />
      </div>
      <div>
        <label>???????????????????????? ???? ????????????????????</label>
        <v-input-text v-model="newCategory.enTitle" />
      </div>
      <div>
        <label>??????????????????????</label>
        <v-input-file
          v-model="newCategory!.img"
          folder="categories"
          :required="false"
        />
      </div>
      <div>
        <v-button>??????????????????</v-button>
      </div>
    </form>
    <div v-else class="min-h-screen flex justify-center items-center">
      <v-loader />
    </div>
    <v-button class="mt-6" @click="$router.push({ name: 'AdminCategories' })">
      ??????????
    </v-button>
  </div>
</template>
