<script setup lang="ts">
import { BuyRentLease } from 'assets/json/requestInfo.json';
import { doc, type DocumentReference } from 'firebase/firestore';
import type { WireDetails } from '~/types';

// use Firestore
const db = useFirestore();
// use url route

const route = useRoute();

// get the doc id from the url
const docId = (route.query.id as string) || '';

const wireRef: DocumentReference = doc(db, 'userRequests', docId);
const wireData = useDocument<WireDetails>(wireRef);

const selectedRequest = ref('');
</script>
<template>
  <div>
    <FormHeadings title="What is your request" />

    <UFormField
      v-if="!wireData?.requestType"
      class="pb-4"
      name="requestType"
      label="I want to _____"
    >
      <USelect
        placeholder="Select Request Type"
        :items="BuyRentLease"
        v-model="selectedRequest"
      ></USelect>
    </UFormField>

    <div v-if="selectedRequest == 'Buy' || wireData?.requestType == 'Buy'">
      <LazyBudgetBuy />
    </div>
    <div v-if="selectedRequest == 'Rent' || wireData?.requestType == 'Rent'">
      <LazyBudgetRent />
    </div>

    <div
      v-if="
        selectedRequest == 'Short Let' || wireData?.requestType == 'Short Let'
      "
    >
      <LazyShortLet />
    </div>

    <div v-if="selectedRequest == 'Joint Venture'">
      <LazyJointVenture />
    </div>
  </div>
</template>
