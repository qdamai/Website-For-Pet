<template>
  <div class="min-h-screen bg-[#f8fafc] pb-20">
    <header class="bg-white p-4 flex items-center border-b border-[#e2e8f0] sticky top-0 z-50">
      <button @click="$router.push('/dashboard')" class="p-2 mr-4 text-[#64748b] hover:bg-[#f1f5f9] rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <h1 class="text-xl font-bold text-[#334155]">Daftar Hewan Hilang</h1>
    </header>

    <div class="p-6 max-w-5xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <Input placeholder="Cari nama, jenis, atau lokasi..." class="max-w-xs" />
        <Button variant="danger" size="sm" @click="$router.push('/report-lost')">+ Lapor</Button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card v-for="pet in store.lostPets" :key="pet.id" class="p-0 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
          <div class="h-48 bg-[#fde68a] bg-cover bg-center" :style="{ backgroundImage: `url(${pet.photo || getPetFallbackImage(pet.type)})` }">
          </div>
          <div class="p-5">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-xl text-[#334155]">{{ pet.name }}</h3>
              <span class="bg-[#fee2e2] text-[#991b1b] text-xs font-bold px-3 py-1 rounded-full">{{ pet.status }}</span>
            </div>
            <p class="text-sm text-[#64748b] mb-2 font-medium">{{ pet.type }} • {{ pet.breed }} • {{ pet.color }}</p>
            <p class="text-sm font-semibold text-[#475569] mb-4">📍 {{ pet.location || pet.lastLocation }}</p>
            
            <Button variant="white" block size="sm" @click="$router.push(`/pet/lost/${pet.id}`)">Lihat Detail</Button>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePetStore } from '../stores/petStore'
import { getPetFallbackImage } from '../utils/helpers'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'

const store = usePetStore()
</script>
