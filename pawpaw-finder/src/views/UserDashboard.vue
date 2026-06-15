<template>
  <div class="min-h-screen bg-[#f8fafc] pb-20">
    <!-- Header -->
    <header class="bg-white p-6 flex justify-between items-center border-b border-[#e2e8f0] sticky top-0 z-50">
      <h1 class="text-2xl font-bold text-[#334155] cursor-pointer" @click="$router.push('/dashboard')">Pawpaw Finder</h1>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-[#fef3c7] rounded-full flex items-center justify-center font-bold text-[#92400e] cursor-pointer shadow-sm hover:shadow-md transition-shadow">
          U
        </div>
      </div>
    </header>

    <div class="p-6 max-w-5xl mx-auto">
      <!-- Stats Overview -->
      <h2 class="text-2xl font-bold mb-6 text-[#1e293b]">Dashboard</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card class="bg-[#fce7f3] border-none shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1" @click="$router.push('/lost-feed')">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#be185d]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-[#831843]">Total Hilang</p>
            <p class="text-3xl font-bold text-[#831843]">{{ store.totalLost }}</p>
          </div>
        </Card>
        
        <Card class="bg-[#dcfce7] border-none shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1" @click="$router.push('/found-feed')">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#15803d]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-[#14532d]">Ditemukan</p>
            <p class="text-3xl font-bold text-[#14532d]">{{ store.totalFound }}</p>
          </div>
        </Card>
        
        <Card class="bg-[#fef3c7] border-none shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#b45309]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-[#78350f]">Dipertemukan</p>
            <p class="text-3xl font-bold text-[#78350f]">{{ store.totalReunited }}</p>
          </div>
        </Card>
      </div>

      <!-- Quick Actions -->
      <h2 class="text-2xl font-bold mb-6 text-[#1e293b]">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <Button variant="danger" size="lg" class="flex flex-col items-center gap-3 py-6" @click="$router.push('/report-lost')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <span>Lapor Hewan Hilang</span>
        </Button>
        <Button variant="success" size="lg" class="flex flex-col items-center gap-3 py-6" @click="$router.push('/report-found')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
          <span>Lapor Hewan Ditemukan</span>
        </Button>
      </div>

      <!-- Recent Reports Feed -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-[#1e293b]">Laporan Terbaru</h2>
        <a href="#" class="font-semibold text-[#60a5fa] hover:underline" @click.prevent="$router.push('/lost-feed')">Lihat Semua</a>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card v-for="pet in store.lostPets.slice(0, 3)" :key="pet.id" class="p-0 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
          <div class="h-40 bg-[#fde68a] bg-cover bg-center" :style="{ backgroundImage: `url(${pet.photo || getPetFallbackImage(pet.type)})` }">
          </div>
          <div class="p-5">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-xl text-[#334155]">{{ pet.name }}</h3>
              <span class="bg-[#fee2e2] text-[#991b1b] text-xs font-bold px-3 py-1 rounded-full">Missing</span>
            </div>
            <p class="text-sm text-[#64748b] mb-2 font-medium">{{ pet.type }} • {{ pet.breed }} • {{ pet.color }}</p>
            <p class="text-sm font-semibold text-[#475569] truncate"><MapPin :size="18" class="inline" /> {{ pet.location || pet.lastLocation }}</p>
            
            <Button variant="white" block size="sm" class="mt-5" @click="$router.push(`/pet/lost/${pet.id}`)">Lihat Detail</Button>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FileText, MessageSquare, MapPin, Settings, Home, Camera, Calendar, PawPrint, Dog, Cat, AlertTriangle, XCircle, CheckCircle, Target, Heart, BarChart2, Dna, Cake, Scale, Sun, Moon } from 'lucide-vue-next';
import { usePetStore } from '../stores/petStore'
import { getPetFallbackImage } from '../utils/helpers'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'

const store = usePetStore()
</script>
