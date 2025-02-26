<script setup lang="ts">
import { ref, onBeforeMount, defineExpose, defineProps, watch } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import { Etudiants } from '@/domain/entities/Etudiants';
import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import CustomModal from '@/presentation/components/modals/CustomModal.vue';
import { EtudiantsDAO } from '@/domain/daos/EtudiantsDAO';
import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';
import type { Parcours } from '@/domain/entities/Parcours';

const currentEtudiant = ref<Etudiants>(new Etudiants(null, null, null, null));

const isOpen = ref(false);

const formErrors = ref<{
  Nom: string | null;
  Prenom: string | null;
  Parcours: string | null;
}>({
  Nom: null,
  Prenom: null,
  Parcours: null,
});

const parcoursOptions = ref<Parcours[]>([]);

const openForm = (etudiants: Etudiants | null = null) => {
  isOpen.value = true;

  if (etudiants) {
    currentEtudiant.value = etudiants;
  }
};

const closeForm = () => {
  isOpen.value = false;
  currentEtudiant.value = new Etudiants(null, null, null, null);
};

const saveEtudiants = () => {
  if (formErrors.value.Nom || formErrors.value.Prenom) {
    return;
  }

  if (currentEtudiant.value.ID) {
    EtudiantsDAO.getInstance()
      .update(currentEtudiant.value.ID, currentEtudiant.value)
      .then((updatedEtudiant) => {
        alert('Étudiant mis à jour avec succès');
        emit('update:etudiant', updatedEtudiant);
        closeForm();
      })
      .catch(() => {
        alert('Erreur lors de la mise à jour');
      });
  } else {
    EtudiantsDAO.getInstance()
      .create(currentEtudiant.value)
      .then(() => {
        alert('Un nouvel étudiant a été créé');
        emit('create:etudiant', currentEtudiant.value);
        closeForm();
      })
      .catch((ex) => {
        alert(ex.message);
      });
  }
};

const props = defineProps({
  etudiants: {
    type: Object as () => Etudiants | null,
    required: false,
    default: null,
  },
});

const emit = defineEmits(['create:etudiant', 'update:etudiant']);

onBeforeMount(() => {
  if (props.etudiants) {
    currentEtudiant.value = props.etudiants;
  }

  ParcoursDAO.getInstance()
    .list()
    .then((parcours) => {
      parcoursOptions.value = parcours;
    });
});

defineExpose({
  openForm,
  closeForm,
});

watch(() => props.etudiants, (newEtudiant) => {
  if (newEtudiant) {
    currentEtudiant.value = newEtudiant;
    openForm();
  }
});

watch(() => currentEtudiant.value.Prenom, () => {
  if (
    !currentEtudiant.value.Prenom ||
    currentEtudiant.value.Prenom.trim() === '' ||
    currentEtudiant.value.Prenom.length < 3
  ) {
    formErrors.value.Prenom = 'Le prénom doit faire au moins 3 caractères';
  } else {
    formErrors.value.Prenom = null;
  }
});

watch(() => currentEtudiant.value.Nom, () => {
  if (
    !currentEtudiant.value.Nom ||
    currentEtudiant.value.Nom.trim() === '' ||
    currentEtudiant.value.Nom.length < 3
  ) {
    formErrors.value.Nom = 'Le nom doit faire au moins 3 caractères';
  } else {
    formErrors.value.Nom = null;
  }
});
</script>

<template>
  <CustomModal :isOpen="isOpen">
    <template v-slot:title>
      <template v-if="etudiants && etudiants.ID"> Modification de l'étudiant </template>
      <template v-else> Enregistrer un étudiant </template>
    </template>

    <template v-slot:body>
      <div class="text-start mt-1 mb-1">
        <form>
          <CustomInput
            v-model="currentEtudiant.Nom"
            class="mt-2"
            id="nom"
            libelle="Nom"
            type="text"
            placeholder="Nom de l'étudiant"
            :error="formErrors.Nom"
          />

          <CustomInput
            v-model="currentEtudiant.Prenom"
            id="prenom"
            libelle="Prénom"
            type="text"
            placeholder="Prénom de l'étudiant"
            :error="formErrors.Prenom"
          />

          <div class="form-group">
            <label for="parcours">Parcours :</label>
            <v-select  label="NomParcours" v-model="currentEtudiant.Parcours"

                      :options="parcoursOptions"></v-select>

            <div v-if="formErrors.Parcours" class="invalid-feedback">
              {{ formErrors.Parcours }}
            </div>
          </div>
        </form>
      </div>

      <CustomButton
        class="mt-1"
        style="margin-left: 5px"
        :color="BootstrapButtonEnum.danger"
        @click="closeForm"
      >
        Annuler
      </CustomButton>

      <CustomButton
        class="mt-1"
        style="margin-left: 5px"
        :color="BootstrapButtonEnum.primary"
        @click="saveEtudiants"
      >
        Enregistrer
      </CustomButton>
    </template>
  </CustomModal>
</template>

<style scoped>
</style>
