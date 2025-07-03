<template>
  <div class="inline-flex flex-col px-4 py-5 border-b border-b-exd-light-grey">
    <label class="flex items-center gap-2 text-exd-gray-scorpion text-exd-1424">
      {{ label }}
      <span
        v-if="required"
        class="text-exd-0910 px-1 py-[2px] rounded-sm"
        :style="{ backgroundColor: bgColor, color: textColor }"
      >
        {{ $t('required') }}
      </span>
    </label>
    <ButtonGroup
      class="w-full h-10 rounded-none text-exd-gray-scorpion"
      style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
    >
      <Button
        @click="selectGender('Male')"
        :label="$t('male')"
        :class="[
          'bg-white w-4/12 h-full border border-exd-stone-300 rounded-none !text-exd-gray-scorpion sm:text-[16px] text-[12.5px]',
          modelValue === 'Male' && '!bg-exd-banana',
        ]"
      />
      <Button
        @click="selectGender('Female')"
        :label="$t('female')"
        :class="[
          'bg-white w-4/12 h-full border-t border-b border-t-exd-stone-300 border-b-exd-stone-300 rounded-none !text-exd-gray-scorpion sm:text-[16px] text-[12.5px]',
          modelValue === 'Female' && '!bg-exd-banana',
        ]"
      />
      <Button
        @click="selectGender('No-Answer')"
        :label="$t('noAnswer')"
        :class="[
          'bg-white w-4/12 h-full border border-exd-stone-300 rounded-none !text-exd-gray-scorpion sm:text-[16px] text-[12.5px]',
          modelValue === 'No-Answer' && '!bg-exd-banana',
        ]"
      />
    </ButtonGroup>
  </div>
</template>

<script setup>

const props = defineProps({
   modelValue: {
    type: String,
    default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: 'sex',
    },
    bgColor: {
      type: String,
      default: '#ffffff',
    },
    textColor: {
      type: String,
      default: '#000000',
    },
})

const emit = defineEmits(['update:modelValue'])

const selectGender = (gender) => {
  emit('update:modelValue', gender);
}
</script>