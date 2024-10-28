import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import ProjectsLayout from '@/modules/projects/layouts/ProjectsLayout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: { name: 'projects' },
    component: ProjectsLayout,
    children: [
      {
        path: 'projects',
        name: 'projects',
        component: () => import('@/modules/projects/views/ProjectsView.vue'),
      },
      {
        path: 'proyecto/:id',
        name: 'proyectoID',
        component: () => import('@/modules/projects/views/ProjectView.vue'),
        props: true,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
