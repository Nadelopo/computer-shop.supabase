<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    required: true,
  },
  step: {
    type: Number,
    default: 1,
  },
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:minValue', 'update:maxValue'])

const minDefault = String(props.min)
const maxDefault = String(props.max)

const min = ref(props.min)
const max = ref(props.max)

const onChange = () => {
  const prevMin = min.value
  const prevMax = max.value

  if (min.value > Number(maxDefault)) {
    min.value = Number(maxDefault)
  }

  if (min.value > max.value) {
    max.value = prevMin
    min.value = prevMax
  }
}

defineExpose({
  apply: () => {
    emit('update:minValue', min.value)
    emit('update:maxValue', max.value)
  },
})
</script>

<template>
  <div>
    <div class="title">{{ title }}</div>
    <div class="grid">
      <div>
        <input
          ref="minRef"
          v-model.number="min"
          :step="step"
          :min="minDefault"
          :max="maxDefault"
          class="filter_price"
          placeholder="0"
          type="number"
          @input="onChange"
        />
      </div>
      <div class="line"></div>
      <div class="text-end">
        <input
          ref="maxRef"
          v-model.number="max"
          :step="step"
          :min="minDefault"
          :nax="maxDefault"
          class="filter_price"
          :placeholder="maxDefault"
          type="number"
          @input="onChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.grid
  display: grid
  grid-template-columns: 1fr auto 1fr
  align-items: center
  grid-gap: 30px
.filter_price
  border: 2px solid #454545
  padding: 4px
  border-radius: 6px
  max-width: 90px
  width: 100%
  outline: none
  transition: 0.3s
  &:focus
    border-color: #26a69a
    transition: 0.3s
.line
  border: 1px solid #000
  height: 0
  width: 12px
  background-color: #000
.title
  text-align: center
  margin-bottom: 8px
</style>
