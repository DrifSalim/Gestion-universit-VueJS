<script setup lang="ts">

import { ref, onBeforeMount, defineExpose, defineProps, watch } from 'vue';

import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';

import { Ue } from '@/domain/entities/Ue';

import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';

import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';

import CustomModal from '@/presentation/components/modals/CustomModal.vue';

import { UesDAO } from '@/domain/daos/UesDAO';

import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';

import type { Parcours } from '@/domain/entities/Parcours';



const currentUe = ref<Ue>(new Ue(null, null, null, null));

const isOpen = ref(false);

const formErrors = ref<{

  Numero: string | null;

  Intitulee: string | null;

  parcours: string | null;

}>({

  Numero: null,

  Intitulee: null,

  parcours: null,

});



const parcoursOptions = ref<Parcours[]>([]);



const openForm = (ue: UE | null = null) => {

  isOpen.value = true;

  if (ue) {

    currentUe.value = ue;

  }

};



const closeForm = () => {

  isOpen.value = false;

  currentUe.value = new Ue(null, null, null, null);

};



const saveUE = () => {

  if (formErrors.value.Intitulee || formErrors.value.Numero) {

    return;

  }



  if (currentUe.value.ID) {

    UesDAO.getInstance()
      .update(currentUe.value.ID, currentUe.value)
      .then((updatedUe) => {
        alert('Ue mise à jour avec succès');

        // Émettre l'événement de mise à jour
        emit('update:ue', updatedUe);

        closeForm();
      })
      .catch((ex) => {
        alert(ex.message);
      });
  }

 else {

    UesDAO.getInstance().create(currentUe.value).then((newUE) => {

      alert('UE créée avec succès');

      emit('create:ue', newUE);

      closeForm();

    }).catch((ex) => {

      alert(ex.message);

    });

  }

};



const props = defineProps({

  ue: {

    type: Object as () => UE | null,

    required: false,

    default: null,

  },

});



const emit = defineEmits(['create:ue', 'update:ue']);



onBeforeMount(() => {

  if (props.ue) {

    currentUe.value = props.ue;

  }



  // Chargement de la liste des parcours

  ParcoursDAO.getInstance().list().then((parcours) => {

    parcoursOptions.value = parcours

  });

});



defineExpose({

  openForm,

  closeForm,

});



watch(() => props.ue, (newUE) => {

  if (newUE) {

    currentUe.value = newUE;

    openForm();

  }

});



watch(() => currentUe.value.Intitulee, () => {

  if (!currentUe.value.Intitulee || currentUe.value.Intitulee.trim() === '' || currentUe.value.Intitulee.length < 3) {

    formErrors.value.Intitulee = 'L\'intitulé doit faire au moins 3 caractères';

  } else {

    formErrors.value.Intitulee = null;

  }

});



watch(() => currentUe.value.Numero, () => {

  if (!currentUe.value.Numero || currentUe.value.Numero.trim() === '' || currentUe.value.Numero.length < 3) {

    formErrors.value.Numero = 'Le numéro d\'ue doit faire au moins 3 caractères';

  } else {

    formErrors.value.Numero = null;

  }

});

</script>



<template>

  <CustomModal :isOpen="isOpen">

    <template v-slot:title>

      <template v-if="ue && ue.ID"> Modification de l'UE</template>

      <template v-else> Nouvelle UE</template>

    </template>

    <template v-slot:body>

      <div class="text-start mt-1 mb-1">

        <form>

          <CustomInput v-model="currentUe.Numero" class="mt-2" id="numero" libelle="Numéro" type="text"

                       placeholder="Numéro d'UE" :error="formErrors.Numero" />

          <CustomInput v-model="currentUe.Intitulee" id="intitulee" libelle="Intitulé" type="text"

                       placeholder="Intitulé de l'UE" :error="formErrors.Intitulee" />

          <div class="form-group">

            <label for="intitule">Parcours :</label>

            <v-select multiple label="NomParcours" v-model="currentUe.Parcours"

                      :options="parcoursOptions"></v-select>

            <div v-if="formErrors.parcours" class="invalid-feedback">

              {{ formErrors.parcours }}

            </div>

          </div>

        </form>

      </div>

      <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.danger" @click="closeForm">

        Annuler

      </CustomButton>

      <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.primary" @click="saveUE">

        Enregistrer

      </CustomButton>

    </template>

  </CustomModal>

</template>