<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import EtudiantsForm from '@/presentation/components/forms/EtudiantsForm.vue';
import CustomTable from '@/presentation/components/tables/CustomTable.vue';
import { Etudiants } from '@/domain/entities/Etudiants';
import { EtudiantsDAO } from '@/domain/daos/EtudiantsDAO';
import Swal from 'sweetalert2';


interface Column {
  field: string;
  label: string;
  formatter: ((etudiants: Etudiants) => string) | null;
  onClick: ((etudiants: Etudiants) => void) | null;
  style: string | null;
}

// Références et données
const etudiantsForm = ref<typeof EtudiantsForm | null>(null);
const etudiantsList = ref<Etudiants[]>([]);


const formatterEdition = (etudiants: Etudiants) => {
  return '<i class="bi bi-pen-fill text-primary edition-icon"></i>';
};

const formatterSuppression = (etudiants: Etudiants) => {
  return '<i class="bi bi-trash-fill text-danger suppression-icon"></i>';
};


const onEtudiantCreated = (newEtudiant: Etudiants) => {
  etudiantsList.value.unshift(newEtudiant);
};

const onEtudiantUpdated = (updatedEtudiant: Etudiants) => {
  const index = etudiantsList.value.findIndex((etudiants) => etudiants.ID === updatedEtudiant.ID);
  etudiantsList.value[index] = updatedEtudiant;
};

const onDeleteEtudiant = (etudiants: Etudiants) => {
  Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer cette Etudiant ?',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      EtudiantsDAO.getInstance()
        .delete(etudiants.ID!)
        .then(() => {
          etudiantsList.value = etudiantsList.value.filter((item) => item.ID !== etudiants.ID);
        })
        .catch(() => {
          alert('Une erreur est survenue lors de la suppression de l’etudiant');
        });
    }
  });
};


const columns = [
  {
    field: 'EditionEtudiant',
    label: 'Édition',
    formatter: formatterEdition,
    onClick: (etudiants: Etudiants) => etudiantsForm.value?.openForm(etudiants),
    style: 'width: 5%; text-align: center;',
  },
  { field: 'ID', label: 'ID', formatter: null, onClick: null, style: null },
  { field: 'Nom', label: 'Nom', formatter: null, onClick: null, style: null },
  { field: 'Prenom', label: 'Prénom', formatter: null, onClick: null, style: null },
  {
    field: 'DeleteEtudiant',
    label: 'Suppression',
    formatter: formatterSuppression,
    onClick: onDeleteEtudiant,
    style: 'width: 5%; text-align: center;',
  },
];


onMounted(() => {
  /* etudiantsList.value = [
     { ID: 1, Nom: 'UE01', Prenom: 'Mathématiques', Parcours: 'Base de données' },
     { ID: 2, Nom: 'UE02', Prenom: 'Physique', Parcours:'Base de données' },
   ];*/
  EtudiantsDAO.getInstance()
    .list()
    .then((data) => {
      console.log(data);
      etudiantsList.value = data;
    });
});

</script>

<template>
  <div class="container-fluid">
    <div class="card mt-5">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div class="card-title">
          <h4>Liste des Etudiants</h4>
        </div>
        <CustomButton :color="BootstrapButtonEnum.info" @click="() => etudiantsForm?.openForm()">
          Ajouter un étudiant
        </CustomButton>
      </div>
      <div class="card-body">
        <CustomTable idAttribute="ID" :columns="columns" :data="etudiantsList" />
      </div>
    </div>
    <!-- Formulaire pour ajouter/éditer un étudiant -->
    <EtudiantsForm ref="etudiantsForm" @create:etudiant="onEtudiantCreated" @update:etudiant="onEtudiantUpdated" />
  </div>

</template>

<style scoped>
.edition-icon {
  cursor: pointer;
}
.suppression-icon {
  cursor: pointer;
}

</style>