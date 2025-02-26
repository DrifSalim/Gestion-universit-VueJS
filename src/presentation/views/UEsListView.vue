<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import UEForm from '@/presentation/components/forms/UEForm.vue';
import CustomTable from '@/presentation/components/tables/CustomTable.vue';
import { Ue } from '@/domain/entities/Ue';
import Swal from 'sweetalert2';
import { UesDAO } from '@/domain/daos/UesDAO';

const router = useRouter();
const ueForm = ref<typeof UEForm | null>(null);
const ues = ref<Ue[]>([]);

const formatterEdition = (ue: Ue) => {
  return '<i class="bi bi-pen-fill text-primary"></i>';
};

const formatterSuppression = (ue: Ue) => {
  return '<i class="bi bi-trash-fill text-danger"></i>';
};

const onUECreated = (newUE: Ue) => {
  ues.value.unshift(newUE);
};

const onUEUpdated = (updatedUE: Ue) => {
  const index = ues.value.findIndex((u) => u.ID === updatedUE.ID);
  if (index !== -1) {
    ues.value[index] = updatedUE;
  }
};

const onDeleteUE = (ue: Ue) => {
  Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer cette UE ?',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      UesDAO.getInstance().delete(ue.ID!).then(() => {
        ues.value = ues.value.filter((u) => u.ID !== ue.ID);
      }).catch(() => {
        Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression de l\'UE', 'error');
      });
    }
  });
};

const columns = [
  {
    field: 'EditionUE',
    label: 'Edition',
    formatter: formatterEdition,
    onClick: (ue: Ue) => {
      router.push(`/ue/${ue.ID}`);
    },
    style: 'width: 32px;text-align:center;'
  },
  { field: 'ID', label: 'ID', formatter: null, onClick: null, style: null },
  { field: 'Numero', label: 'Numéro', formatter: null, onClick: null, style: null },
  { field: 'Intitulee', label: 'Intitulé', formatter: null, onClick: null, style: null },
  {
    field: 'DeleteUE',
    label: 'Suppression',
    formatter: formatterSuppression,
    onClick: onDeleteUE,
    style: 'width: 32px;text-align:center;'
  },
];

onMounted(() => {
  UesDAO.getInstance().list().then((data) => {
    ues.value = data;
  }).catch((ex) => {
    Swal.fire('Erreur', ex.message, 'error');
  });
});
</script>

<template>
  <div class="container-fluid">
    <div class="card mt-5">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div class="card-title">
          <h4>Liste des UEs</h4>
        </div>
        <CustomButton :color="BootstrapButtonEnum.info" @click="() => ueForm?.openForm()">
          Ajouter une UE
        </CustomButton>
      </div>
      <div class="card-body">
        <CustomTable
          idAttribute="ID"
          :columns="columns"
          :data="ues"
        />
      </div>
    </div>
  </div>

  <UEForm
    ref="ueForm"
    @create:ue="onUECreated"
    @update:ue="onUEUpdated"
  />
</template>

