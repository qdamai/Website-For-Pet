<template>
  <div class="flex flex-col gap-1.5 w-full text-left">
    <label v-if="label" class="font-semibold text-[#4b5563] text-sm ml-1">{{ label }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="type"
      :placeholder="placeholder"
      class="w-full px-5 py-3 rounded-2xl border border-[#f3f4f6] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] transition-all text-[#374151] placeholder-[#9ca3af]"
      :class="{ 'border-[#fca5a5] ring-2 ring-[#fecaca]': error }"
    />
    <span v-if="error" class="text-[#ef4444] text-xs font-semibold ml-1 mt-0.5">{{ error }}</span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script>
