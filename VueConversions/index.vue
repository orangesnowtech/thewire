<script setup lang="ts">
import { doc, collection, query, where } from 'firebase/firestore';
import { lagosLocations } from 'assets/json/requestInfo.json';
import { numberCommas } from '~/utils/numberCommas';
import { formatDate } from '~/utils/formatDate';



const db = useFirestore();

definePageMeta({
  layout: 'plain',
});



const IDSearch = ref('');

const LGAs = reactive({
  selectedLGAs: [],
});

function clearLGAS() {
  LGAs.selectedLGAs = [];
}

const requestTypeQuery = ref('All');
const wiresColl = collection(db, 'userRequests');

const wiresAll = computed(() => {
  // Search by ID (partial match)
  if (IDSearch.value) {
    // Instead of querying Firestore, filter the results client-side for partial match
    return query(
      wiresColl,
      where('published', '==', true)
    );
  }

  // Search by request type and location
  if (requestTypeQuery.value !== 'All' && LGAs.selectedLGAs.length > 0) {
    return query(
      wiresColl,
      where('published', '==', true),
      where('requestType', '==', requestTypeQuery.value),
      where('locations', 'array-contains-any', LGAs.selectedLGAs)
    );
  }

  // Search by request type only
  if (requestTypeQuery.value !== 'All') {
    return query(
      wiresColl,
      where('published', '==', true),
      where('requestType', '==', requestTypeQuery.value)
    );
  }

  // Search by location only
  if (LGAs.selectedLGAs.length > 0) {
    return query(
      wiresColl,
      where('published', '==', true),
      where('locations', 'array-contains-any', LGAs.selectedLGAs)
    );
  }

  // Default: all published
  return query(wiresColl, where('published', '==', true));
});

// Fetch all wires, then filter by partial ID client-side
const allWires = useCollection(wiresAll);
const wiresQuery = computed(() => {
  if (IDSearch.value) {
    return allWires.value.filter(wire =>
      wire.requestID && wire.requestID.toUpperCase().includes(IDSearch.value.toUpperCase())
    );
  }
  return allWires.value;
});

const formStore = useFormStore();

const docRef = doc(collection(db, 'requests'));



function badgeClick(i: number) {
  requestTypeQuery.value = filterBadges[i].label;
  filterBadges.forEach((badge, idx) => {
    badge.color = idx === i ? 'green' : 'white';
  });
}

const filterBadges = reactive([
  {
    label: 'All',
    color: 'green',
  },
  {
    label: 'Rent',
    color: 'white',
  },
  {
    label: 'Buy',
    color: 'white',
  },
  {
    label: 'Short Let',
    color: 'white',
  },

]);
</script>

<template>
  <div class="w-full max-w-5xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
    <div class="flex flex-col justify-center bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-sm">
      <div class="md:flex flex-col gap-4">
        <p class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Need a Property?</p>
        <div class="flex flex-col md:flex-row gap-3">
          <UButton class="grow" :to="`/property/form?id=${docRef.id}`" color="primary" size="lg">Post Request</UButton>
          <UButton to="wires/login" variant="soft" color="primary" size="lg">Manage Request</UButton>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-sm">
      <p class="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">Got a property to Sell, Rent or Short Let?</p>
      <p class="text-gray-700 dark:text-gray-300 mb-6 text-center">Avoid window shoppers and time wasting inspections. Access serious clients without the long chain of middlemen. Close deals faster.</p>
      <UButton color="primary" size="lg">Get Started</UButton>
    </div>
  </div>
  <div id="Wireboard" class="w-full p-10   dark:bg-green-700">
    <div class="pb-8 text-center">
      <p class="text-2xl">Request Boards</p>
      <div>
        <p>See all our property requests</p>
        <p>Total Wires Found: {{ wiresQuery?.length }}</p>
      </div>
    </div>

    <div class="py-4 flex justify-start items-start gap-4">

      <div class="gap-y-2 flex flex-wrap items-center gap-2">
        <UIcon name="i-la:sort-amount-down-alt" class="size-6" />
        <div id="Badges" class="flex gap-2 justify-between">

          <UBadge @click="badgeClick(i)" v-for="(badge, i) in filterBadges" :key="i" color="primary"
            :variant="badge.color === 'green' ? 'solid' : 'soft'">{{ badge.label }}</UBadge>
        </div>

        <div id="LocationSearch" class="flex gap-4">

          <USelectMenu class="grow" :items="lagosLocations" multiple searchable placeholder="Filter by Location"
            v-model="LGAs.selectedLGAs"></USelectMenu>
          <UButton v-if="LGAs.selectedLGAs.length > 0" @click="clearLGAS">Clear Locations</UButton>
        </div>

        <div id="IDSearch" class="flex">
          <UInput v-model="IDSearch" placeholder="Search by ID" />
        </div>
      </div>


    </div>
    <!--  Request Cards-->

    <div class="grid relative md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
      <div class="flex flex-col bg-green-50 outline outline-green-100 shadow shadow-gray-500 rounded-md"
        v-if="wiresQuery.length > 0" v-for="wire in wiresQuery" :key="wire.id">
      
        
          
          <RentWireCard class="grow" v-if="wire.requestType === 'Rent'" :wireDetails="wire" />

          <BuyWireCard class="grow" v-if="wire.requestType === 'Buy'" :wireDetails="wire" />

          <ShortLetWireCard class="grow" v-if="wire.requestType === 'Short Let'" :wireDetails="wire" />
        
      
      </div>
      <div v-else>No Wires Found</div>
    </div>
  </div>
</template>