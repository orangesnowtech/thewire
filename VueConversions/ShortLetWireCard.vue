<template>
  <div class="px-8 pt-4">
    <div id="heading" class="flex items-top">
      <div class="grow">
        <p class="text-lg font-bold">{{ shortLetWire?.requestType }}</p>

      </div>
      <p class="text-[12px]">ID: {{ shortLetWire?.requestID }}</p>
    </div>

    <div class="flex grow  flex-col">

      <p class="text-sm">{{ shortLetWire?.buildingType }} for {{ shortLetWire?.useCase }} use</p>

      <div class="">

        <div class="flex space-x-2 pt-4 items-center ">
          <UIcon name="i-tabler:home-2" class="size-6" />
          <p>{{ shortLetWire?.shortLetUnits }} Units</p>
        </div>
        <div class="flex space-x-2 items-center">
          <UIcon name="i-tabler:bed" class="size-6" />
          <p>{{ shortLetWire?.roomsNo }} Bedrooms</p>
        </div>

        <div class="flex space-x-2 items-center">
          <UIcon name="i-tabler:toilet-paper" class="size-6" />
          <p>{{ shortLetWire?.toiletBaths }} {{ shortLetWire?.toiletBaths === '1' ? 'Toilet' : 'Toilets' }}</p>
        </div>



      </div>

      <div class="py-4">

        <div class="flex space-x-2 items-center mb-1">
          <UIcon name="i-tabler:calendar-week-filled" class="size-6" />
          <p>{{ formatDate( shortLetWire?.checkInDate) }} - {{ formatDate(shortLetWire?.checkOutDate) }}</p>


        </div>

        <div class="flex space-x-2 items-center mb-1">
          <UIcon name="i-la:money-bill-wave" class="size-6" />
          <p>₦{{ shortLetWire?.minBudget !== undefined ?
            numberCommas(shortLetWire?.minBudget) : 'N/A' }} - ₦{{ shortLetWire?.maxBudget !== undefined ?
              numberCommas(shortLetWire?.maxBudget) : 'N/A' }}/<span class="text-sm">day</span> </p>
        </div>
        <div class="flex space-x-2 items-center mb-1">
          <UIcon name="i-tabler:map-pin" class="size-6" />
          <span v-if="shortLetWire?.locations && shortLetWire?.locations.length > 0">
            {{ shortLetWire?.locations.join(', ') }}
          </span>
          <span v-else>
            Not specified
          </span>
        </div>
      </div>
    </div>

       <div class=" text-green-700 justify-center flex px-8 space-x-2 rounded-b-md items-center py-4">
      <WireLikeDislike
        :wireId="shortLetWire?.requestID || ''"
        :goodBudget="shortLetWire?.goodBudget || []"
        :lowBudget="shortLetWire?.lowBudget || []"
      />
      <div class="flex space-x-2  justify-center text-sm items-center">
        <UBadge icon="i-tabler:rocket" size="md" color="primary" variant="soft">Share</UBadge>
        <UBadge icon="i-tabler:paperclip" size="md" color="primary" variant="soft">Respond</UBadge>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/formatDate';
import { numberCommas } from '~/utils/numberCommas';
import type {ShortLetWire } from '~/types';

const props = defineProps<{ wireDetails: Partial<ShortLetWire> | null}>();
const shortLetWire = props.wireDetails;
</script>
