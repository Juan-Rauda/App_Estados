<template>
  <div class="overflow-x-auto w-full">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th>#</th>
          <th>Proyecto</th>
          <th>Tareas</th>
          <th>Avance</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(proyecto, i) in proyectosStore.proyectos" :key="i" class="hover">
          <th> {{ i + 1 }}</th>
          <td>
            {{ proyecto.nombre }}</td>
          <td>
            {{ proyecto.tareas.length }}
          </td>
          <td><progress :value="proyecto.progreso" class="progress progress-primary w-56" max="100"></progress></td>
          <!-- Botón para eliminar el proyecto -->
          <td>
            <button @click="confirmarEdicion(proyecto.id, proyecto.nombre)" class="btn btn-primary">Editar</button>
            <button @click="confirmarEliminar(proyecto.id)" class="btn btn-error ml-2">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>


  <!-- Modal para edición de nombre de proyecto -->
  <div v-if="mostrarModalEdicion" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <h2 class="text-lg font-bold mb-4">Editar Proyecto</h2>
      <input ref="nombreProyectoInput" type="text" v-model="nombreProyectoEditado"
        class="input input-bordered w-full rounded-md border-gray-300 focus:ring focus:ring-green-300 transition duration-200"
        placeholder="Nuevo nombre" maxlength="20" @input="checkCharacterLimit" @keyup.enter="guardarEdicion" />
      <p v-if="nombreProyectoEditado.length >= 20" class="text-sm text-red-600 mt-2">
        Límite de 20 caracteres alcanzado
      </p>
      <div class="flex gap-4 justify-center mt-4">
        <button @click="guardarEdicion" class="btn btn-primary">Guardar</button>
        <button @click="cancelarEdicion" class="btn btn-secondary">Cancelar</button>
      </div>
    </div>
  </div>

  <!-- Modal de Confirmación de Eliminación -->
  <div v-if="mostrarModalEliminar"
    class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
      <h2 class="text-lg font-bold mb-4">¿Estás seguro?</h2>
      <p class="mb-4">¿Quieres eliminar este proyecto?</p>
      <div class="flex gap-4 justify-center">
        <button @click="eliminarProyecto()" class="btn btn-error">Eliminar</button>
        <button @click="cancelarEliminar" class="btn btn-secondary">Cancelar</button>
      </div>
    </div>
  </div>

  <input-modal :open="modalOpen" @close="modalOpen = false" @value="onNewValue"
    placeholder="Ingrese el nombre del proyecto" title="Nuevo proyecto"
    sub-title="Dale un nombre único a tu proyecto" />

  <custom-modal :open="customModalOpen">
    <template #header>
      <h1 class="text-3xl">Titulo del modal</h1>
    </template>

    <template #body>
      <p>
        Nulla consequat non ullamco mollit est quis duis pariatur cupidatat consequat Lorem cillum.
      </p>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <button @click="customModalOpen = false" class="btn mr-4">Close</button>
        <button @click="customModalOpen = false" class="btn btn-primary">Aceptar</button>
      </div>
    </template>
  </custom-modal>

  <fab-button @click="modalOpen = true">
    <AddCircle />
  </fab-button>

  <fab-button @click="customModalOpen = true" position="bottom-left">
    <ModalIcon />
  </fab-button>
</template>

<script lang="ts" setup>
import CustomModal from '@/modules/common/components/CustomModal.vue';
import FabButton from '@/modules/common/components/FabButton.vue';
import InputModal from '@/modules/common/components/InputModal.vue';
import AddCircle from '@/modules/common/icons/AddCircle.vue';
import ModalIcon from '@/modules/common/icons/ModalIcon.vue';
import { ref, watch, nextTick } from 'vue';

const modalOpen = ref(false);
const customModalOpen = ref(false);


/*const onNewValue = (projectName: string) => {
  console.log({ projectName });
};*/

import { useProyectosStore } from '../store/projects.store';
const proyectosStore = useProyectosStore();

// Función para manejar el nuevo valor del proyecto
const onNewValue = (nombreProyecto: string) => {
  proyectosStore.agregarProyecto(nombreProyecto);
  modalOpen.value = false; // Cierra el modal despues de agregar un nuevo proyecto
  //console.log({ proyectosStore });
}

// Parte de la edicion
const mostrarModalEdicion = ref(false);
const idProyectoAEditar = ref<string | null>(null);
const nombreProyectoEditado = ref('');
const nombreProyectoInput = ref<HTMLInputElement | null>(null);

// Función para confirmar la edición de un proyecto
const confirmarEdicion = (id: string, nombreActual: string) => {
  idProyectoAEditar.value = id;
  nombreProyectoEditado.value = nombreActual; // Carga el nombre actual en el campo de edición
  mostrarModalEdicion.value = true;
};

// Función para guardar la edición
const guardarEdicion = () => {
  const nombreEditadoTrimmed = nombreProyectoEditado.value.trim(); // Elimina espacios en blanco

  if (nombreEditadoTrimmed === '') {
    return; // No guarda si está vacío
  }

  if (idProyectoAEditar.value) {
    proyectosStore.actualizarProyectoNombre(idProyectoAEditar.value, nombreEditadoTrimmed);
    mostrarModalEdicion.value = false;
    idProyectoAEditar.value = null;
  }
};

// Función para cancelar la edición
const cancelarEdicion = () => {
  mostrarModalEdicion.value = false;
  idProyectoAEditar.value = null;
};

// Parte de eliminar
const mostrarModalEliminar = ref(false);
const idProyectoAEliminar = ref<string | null>(null);

// Función para confirmar la eliminación de un proyecto
const confirmarEliminar = (id: string) => {
  idProyectoAEliminar.value = id; // Guarda el ID del proyecto que se quiere eliminar
  mostrarModalEliminar.value = true; // Muestra el modal de confirmación
};

// Función para eliminar el proyecto
const eliminarProyecto = () => {
  if (idProyectoAEliminar.value) {
    proyectosStore.eliminarProyectoPorId(idProyectoAEliminar.value);
  }
  mostrarModalEliminar.value = false;
  idProyectoAEliminar.value = null; // Resetea el ID después de la eliminación
};

// Función para cancelar la eliminación
const cancelarEliminar = () => {
  mostrarModalEliminar.value = false;
  idProyectoAEliminar.value = null;
};

// Función para verificar el límite de caracteres
const checkCharacterLimit = () => {
  if (nombreProyectoEditado.value.length >= 20) {
    console.log('Límite de 20 caracteres alcanzado');
  }
};

// Observador para el modal de edición
watch(mostrarModalEdicion, async (newValue) => {
  if (newValue) {
    await nextTick(); // Asegúrate de que el DOM esté actualizado
    nombreProyectoInput.value?.focus(); // Enfoca el input cuando se abre el modal
  }
});
</script>
