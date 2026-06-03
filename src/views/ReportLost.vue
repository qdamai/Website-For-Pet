<template>
  <div class="min-h-screen bg-[#f8fafc] pb-20">
    <header class="bg-white p-4 flex items-center border-b border-[#e2e8f0] sticky top-0 z-50">
      <button @click="$router.back()" class="p-2 mr-4 text-[#64748b] hover:bg-[#f1f5f9] rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <h1 class="text-xl font-bold text-[#334155]">Lapor Hewan Hilang</h1>
    </header>

    <div class="p-6 max-w-2xl mx-auto">
      <Card>
        <form @submit.prevent="submitReport" class="flex flex-col gap-5">
          <Input v-model="form.name" label="Nama Hewan" placeholder="Contoh: Milo" required />
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="font-semibold text-[#4b5563] text-sm ml-1">Jenis Hewan</label>
              <select v-model="form.type" class="w-full px-5 py-3 rounded-2xl border border-[#f3f4f6] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] text-[#374151]">
                <option>Kucing</option>
                <option>Anjing</option>
                <option>Burung</option>
                <option>Kelinci</option>
                <option>Lainnya</option>
              </select>
            </div>
            <Input v-model="form.breed" label="Ras (Opsional)" placeholder="Contoh: Persia" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <Input v-model="form.color" label="Warna Dominan" placeholder="Contoh: Orange" required />
            <Input v-model="form.age" label="Perkiraan Umur" placeholder="Contoh: 2 Tahun" />
          </div>
          <Input v-model="form.location" label="Lokasi Terakhir Dilihat" placeholder="Contoh: Taman Kota, Padang" required />
          <Input v-model="form.dateLost" type="date" label="Tanggal Hilang" required />
          
          <div class="flex flex-col gap-1.5 w-full text-left">
            <label class="font-semibold text-[#4b5563] text-sm ml-1">Deskripsi Tambahan</label>
            <textarea v-model="form.description" rows="3" class="w-full px-5 py-3 rounded-2xl border border-[#f3f4f6] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#93c5fd] transition-all text-[#374151] placeholder-[#9ca3af]" placeholder="Ciri khusus, kalung, dll..."></textarea>
          </div>
          
          <Input v-model="form.contact" label="Nomor Kontak (WhatsApp)" placeholder="0812..." required />

          <Button variant="danger" block type="submit" class="mt-4">Kirim Laporan</Button>
        </form>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePetStore } from '../stores/petStore'
import Card from '../components/ui/Card.vue'
import Input from '../components/ui/Input.vue'
import Button from '../components/ui/Button.vue'

const router = useRouter()
const store = usePetStore()

const form = ref({
  name: '', type: 'Kucing', breed: '', color: '', age: '', location: '', dateLost: '', description: '', contact: ''
})

const submitReport = () => {
  store.addLostPet(form.value)
  alert('Laporan berhasil dikirim!')
  router.push('/dashboard')
}
</script>
