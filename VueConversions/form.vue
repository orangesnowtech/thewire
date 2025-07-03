<script setup lang="ts">
import type { Wire } from '~/types';
import AgentInfo from '~/components/PropertyRequest/AgentInfo.vue';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';


definePageMeta({
  layout: 'plain',
});

const db = useFirestore();
const docRef = doc(collection(db, 'requests'));

const route = useRoute();
const router = useRouter();
const docId = route.query.id as string;

const wireRef = doc(db, 'userRequests', docId);
const mailRef = collection(db, 'sentMails');
const wireData = useDocument<Wire | null>(wireRef);
const wireInfo = wireData.value;

// Remove unused wireInfo
// Add type for requesterInfo
interface RequesterInfo {
  email: string;
  name: string;
}
const requesterInfo: RequesterInfo = reactive({
  email: '',
  name: '',
});

// Use a computed property for agent/customer selection
const isAgent = computed(() => {
  return formUsingAgent.value === 'Yes' || wireData.value?.usingAgent === 'Yes';
});
const isCustomer = computed(() => {
  return formUsingAgent.value === 'No' || wireData.value?.usingAgent === 'No';
});

watch(wireData, (newValue) => {
  if (newValue?.usingAgent === 'Yes') {
    requesterInfo.email = newValue.agentEmail || '';
    requesterInfo.name = newValue.agentFullName || '';
  } else if (newValue?.usingAgent === 'No') {
    requesterInfo.email = newValue.customerEmail || '';
    requesterInfo.name = newValue.customerFullName || '';
  } else {
    requesterInfo.email = '';
    requesterInfo.name = '';
  }
});

const formUsingAgent = ref('');
const toast = useToast();

//options for the agent
const agentOptions = ref(['Yes', 'No']);

async function deleteWire() {
  router.push('/');
  await deleteDoc(wireRef).then(() => {
    toast.add({
      title: 'Request Cancelled',
    });
  });
}

function generateRandomId() {
  const textCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberCharacters = '0123456789';

  let randomId = '';

  // Generate 3 random text characters
  for (let i = 0; i < 3; i++) {
    randomId += textCharacters.charAt(
      Math.floor(Math.random() * textCharacters.length)
    );
  }

  // Generate 6 random number characters
  for (let i = 0; i < 6; i++) {
    randomId += numberCharacters.charAt(
      Math.floor(Math.random() * numberCharacters.length)
    );
  }

  return randomId;
}
let wireRequestID = generateRandomId();
const showAlert = ref(false);

// Ensure modal does not show on page load if already submitted
async function sendEmail() {
  try {
    const doc = await addDoc(mailRef, {
      template: {
        name: 'userRequest',
        data: {
          id: wireRequestID,
          name: requesterInfo.name,
          email: requesterInfo.email,
        },
      },
      to: [requesterInfo.email, 'chris@corporatelandlords.com'],
    });
  } catch (err) {
    toast.add({
      title: 'Error sending email',
      description: 'There was a problem sending your confirmation email.',
      color: 'error',
    });
    console.error('Error sending email:', err);
  }
}

async function completeSubmission() {
  try {
    await submitForm();
    await sendEmail();
  } catch (err) {
    // Error already handled in sub-functions
  }
}

async function submitForm() {
  try {
    await updateDoc(wireRef, {
      submitted: true,
      published: false,
      formSubmitted: true,
      time: serverTimestamp(),
      requestID: wireRequestID,
    });
    // Only show the modal after successful save
    showAlert.value = true;
  } catch (err) {
    toast.add({
      title: 'Error submitting form',
      description: 'There was a problem submitting your request.',
      color: 'error',
    });
    console.error('Error submitting form:', err);
    // Hide modal if error
    showAlert.value = false;
  }
}
</script>

<template>

  <UModal v-if="showAlert" v-model:open="showAlert">

    <template #content>
      <div class="m-8 rounded-lg p-8 outline outline-green-200">
        <p class="text-sm font-semibold text-green-700">Requested submitted succesfully</p>

        <p class="">Your request id is: {{ wireRequestID }}</p>
        <div class=py-4>
          <p class="text-xl">Payment</p>
          <p>Before we publish your request you will need to pay your listing fee of N3,100</p>

          <div class="py-2">After payment, a customer care agent will contact you! </div>
          <UButton target="_blank" to="https://paystack.shop/pay/corplandrequest">
            Pay Now
          </UButton>
        </div>


        
        <div class="py-4">
          <p class="text-lg">Manage Your Request</p>
          <p class="pb-2">
            To see responses to your request, make payment later, or edit your request,
            login to your request dashboard using your request id: {{ wireRequestID }} & email: {{
              wireData?.agentEmail || wireData?.customerEmail }}

          </p>


          <UButton to="wires/login" variant="soft" color="primary">Manage Request</UButton>
        </div>


        <div class="flex gap-2 pt-8 pb-4">
          <UButton to="/">Go Home</UButton>
          <UButton class="grow" variant="link" :to="`/property/form?id=${docRef.id}`">Post Another Request</UButton>
        </div>
      </div>

    </template>
  </UModal>
  <div v-if="!wireData?.submitted" class="p-8 flex justify-center bg-green-200">
    <div class="flex flex-col gap-4  md:w-1/2 pb-20 pt-20">
      <UCard>
        <p class="text-3xl pb-4">Wire Request Details</p>

        <UFormField v-if="!wireData?.usingAgent" class="pb-4"
          label="Are you an Agent helping a client with their search?">
          <USelect placeholder="Agent?" :items="agentOptions" v-model="formUsingAgent" />
        </UFormField>
        <div v-if="formUsingAgent || wireData?.usingAgent">
          <AgentInfo v-if="isAgent" />
          <CustomerInfo v-if="isCustomer" />
        </div>
        <div class="pt-4 space-y-4" v-if="wireData?.agentEmail || wireData?.customerEmail">
          <SelectLocations />
          <RequestType v-if="wireData.locations" />
          <PropertyStatusAndUseCase v-if="
            wireData.requestType &&
            (wireData.requestType === 'Rent' ||
              wireData.requestType === 'Buy')
          " />

          <ShortLetPropertyInfo v-if="wireData.requestType === 'Short Let'" />
          <JVCommercialInfo v-if="wireData.requestType === 'Joint Venture'" />

          <OtherInfo
            v-if="(wireData && ('useCase' in wireData ? wireData.useCase : (wireData as Wire)?.buildingType))" />

        </div>

      </UCard>

      <div class="pt-4 flex space-x-2">
        <UButton v-if="wireData?.formCompleted" :disabled="showAlert" @click.prevent="completeSubmission()">Submit Wire
        </UButton>
        <UButton variant="outline" @click.prevent="deleteWire()">Cancel Wire</UButton>
      </div>
    </div>
  </div>

  <div v-else class="p-8 bg-green-200 h-screen flex flex-col items-center">
    <p>Form Submitted succesfully!</p>
    <div class="space-x-2 pt-4 ">
      <UButton to="/">Go Home</UButton>
      <UButton variant="outline" to="/property">Post New Brief</UButton>
    </div>
  </div>
</template>
