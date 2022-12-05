<script setup lang="ts">
import { onUnmounted, ref, watchEffect, type PropType } from 'vue'
import { isOutside } from '@/utils/isOutside'
import ArrowSVG from '@/assets/icons/arrow.svg?component'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array as PropType<{ title: string; value: string }[]>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const active = ref(false)
const btn = ref<HTMLElement | null>(null)
const selected = ref(props.modelValue)
const optionsRefs = ref<HTMLButtonElement[]>([])

const color = ref('#a9a9a9')

const onOptionClick = (selectValue: string, i: number) => {
  selected.value = props.options[i].title
  emit('update:modelValue', selectValue)
  if (color.value === '#a9a9a9') {
    color.value = '#fff'
  }
}

const onOptionUp = (i: number) => {
  if (i) {
    const prevElement = optionsRefs.value[i - 1]
    prevElement.focus()
  } else {
    const lastElement = optionsRefs.value.at(-1)
    lastElement?.focus()
  }
}

const onOptionDown = (i: number) => {
  if (i < props.options.length - 1) {
    const nextElement = optionsRefs.value[i + 1]
    nextElement.focus()
  } else {
    const firstElement = optionsRefs.value[0]
    firstElement.focus()
  }
}

const clickOutside = (e: Event) => {
  if (btn.value) {
    if (isOutside(btn.value, e)) {
      active.value = false
    }
  }
}

const onFocus = () => {
  if (optionsRefs.value) {
    const isValue = props.options.find((e) => e.value === props.modelValue)
    if (isValue) {
      const selectedElement = optionsRefs.value.filter(
        (e) => e.textContent === isValue.title
      )[0]
      setTimeout(() => selectedElement.focus(), 100)
    } else {
      setTimeout(() => {
        if (optionsRefs.value) {
          const firstChildren = optionsRefs.value[0]
          firstChildren.focus()
        }
      }, 100)
    }
  }
  active.value = !active.value
}

watchEffect(() => {
  const eventType = active.value ? 'addEventListener' : 'removeEventListener'
  window[eventType]('click', clickOutside)
})

onUnmounted(() => {
  removeEventListener('click', clickOutside)
})
</script>

<template>
  <span class="root">
    <button ref="btn" class="select" :class="{ active }" @focus="onFocus">
      <div class="head">
        <span>{{ selected ?? 'Select' }}</span>
        <ArrowSVG class="svg" :class="{ active }" />
      </div>
    </button>
    <div class="list" :class="{ active }">
      <button
        v-for="(option, i) in options"
        :key="i"
        ref="optionsRefs"
        class="option"
        :class="modelValue === option.value && 'active '"
        @click="onOptionClick(option.value, i)"
        @keyup.arrow-down="onOptionDown(i)"
        @keyup.arrow-up="onOptionUp(i)"
      >
        {{ option.title }}
      </button>
    </div>
  </span>
</template>

<style scoped lang="sass">
$transition: .2s
$back: #1e2023

.root
  position: relative
  height: 38px
  display: inline-block
  width: 200px

.select
  border-radius: 12px
  background: $back
  border: 2px solid transparent
  width: 200px
  height: 38px
  color: v-bind(color)
  padding: 7px 13px
  user-select: none
  cursor: pointer
  outline: none
  transition: $transition
  &.active
    border-radius: 12px 12px 0 0
  .head
    display: flex
    justify-content: space-between
    align-items: center

.icon-arrow
  width: 10px
  height: 10px

.svg
  width: 15px
  fill: #fff
  right: 0
  transition: $transition
  transform: rotate(180deg)
  &.active
    transform: rotate(360deg)

.list
  padding: 5px
  border-radius: 0 0 12px 12px
  position: absolute
  top: 30px
  left: 0
  width: 100%
  transition: $transition
  background: $back
  opacity: 0
  overflow: hidden
  visibility: hidden
  transform: translateY(-5px) scale(0.95)
  &.active
    opacity: 1
    visibility: visible
    transform: translateY(0) scale(1)

.option
  padding: 6px 10px
  background: $back
  width: 200px
  color: #fff
  transition: $transition
  cursor: pointer
  text-align: start
  width: 96%
  border-radius: 7px
  &:hover, &.active, &:focus
    transform: translateX(4px)
    color: var(--color-text)
    outline: none
  &.active
    background: var(--back-main)
</style>