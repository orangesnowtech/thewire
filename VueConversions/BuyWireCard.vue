<script setup lang="ts">

import type { BuyWire } from '~/types.ts'
import WireLikeDislike from './WireLikeDislike.vue';

// Make all fields in BuyWire optional for robustness
// (You should also update the BuyWire type in types.ts, but this is a local workaround)
const props = defineProps<{ wireDetails: Partial<BuyWire> | null }>();
const buyWire = props.wireDetails;

</script>

<template>
  <div class="flex flex-col " v-if="buyWire">
    <div id="heading" class="flex items-top pt-4 px-8">
      <div class="grow">
        <p class="text-lg font-bold">{{ buyWire.requestType }}</p>

      </div>
      <p class="text-[12px]">ID: {{ buyWire.requestID }}</p>
    </div>

    <!--This section can change-->

    <!--Buying a Bare Land-->

    <div class="flex grow  flex-col px-8" v-if="buyWire.propertyType === 'Bare Land'">
      <p class="text-sm">{{ buyWire.propertyType }} for {{ buyWire.useCase }} use</p>

      <div class="">
        <div class="flex h-full pt-4 space-x-2 items-center">
        <UIcon name="i-tabler:map-pin-2" class="size-6" />
        <p>{{ buyWire.units }} {{ buyWire.landSize }}{{ buyWire.units && buyWire.units > 1 ? 's' : '' }}</p>
      </div>
     
      </div>
      
    </div>
    

    <!--Not Bare Land and Residential Request -->
    <div class="flex grow flex-col px-8" v-if="buyWire.propertyType !== 'Bare Land' && buyWire.useCase === 'Residential'">
      <p class="text-sm">{{ buyWire.buildingType }} for {{ buyWire.useCase }} use</p>

      
      <div class="flex space-x-2 pt-4 items-center">
        <UIcon name="i-tabler:bed" class="size-6" />
        <p>{{ buyWire.roomsNo }} Bedrooms</p>
      </div>

      <div class="flex space-x-2 items-center">
        <UIcon name="i-tabler:toilet-paper" class="size-6" />
        <p>{{ buyWire.toiletBaths }} {{ buyWire.toiletBaths === '1' ? 'Toilet' : 'Toilets' }}</p>
      </div>

    </div>

    <!--Not Bare Land and Commercial Request -->
    <div class="px-8 grow" v-if="buyWire.propertyType !== 'Bare Land' && buyWire.useCase === 'Commercial'">
      <p class="text-sm"> {{ buyWire.useCase }} property in {{ buyWire.commercialPropertyType }}</p>

      <div class="flex space-x-2 pt-4 items-center">
        <UIcon name="i-tabler:ruler-measure" class="size-6" />
        <p>{{ numberCommas(buyWire.floorSpace ?? 0) }}<span class="text-sm">sqm</span></p>
      </div>

      <div class="flex space-x-2 items-center">
        <UIcon name="i-tabler:building-community" class="size-6" />
        <p>{{ buyWire.commercialUseCase }}</p>
      </div>
      

    </div>

    

  

    <div class="px-8 pt-4" v-if="buyWire.propertyType !== 'Bare Land' && buyWire.useCase === 'Commercial'">
      


    </div>


    <!-- This section remains the same for every Wire-->
    <div class="px-8 py-4">
      <div class="flex space-x-2 items-center mb-1 ">
        <UIcon name="i-mingcute:wallet-4-line" class="size-6" />
        <p>{{ buyWire.paymentOptions }} payment</p>
      </div>

      <div class="flex space-x-2 items-center mb-1">
        <UIcon name="i-la:money-bill-wave" class="size-6" />
        <p>₦{{ buyWire.minBudget !== undefined ?
          numberCommas(buyWire.minBudget) : 'N/A' }} - ₦{{ buyWire.maxBudget !== undefined ?
            numberCommas(buyWire.maxBudget) : 'N/A'}} </p>
      </div>
      <div class="flex space-x-2 items-center mb-1">
        <UIcon name="i-tabler:map-pin" class="size-6" />
        <span v-if="buyWire.locations && buyWire.locations.length > 0">
          {{ buyWire.locations.join(', ') }}
        </span>
        <span v-else>
          Not specified
        </span>
      </div>
    </div>

    <div class=" text-green-700 justify-center flex px-8 space-x-2 rounded-b-md items-center py-4">
      <WireLikeDislike
        :wireId="buyWire.requestID || ''"
        :goodBudget="buyWire.goodBudget || []"
        :lowBudget="buyWire.lowBudget || []"
      />
      <div class="flex space-x-2  justify-center text-sm items-center">
        <UBadge icon="i-tabler:rocket" size="md" color="primary" variant="soft">Share</UBadge>
        <UBadge icon="i-tabler:paperclip" size="md" color="primary" variant="soft">Respond</UBadge>
      </div>
    </div>
  </div>

  <div v-else>
    <span>No data available</span>
  </div>

</template>

