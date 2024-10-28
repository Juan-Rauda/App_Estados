<template>
  <dialog class="modal" :open="open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ title }}</h3>
      <p v-if="subTitle" class="py-4">{{ subTitle }}</p>

      <div class="modal-action flex flex-col text-center">
        <form method="dialog" @submit.prevent="submitValue">
          <input ref="inputRef" type="text" :placeholder="placeholder ?? 'Ingrese un valor'"
            class="input input-bordered w-full rounded-md border-gray-300 focus:ring focus:ring-green-300 transition duration-200"
            v-model="inputValue" maxlength="20" @input="checkCharacterLimit" />

          <!-- Alerta de límite alcanzado -->
          <p v-if="inputValue.length >= 20" class="text-red-600 text-sm mt-2">
            Has alcanzado el límite de 20 caracteres.
          </p>


          <!-- if there is a button in form, it will close the modal -->
          <div class="flex justify-end mt-5">
            <button type="button" @click="$emit('close')" class="btn mr-4">Close</button>
            <button type="submit" class="btn btn-primary">Aceptar</button>
          </div>
        </form>
      </div>
    </div>
  </dialog>

  <div v-if="open" class="modal-backdrop fixed top-0 left-0 z-10 bg-black opacity-40 w-screen h-screen"></div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface Props {
  open: boolean;
  title: string;
  subTitle?: string;
  placeholder?: string;
}

//defineProps<Props>();
const props = defineProps<Props>();
// Para activar el focus cuando cargue el modal
/*watch(() => props.open, (newValue) => {
  if (newValue && inputRef.value) {
    inputRef.value.focus();
  }
});*/
watch(props, ({ open }) => {
  if (open) {
    inputRef.value?.focus();
  }
});

const emits = defineEmits<{
  close: [void];
  value: [text: string];
}>();

const inputValue = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

const submitValue = () => {
  if (!inputValue.value) {
    inputRef.value?.focus();
    return;
  }

  emits('value', inputValue.value.trim());
  emits('close');

  inputValue.value = '';
};
</script>
