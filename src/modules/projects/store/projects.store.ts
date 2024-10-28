import { defineStore } from 'pinia';

export const useProyectosStore = defineStore('proyectos', {
  state: () => ({
    proyectos: JSON.parse(localStorage.getItem('proyectos') || '[]') as {
      id: string;
      nombre: string;
      tareas: { nombre: string; fecha: string }[];
      progreso: number;
    }[],
  }),
  actions: {
    agregarProyecto(nombreProyecto: string) {
      const nuevoProyecto = {
        id: Date.now().toString(),
        nombre: nombreProyecto,
        tareas: [],
        progreso: 0,
      };
      this.proyectos.push(nuevoProyecto);
      localStorage.setItem('proyectos', JSON.stringify(this.proyectos));
      console.log('Nuevo proyecto:', nuevoProyecto);
    },
    agregarTarea(proyectoId: string, nombreTarea: string) {
      const proyecto = this.proyectos.find((p) => p.id === proyectoId);
      if (proyecto) {
        proyecto.tareas.push({
          nombre: nombreTarea,
          fecha: new Date().toISOString(), // Agrega la fecha actual
        });
        this.actualizarProgreso(proyectoId);
        localStorage.setItem('proyectos', JSON.stringify(this.proyectos));
      }
    },
    eliminarTarea(proyectoId: string, index: number) {
      const proyecto = this.proyectos.find((p) => p.id === proyectoId);
      if (proyecto) {
        proyecto.tareas.splice(index, 1);
        this.actualizarProgreso(proyectoId);
        localStorage.setItem('proyectos', JSON.stringify(this.proyectos));
      }
    },
    actualizarTarea(proyectoId: string, index: number, nuevoNombre: string) {
      const proyecto = this.proyectos.find((p) => p.id === proyectoId);
      if (proyecto && proyecto.tareas[index]) {
        proyecto.tareas[index].nombre = nuevoNombre;
        localStorage.setItem('proyectos', JSON.stringify(this.proyectos));
      }
    },
    actualizarProgreso(proyectoId: string) {
      const proyecto = this.proyectos.find((p) => p.id === proyectoId);
      if (proyecto) {
        proyecto.progreso = (proyecto.tareas.length / 10) * 100;
        localStorage.setItem('proyectos', JSON.stringify(this.proyectos));
      }
    },
    // eliminarTodosProyectos() {
    //   this.proyectos = []; // Limpiar la lista de proyectos en el estado
    //   localStorage.removeItem('proyectos'); // Eliminar de localStorage
    // },
    eliminarProyectoPorId(id: string) {
      this.proyectos = this.proyectos.filter((proyecto) => proyecto.id !== id);
      localStorage.setItem('proyectos', JSON.stringify(this.proyectos));
    },
    actualizarProyectoNombre(id: string, nuevoNombre: string) {
      const proyecto = this.proyectos.find((p) => p.id === id);
      if (proyecto) {
        proyecto.nombre = nuevoNombre;
        localStorage.setItem('proyectos', JSON.stringify(this.proyectos));
      }
    },
  },
});
