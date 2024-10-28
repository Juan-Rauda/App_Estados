<template>
  <div class="p-6 flex flex-col items-center w-full">
    <h1 class="text-3xl font-semibold text-gray-800 mb-4 text-center">{{ proyecto?.nombre || 'Proyecto no encontrado' }}
    </h1>

    <!-- Mostrar número de tareas y progreso -->
    <div class="text-gray-600 mb-4 text-center">
      <p class="text-lg">Tareas: <span class="font-bold">{{ proyecto?.tareas.length || 0 }}</span></p>
      <p class="text-lg">Progreso: <span class="font-bold">{{ calcularProgreso() }}%</span></p>
    </div>

    <!-- Mensaje cuando se alcanza el máximo de tareas -->
    <div v-if="proyecto?.tareas.length >= 10" class="text-red-600 mb-4">
      Has alcanzado el límite de 10 tareas. No se pueden agregar más.
    </div>

    <!-- Formulario para agregar tareas -->
    <div class="flex gap-4 mb-4 w-full max-w-md" v-if="proyecto?.tareas.length < 10">
      <input v-model="nuevaTarea" type="text" placeholder="Nueva tarea"
        class="input input-bordered w-full rounded-md border-gray-300 focus:ring focus:ring-green-300 transition duration-200"
        maxlength="70" @input="checkCharacterLimit" @keyup.enter="agregarTarea"/>
      <button @click="agregarTarea"
        class="btn btn-success rounded-md shadow-md transition duration-200 hover:bg-green-600">
        Agregar
      </button>
    </div>
    <p v-if="nuevaTarea.length >= 70" class="text-sm text-red-600 mb-2">
      Límite de 70 caracteres alcanzado
    </p>

    <!-- Tabla de tareas con fecha y hora -->
    <table class="table">
      <thead>
        <tr>
          <th class="px-4 py-2">#</th>
          <th class="px-4 py-2">Nombre</th>
          <th class="px-4 py-2">Fecha y Hora</th>
          <th class="px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tarea, index) in proyecto?.tareas || []" :key="index" class="border-t">
          <td class="px-4 py-2 text-center">{{ index + 1 }}</td>
          <td class="px-4 py-2">{{ tarea.nombre }}</td>
          <td class="px-4 py-2">{{ formatearFecha(tarea.fecha) }}</td>
          <td class="px-4 py-2 flex gap-2 justify-center">
            <button @click="editarTarea(index, tarea.nombre)" class="btn btn-primary btn-sm">
              Actualizar
            </button>
            <button @click="confirmarEliminarTarea(index)" class="btn btn-error btn-sm">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Formulario de actualización centrado en pantalla -->
    <div v-if="mostrarFormulario" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-70">
      <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <h2 class="text-lg font-bold mb-2">Actualizar Tarea</h2>
        <input v-model="tareaActualizada" type="text" ref="tareaInput"
          class="input input-bordered w-full rounded-md border-gray-300 focus:ring focus:ring-green-300 transition duration-200"
          placeholder="Editar nombre de tarea" maxlength="70" @input="checkCharacterLimit"
          @keyup.enter="guardarActualizacion" />
        <p v-if="tareaActualizada.length >= 70" class="text-sm text-red-600 mt-2">
          Límite de 70 caracteres alcanzado
        </p>
        <div class="flex gap-2 justify-center mt-4">
          <button @click="guardarActualizacion" class="btn btn-primary">Guardar</button>
          <button @click="cancelarEdicion" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Eliminación -->
    <div v-if="mostrarModalEliminar" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div class="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <h2 class="text-lg font-bold mb-4">¿Estás seguro?</h2>
        <p class="mb-4">¿Quieres eliminar esta tarea?</p>
        <div class="flex gap-4 justify-center">
          <button @click="eliminarTarea()" class="btn btn-error">Eliminar</button>
          <button @click="cancelarEliminar" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useProyectosStore } from '@/modules/projects/store/projects.store';

// Store y rutas
const proyectosStore = useProyectosStore();
const route = useRoute();
const proyectoId = ref(route.params.id as string);

// Obtenemos el proyecto actual por ID
const proyecto = computed(() =>
  proyectosStore.proyectos.find((p) => p.id === proyectoId.value)
);

const tareaInput = ref<HTMLInputElement | null>(null);


// Variables reactivas
const nuevaTarea = ref('');
const tareaActualizada = ref('');
const indiceTarea = ref<number | null>(null);
const mostrarFormulario = ref(false);
const mostrarModalEliminar = ref(false);
const indiceEliminar = ref<number | null>(null);

// Actualiza `proyectoId` y `proyecto` al cambiar la ruta
watch([() => route.params.id, mostrarFormulario], async ([newId, mostrar]) => {
  // Actualiza `proyectoId` y limpia campos al cambiar la ruta
  if (proyectoId.value !== newId) {
    proyectoId.value = newId as string;
    nuevaTarea.value = ''; // Limpia el campo de nueva tarea
    tareaActualizada.value = ''; // Limpia el campo de tarea actualizada
  }

  // Enfocar el input cuando se muestra el formulario
  if (mostrar) {
    await nextTick(); // Espera a que el DOM se actualice
    tareaInput.value?.focus(); // Enfoca el input cuando se muestra el formulario
  }
});

// Función para agregar una nueva tarea
const agregarTarea = () => {
  if (nuevaTarea.value.trim() !== '') {
    proyectosStore.agregarTarea(proyectoId.value, nuevaTarea.value); // Pasa solo el nombre de la tarea
    nuevaTarea.value = '';
  }
};

// Función para confirmar la eliminación de una tarea
const confirmarEliminarTarea = (index: number) => {
  indiceEliminar.value = index;
  mostrarModalEliminar.value = true;
};

// Función para eliminar una tarea
const eliminarTarea = () => {
  if (indiceEliminar.value !== null) {
    proyectosStore.eliminarTarea(proyectoId.value, indiceEliminar.value);
    cancelarEliminar();
  }
};

// Función para cancelar la eliminación
const cancelarEliminar = () => {
  mostrarModalEliminar.value = false;
  indiceEliminar.value = null;
};

// Función para iniciar la edición de una tarea
const editarTarea = (index: number, nombre: string) => {
  indiceTarea.value = index;
  tareaActualizada.value = nombre;
  mostrarFormulario.value = true;
};

// Función para guardar la tarea actualizada
const guardarActualizacion = () => {
  if (indiceTarea.value !== null && tareaActualizada.value.trim() !== '') {
    proyectosStore.actualizarTarea(proyectoId.value, indiceTarea.value, tareaActualizada.value);
    cancelarEdicion();
  }
};

// Función para cancelar la edición
const cancelarEdicion = () => {
  indiceTarea.value = null;
  tareaActualizada.value = '';
  mostrarFormulario.value = false;
};

// Función para formatear la fecha
const formatearFecha = (fecha: string) => {
  if (!fecha) return 'Fecha no disponible';
  const nuevaFecha = new Date(fecha);
  if (isNaN(nuevaFecha.getTime())) return 'Fecha inválida';
  return nuevaFecha.toLocaleString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Función para calcular el progreso
const calcularProgreso = () => {
  const totalTareas = proyecto.value?.tareas.length || 0;
  return Math.min((totalTareas / 10) * 100, 100);
};

const checkCharacterLimit = () => {
  if (tareaActualizada.value.length >= 70) {
    console.log('Límite de 70 caracteres alcanzado');
  }
};
</script>