<script setup lang="ts">
import * as yup from 'yup';
import { BuyPaymentOptions } from 'assets/json/requestInfo.json';
import { updateDoc } from 'firebase/firestore';
import { numberCommas } from '#imports';
import { useWireRequest } from '@/composables/useWireRequest';
import type { BuyRequestType } from '~/types copy';

const { db, route, docId, wireRef, wireData } = useWireRequest();

const uploading = ref(false);

const buyFormInfo = reactive<{
  requestType: string;
  paymentOptions: 'Outright' | 'Monthly' | 'Yearly' | undefined;
  minBudget: number | undefined;
  maxBudget: number | undefined;
}>({
  requestType: 'Buy',
  paymentOptions: undefined,
  minBudget: undefined,
  maxBudget: undefined,
});

const editBuyInfo = ref(false);

// Helper to safely access wireData fields
function getWireDataField(field: keyof BuyRequestType) {
  return wireData.value && field in wireData.value ? (wireData.value as any)[field] : undefined;
}

// Prefill form when entering edit mode or when wireData changes
watch(
  () => wireData.value,
  (data) => {
    if (data && editBuyInfo.value) {
      buyFormInfo.paymentOptions = getWireDataField('paymentOptions');
      buyFormInfo.minBudget = getWireDataField('minBudget');
      buyFormInfo.maxBudget = getWireDataField('maxBudget');
    }
  },
  { immediate: true }
);

let buyFormInfoSchema = yup.object({
  paymentOptions: yup.string().required('Payment Option is required'),
  minBudget: yup.number().required('Minimum Budget is required'),
  maxBudget: yup.number().required('Maximum Budget is required'),
});

async function submitBuyFormInfo() {
  const valid = await buyFormInfoSchema.isValid(buyFormInfo);
  if (!valid) {
    alert('Not Valid');
    return;
  }
  await uploadInfo();
  uploading.value = false;
  editBuyInfo.value = false;
}

async function uploadInfo() {
  try {
    uploading.value = true;
    await updateDoc(wireRef, buyFormInfo);
    buyFormSubmitted.value = true;
  } catch (err) {
    console.log(err);
  } finally {
    uploading.value = false;
  }
}

const buyFormSubmitted = ref(false);
const toggleForm = () => {
  editBuyInfo.value = !editBuyInfo.value;
  if (editBuyInfo.value && wireData.value) {
    buyFormInfo.paymentOptions = getWireDataField('paymentOptions');
    buyFormInfo.minBudget = getWireDataField('minBudget');
    buyFormInfo.maxBudget = getWireDataField('maxBudget');
  }
};
</script>

<template>
  <div class="text-sm" v-if="wireData?.requestType === 'Buy' && !editBuyInfo">
    <p class="font-semibold text-xl">Buy Property; Details</p>
    <p>Payment Cycle: {{ getWireDataField('paymentOptions') }}</p>
    <p>
      Minimum Budget: &#8358;{{
        getWireDataField('minBudget') ? numberCommas(getWireDataField('minBudget')) : ''
      }}
    </p>
    <p>
      Maximum Budget: &#8358;{{
        getWireDataField('maxBudget') ? numberCommas(getWireDataField('maxBudget')) : ''
      }}
    </p>
    <UButton
      v-if="wireData?.requestType"
      variant="outline"
      class="mt-4"
      @click.prevent="toggleForm"
    >Edit</UButton>
  </div>

  <div v-if="editBuyInfo || !wireData?.requestType" class="p-2">
   
    <FormHeadings title="Buying Budget?" />

    <UForm
      :state="buyFormInfo"
      :schema="buyFormInfoSchema"
      @submit="submitBuyFormInfo"
    >
      <div class="text-black grow flex flex-col gap-4">
        <UFormField label="I want to pay _____" name="paymentOptions">
          <USelect
            :items="BuyPaymentOptions"
            v-model="buyFormInfo.paymentOptions"
            placeholder='Select an option'
          ></USelect>
        </UFormField>

        <UFormField
          label="Minimum Budget"
          name="minBudget"
          help="Budget/payment cycle"
        >
          &#8358;{{
            buyFormInfo.minBudget ? numberCommas(buyFormInfo.minBudget) : ''
          }}
          <UInput type="number" v-model="buyFormInfo.minBudget" />
        </UFormField>

        <UFormField
          label="Maximum Budget"
          name="maxBudget"
          help="Budget/payment cycle"
        >
          &#8358;{{
            buyFormInfo.maxBudget ? numberCommas(buyFormInfo.maxBudget) : ''
          }}
          <UInput type="number" v-model="buyFormInfo.maxBudget" />
        </UFormField>
      </div>

      <div class="pt-3">
        <UButton  type="submit">
          
          {{ uploading ? 'Loading' : (editBuyInfo ? 'Update' : 'Submit') }}
        </UButton>
        <UButton
          v-if="editBuyInfo"
          variant="ghost"
          class="ml-2"
          @click.prevent="toggleForm"
        >Cancel</UButton>
      </div>
    </UForm>
  </div>
</template>
