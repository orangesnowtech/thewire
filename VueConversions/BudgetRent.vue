<script setup lang="ts">
import * as yup from 'yup';
import { RentPaymentOptions, RentDuration } from 'assets/json/requestInfo.json';
import { doc, updateDoc } from 'firebase/firestore';
import { useWireRequest } from '@/composables/useWireRequest';
import type { RentRequestType } from '~/types';
import { numberCommas } from '~/utils/numberCommas';

// Use generic for type safety
const { wireRef, wireData } = useWireRequest<RentRequestType>();

const uploading = ref(false);
const editingForm = ref(false);
const formSubmitted = ref(false);

// Unified form state for both create and edit
const rentFormState = reactive<{
  requestType: string;
  paymentOptions: 'Outright' | 'Monthly' | 'Yearly' | undefined;
  rentDuration: string | undefined;
  minBudget: number | undefined;
  maxBudget: number | undefined;
}>({
  requestType: 'Rent',
  paymentOptions: undefined,
  rentDuration: undefined,
  minBudget: undefined,
  maxBudget: undefined,
});

// Prefill form state from Firestore data
watch(
  () => wireData.value,
  (data) => {
    if (data) {
      rentFormState.paymentOptions = data.paymentOptions;
      rentFormState.rentDuration = data.rentDuration;
      rentFormState.minBudget = data.minBudget;
      rentFormState.maxBudget = data.maxBudget;
    }
  },
  { immediate: true }
);

let rentInfoSchema = yup.object({
  paymentOptions: yup.string().required('Payment Option is required'),
  rentDuration: yup.string().required('Rent Duration is required'),
  minBudget: yup.number().required('Minimum Budget is required'),
  maxBudget: yup.number().required('Maximum Budget is required'),
});

async function submitRentForm() {
  const valid = await rentInfoSchema.isValid(rentFormState);
  if (!valid) {
    alert('Not Valid');
    return;
  }
  uploading.value = true;
  try {
    await updateDoc(wireRef, { ...rentFormState });
    formSubmitted.value = true;
    editingForm.value = false;
  } catch (err) {
    console.log(err);
  } finally {
    uploading.value = false;
  }
}

function toggleForm() {
  editingForm.value = !editingForm.value;
  if (editingForm.value && wireData.value) {
    rentFormState.paymentOptions = wireData.value.paymentOptions;
    rentFormState.rentDuration = wireData.value.rentDuration;
    rentFormState.minBudget = wireData.value.minBudget;
    rentFormState.maxBudget = wireData.value.maxBudget;
  }
}
</script>

<template>
  <div class="text-sm" v-if="wireData?.requestType == 'Rent' && !editingForm">
    <p class="font-semibold">Request Type: Rent</p>
    <p>Rent Duration: {{ wireData?.rentDuration }}</p>
    <p>Payment Cycle: {{ wireData?.paymentOptions }}</p>
    <p>
      Minimum Budget: &#8358;{{
        wireData?.minBudget !== undefined
          ? numberCommas(wireData?.minBudget)
          : ''
      }}
    </p>
    <p>
      Maximum Budget: &#8358;{{
        wireData?.maxBudget !== undefined
          ? numberCommas(wireData?.maxBudget)
          : ''
      }}
    </p>
    <UButton
      variant="outline"
      class="mt-4"
      @click.prevent="toggleForm"
    >Edit</UButton>
  </div>

  <div v-if="editingForm || !wireData?.requestType" class="p-2">
    <FormHeadings title="Renting Budget" />
    <UForm
      :state="rentFormState"
      :schema="rentInfoSchema"
      @submit.prevent="submitRentForm"
    >
      <div class="text-black flex flex-col gap-4">
        <UFormField label="Rent Duration" name="rentDuration">
          <USelect
            placeholder="Rent Duration"
            :items="RentDuration"
            v-model="rentFormState.rentDuration"
          ></USelect>
        </UFormField>

        <UFormField label="Payment Options" name="paymentOptions">
          <USelect
            placeholder="Payment Cycle"
            :items="RentPaymentOptions"
            v-model="rentFormState.paymentOptions"
          ></USelect>
        </UFormField>

        <UFormField
          label="Minimum Budget"
          name="minBudget"
          help="Budget/payment cycle"
        >
          &#8358;{{
            rentFormState.minBudget !== undefined
              ? numberCommas(rentFormState.minBudget)
              : ''
          }}
          <UInput type="number" v-model="rentFormState.minBudget" />
        </UFormField>

        <UFormField
          label="Maximum Budget"
          name="maxBudget"
          help="Budget/payment cycle"
        >
          &#8358;{{
            rentFormState.maxBudget !== undefined
              ? numberCommas(rentFormState.maxBudget)
              : ''
          }}
          <UInput type="number" v-model="rentFormState.maxBudget" />
        </UFormField>
      </div>
      <div class="pt-3">
        <UButton :loading="uploading" type="submit">
          {{ uploading ? 'Loading' : (editingForm ? 'Update' : 'Submit') }}
        </UButton>
        <UButton
          v-if="editingForm"
          variant="ghost"
          class="ml-2"
          @click.prevent="toggleForm"
        >Cancel</UButton>
      </div>
    </UForm>
  </div>
</template>
