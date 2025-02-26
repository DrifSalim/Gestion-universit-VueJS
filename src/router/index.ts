import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../presentation/views/HomeView.vue';
import ParcoursListView from '@/presentation/views/ParcoursListView.vue';
import UEsListView from '@/presentation/views/UEsListView.vue'; // Import du composant manquant
import EtudiantsView from '@/presentation/views/EtudiantsView.vue'; // Import du composant manquant
import UEDetails from '@/presentation/views/UEDetails.vue'; // Import du composant manquant

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/parcours',
      name: 'parcours',
      component: ParcoursListView
    },
    {
      path: '/ues',
      name: 'ues',
      component: UEsListView
    },
    {
      path: '/etudiants',
      name: 'etudiants',
      component: EtudiantsView
    },
    {
      path: '/ue/:id',
      name: 'ue-details',
      component: UEDetails
    }
  ]
});

export default router;
