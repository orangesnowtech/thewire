<script setup lang="ts">
import { numberCommas } from '~/utils/numberCommas';
import type { RentWire } from '~/types';

const props = defineProps<{ wireDetails: Partial<RentWire> | null  }>();
const rentWire = props.wireDetails;
</script>
<template>

  <div class="flex flex-col " v-if="rentWire">
    <div id="heading" class="flex items-top pt-4 px-8">
      <div class="grow">
        <p class="text-lg font-bold">{{ rentWire.requestType }}</p>

      </div>
      <p class="text-[12px]">ID: {{ rentWire.requestID }}</p>
    </div>

    <!--This section can change-->

    <!-- Bare Land -->
    <div class="px-8 grow " v-if="rentWire.propertyType === 'Bare Land'">

      <div class="text-sm pb-4">
        <p> {{ rentWire.propertyType }} for {{ rentWire.useCase }} use</p>
      </div>

      <div class="flex space-x-2 items-center">
        <UIcon name="i-tabler:map-pin-2" class="size-6" />
        <p>{{ rentWire.units }} {{ rentWire.landSize }}{{ rentWire.units && rentWire.units > 1 ? 's' : '' }}</p>
      </div>

      <div class="flex space-x-2 items-center">
        <UIcon name="i-la:clock-solid" class="size-6" />
        <p>{{ rentWire.rentDuration }}</p>
      </div>
    </div>

    <!--Development for Commercial Use-->

    <div class="px-8" v-if="rentWire.propertyType !== 'Bare Land' && rentWire.useCase === 'Commercial'">
      <p class="text-sm">{{ rentWire.commercialUseCase }} in {{ rentWire.commercialPropertyType }}</p>

      <div class="pt-4">
        <div class="flex space-x-2 items-center">
        <UIcon name="i-tabler:ruler-measure" class="size-6" />
        <p>{{ numberCommas(rentWire.floorSpace? rentWire.floorSpace : 0) }}<span class='text-sm' >sqm</span></p>
      </div>

      <div class="flex space-x-2 items-center">
        <UIcon name="i-la:clock-solid" class="size-6" />
        <p>{{ rentWire.rentDuration }}</p>
      </div>
      </div>
    </div>

    
<!-- Development for Residential Use -->
    <div class="px-8" v-if="rentWire.propertyType !== 'Bare Land' && rentWire.useCase === 'Residential'">
      <p class="text-sm">{{ rentWire.buildingType === 'Any of the above' ? 'Property' : rentWire.buildingType }} for {{ rentWire.useCase }} use</p>
      <div class="flex pt-4 space-x-2 items-center">
        <UIcon name="i-tabler:bed" class="size-6" />
        <p>{{ rentWire.roomsNo }} {{ rentWire.roomsNo === '1' ? 'room' : 'rooms' }}</p>
      </div>

      <div class="flex space-x-2 items-center">
        <UIcon name="i-tabler:toilet-paper" class="size-6" />
        <p>{{ rentWire.toiletBaths }} {{ rentWire.toiletBaths === '1' ? 'toilet' : 'toilets' }}</p>
      </div>


    </div>

    <!-- This section remains the same for every Wire-->
    <div class="px-8 py-4">
      <div class="flex space-x-2 items-center mb-1 ">
        <UIcon name="i-mingcute:wallet-4-line" class="size-6" />
        <p>{{ rentWire.paymentOptions }} payment</p>
      </div>

      <div class="flex space-x-2 items-center mb-1">
        <UIcon name="i-la:money-bill-wave" class="size-6" />
        <p>₦{{ rentWire.minBudget !== undefined ?
          numberCommas(rentWire.minBudget) : 'N/A' }} - ₦{{ rentWire.maxBudget !== undefined ?
          numberCommas(rentWire.maxBudget) : 'N/A'}} </p>
      </div>
      <div class="flex space-x-2 items-center mb-1">
        <UIcon name="i-tabler:map-pin" class="size-6" />
        <span v-if="rentWire.locations && rentWire.locations.length > 0">
          {{ rentWire.locations.join(', ') }}
        </span>
        <span v-else>
          Not specified
        </span>
      </div>
    </div>

    <div class=" text-green-700 flex rounded-b-md m-1/2 items-center px-8 py-4">

      <div class="flex grow space-x-1 text-sm items-end">

        <div class="">
          <p class="text-sm"></p>
          <UBadge icon="i-la:thumbs-up" size="sm" color="primary" variant="soft">Good Budget</UBadge>
        </div>


        <UBadge icon="i-la:thumbs-down" size="sm" color="primary" variant="soft">Low Budget</UBadge>

        <UBadge icon="i-la:arrow-circle-up" size="sm" color="primary" variant="soft">Share</UBadge>
        <UBadge icon="i-la:arrow-circle-right" size="sm" color="primary" variant="soft">Respond</UBadge>
      </div>



    </div>

  </div>



</template>