<template>
  <Combobox as="div" v-model="selectedAffiliate">
    <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">{{
        this.$props.labelString
      }}
    </ComboboxLabel>
    <div class="relative mt-2">
      <ComboboxInput
          class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          @change="query = $event.target.value" :display-value="(affiliate) => affiliate?.name"/>
      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
      </ComboboxButton>

      <ComboboxOptions v-if="filteredAffiliate.length > 0"
                       class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        <ComboboxOption v-for="affiliate in filteredAffiliate" :key="affiliate.id" :value="affiliate" as="template"
                        v-slot="{ active, selected }">
          <li :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-indigo-600 text-white' : 'text-gray-900']">
            <div class="flex">
              <span :class="['truncate', selected && 'font-semibold']">
                {{ affiliate.name }}
              </span>
              <span :class="['ml-2 truncate text-gray-500', active ? 'text-indigo-200' : 'text-gray-500']">
                {{ affiliate.name_legal }}
              </span>
            </div>

            <span v-if="selected"
                  :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-indigo-600']">
              <CheckIcon class="h-5 w-5" aria-hidden="true"/>
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>

<script>
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/vue/20/solid'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'
import getAllAffiliateList from "@/apis/affiliate/listAll";


export default {
  setup() {
    return {}
  },
  components: {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxLabel,
    ComboboxOption,
    ComboboxOptions,
    CheckIcon,
    ChevronUpDownIcon
  },
  props: {
    initialValue: {
      type: Number,
      required: false,
      default: 0
    },
    labelString: {
      type: String,
      required: false,
      default: '사업장'
    },
    requestQuery: {
      type: Object,
      required: false,
      default: null
    }
  },
  emits: ['setAffiliateId', 'setAffiliate'],
  data() {
    return {
      query: '',
      selectedAffiliate: null,
      affiliates: []
    }
  },
  async mounted() {
    this.affiliates = await getAllAffiliateList(this.$props.requestQuery)
    if (this.$props.initialValue) {
      const idx = this.affiliates.findIndex((affiliate) => {return affiliate.id === this.$props.initialValue})
      if (idx > -1) {
        this.selectedAffiliate = this.affiliates[idx]
      }
    }
  },
  watch: {
    selectedAffiliate(newValue, oldValue) {
      if (newValue?.id === oldValue?.id) return null
      const returnValue = newValue.id ? newValue.id : ""
      this.$emit('setAffiliateId', returnValue)
      this.$emit('setAffiliate', newValue)
      return returnValue
    }
  },
  computed: {
    filteredAffiliate() {
      return this.query === '' ? this.affiliates : this.affiliates.filter((affiliate) => {
        return affiliate.name.toLowerCase().includes(this.query.toLowerCase()) || affiliate.name_legal.toLowerCase().includes(this.query.toLowerCase())
      })
    }
  }
}

// const affiliates = [
//   { name: 'Leslie Alexander', name_legal: '@lesliealexander' },
//   // More users...
// ]
//
//
// const filteredAffiliate = computed(() =>
//
// )
</script>