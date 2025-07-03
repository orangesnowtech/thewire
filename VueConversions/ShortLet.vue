<script setup lang="ts">
import { shortLetUseCase } from 'assets/json/requestInfo.json';
import {
  doc,
  collection,
  updateDoc,
  DocumentReference,
} from 'firebase/firestore';
import * as yup from 'yup';
import type { ShortLet } from '~/types';
import { numberCommas } from '#imports';
import { formatDate } from '~/utils/formatDate';

const uploading = ref(false);
const db = useFirestore();

// use the router
const route = useRoute();
// get the doc id from the url
const docId = (route.query.id as string) || '';
//wire data
const wireRef: DocumentReference = doc(db, 'userRequests', docId);
const { wireData } = useWireRequest<ShortLet>();

const shortLetData = wireData.value;

const showForm = ref(false);

// In shortLetInfo, use string for date fields
const shortLetInfo = reactive({
  requestType: 'Short Let',
  checkInDate: undefined as Date | undefined,
  checkOutDate: undefined as Date | undefined,
  maxBudget: undefined as number | undefined,
  minBudget: undefined as number | undefined,
  useCase: '',
});

// Prefill form from Firestore
watch(wireData, (data) => {
  function toDateValue(val: any): Date | undefined {
    if (!val) return undefined;
    if (typeof val === 'object' && val.seconds) {
      return new Date(val.seconds * 1000);
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d;
    }
    return undefined;
  }
  if (data) {
    shortLetInfo.checkInDate = toDateValue(data.checkInDate);
    shortLetInfo.checkOutDate = toDateValue(data.checkOutDate);
    shortLetInfo.useCase = data.useCase || '';
    shortLetInfo.maxBudget = data.maxBudget;
    shortLetInfo.minBudget = data.minBudget;
  }
}, { immediate: true });

let shortLetInfoSchema = yup.object({
  checkInDate: yup.date().nullable().required('Check in Date is required'),
  checkOutDate: yup.date().nullable().required('Check Out Date is required'),
  useCase: yup.string().required('Use Case is required'),
  minBudget: yup.number().required('Minimum Budget is required'),
  maxBudget: yup.number().required('Maximum Budget is required'),
});
async function shortLetInfoSubmitted() {
  const valid = await shortLetInfoSchema.isValid(shortLetInfo);
  if (!valid) {
    alert('Not valid');
    return;
  }
  uploading.value = true;
  try {
    const payload = {
      ...shortLetInfo,
      checkInDate: shortLetInfo.checkInDate ? shortLetInfo.checkInDate.toISOString().slice(0, 10) : undefined,
      checkOutDate: shortLetInfo.checkOutDate ? shortLetInfo.checkOutDate.toISOString().slice(0, 10) : undefined,
    };
    await updateDoc(wireRef, payload);
    showForm.value = false;
  } catch (err) {
    console.log(err);
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <UNotifications />
  <div v-if="wireData?.requestType === 'Short Let' && !showForm">
    <p>Short Let Information</p>
    <p>Check-in Date: {{ formatDate(wireData.checkInDate) }}</p>
<p>Check-out Date: {{ formatDate(wireData.checkOutDate) }}</p>
    <p>Use Case: {{ wireData.useCase }}</p>
    <p>Minimum Budget: &#8358;{{ numberCommas(wireData.minBudget) }}</p>
    <p>Maximum Budget: &#8358;{{ numberCommas(wireData.maxBudget) }}</p>
    <UButton class="mt-4" variant="outline" @click.prevent="showForm = true">Edit</UButton>
  </div>
  <div v-if="showForm || wireData?.requestType !== 'Short Let'">
    <UForm
      :state="shortLetInfo"
      :schema="shortLetInfoSchema"
      @submit="shortLetInfoSubmitted"
    >
      <UFormField label="Start Date" name="checkInDate">
        <UInput
          type="date"
          :value="shortLetInfo.checkInDate ? shortLetInfo.checkInDate.toISOString().slice(0, 10) : ''"
          @input="(e: Event) => {
            const val = (e.target as HTMLInputElement).value;
            shortLetInfo.checkInDate = val ? new Date(val) : undefined;
          }"
        />
      </UFormField>
      <UFormField label="End Date" name="checkOutDate">
        <UInput
          type="date"
          :value="shortLetInfo.checkOutDate ? shortLetInfo.checkOutDate.toISOString().slice(0, 10) : ''"
          @input="(e: Event) => {
            const val = (e.target as HTMLInputElement).value;
            shortLetInfo.checkOutDate = val ? new Date(val) : undefined;
          }"
        />
      </UFormField>
      <UFormField label="Use Case" name="useCase">
        <USelect
          placeholder="Use Case"
          :items="shortLetUseCase"
          v-model="shortLetInfo.useCase"
        ></USelect>
      </UFormField>
      <div class="h-8"></div>
      <p>Budget/Day</p>
      <UFormField
        label="Minimum Budget"
        name="minBudget"
        help="Budget/payment cycle"
      >
        &#8358;{{
          shortLetInfo.minBudget ? numberCommas(shortLetInfo.minBudget) : ''
        }}
        <UInput type="number" v-model="shortLetInfo.minBudget" />
      </UFormField>
      <UFormField
        label="Maximum Budget"
        name="maxBudget"
        help="Budget/payment cycle"
      >
        &#8358;{{
          shortLetInfo.maxBudget ? numberCommas(shortLetInfo.maxBudget) : ''
        }}
        <UInput type="number" v-model="shortLetInfo.maxBudget" />
      </UFormField>
      <div class="flex gap-2">
        <UButton type="submit" :loading="uploading">
          {{ uploading ? 'Loading' : 'Submit' }}
        </UButton>
        <UButton v-if="wireData?.requestType === 'Short Let'" variant="ghost" @click.prevent="showForm = false">Cancel</UButton>
      </div>
    </UForm>
  </div>
</template>
