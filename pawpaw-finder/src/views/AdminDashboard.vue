<template>
  <div class="min-h-screen bg-[#f8fafc]">
    <!-- Header -->
    <header class="bg-[#1e293b] p-4 flex justify-between items-center sticky top-0 z-50">
      <h1 class="text-xl font-bold text-white cursor-pointer" @click="$router.push('/')">Pawpaw Admin Panel</h1>
      <Button variant="white" size="sm" @click="$router.push('/login')">Logout</Button>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-[#e2e8f0] min-h-[calc(100vh-64px)] p-4 hidden md:block">
        <nav class="flex flex-col gap-2">
          <a href="#" class="p-3 bg-[#f1f5f9] text-[#0f172a] rounded-xl font-semibold">Dashboard</a>
          <a href="#" class="p-3 text-[#64748b] hover:bg-[#f1f5f9] rounded-xl font-medium">User Management</a>
          <a href="#" class="p-3 text-[#64748b] hover:bg-[#f1f5f9] rounded-xl font-medium">Reports</a>
          <a href="#" class="p-3 text-[#64748b] hover:bg-[#f1f5f9] rounded-xl font-medium">AI Matches</a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-[#1e293b]">System Overview</h2>
          
          <!-- Database Seeding Panel -->
          <div class="bg-white p-2 rounded-xl shadow-sm border border-[#e2e8f0] flex items-center gap-3">
            <span class="text-sm font-semibold text-[#64748b] pl-2">Database Management:</span>
            <Button variant="primary" size="sm" @click="handleSeed" :disabled="hasSeeded">
              {{ hasSeeded ? 'Seeded Successfully' : 'Seed 15 Dummy Data' }}
            </Button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card class="shadow-sm border-none bg-white p-5">
            <p class="text-sm font-semibold text-[#64748b]">Total Users</p>
            <p class="text-3xl font-bold text-[#0f172a]">128</p>
          </Card>
          <Card class="shadow-sm border-none bg-white p-5">
            <p class="text-sm font-semibold text-[#64748b]">Active Reports</p>
            <p class="text-3xl font-bold text-[#0f172a]">{{ store.totalLost + store.totalFound }}</p>
          </Card>
          <Card class="shadow-sm border-none bg-white p-5">
            <p class="text-sm font-semibold text-[#64748b]">Reunions</p>
            <p class="text-3xl font-bold text-[#10b981]">{{ store.totalReunited }}</p>
          </Card>
          <Card class="shadow-sm border-none bg-white p-5">
            <p class="text-sm font-semibold text-[#64748b]">AI Accuracy</p>
            <p class="text-3xl font-bold text-[#6366f1]">92%</p>
          </Card>
        </div>

        <h3 class="text-xl font-bold mb-4 text-[#1e293b]">Recent AI Matches to Verify</h3>
        <Card class="shadow-sm border-none p-0 overflow-hidden">
          <table class="w-full text-left text-sm text-[#475569]">
            <thead class="bg-[#f1f5f9] text-[#334155] font-semibold">
              <tr>
                <th class="p-4">Match ID</th>
                <th class="p-4">Lost Pet Reference</th>
                <th class="p-4">Found Pet Type</th>
                <th class="p-4">Score</th>
                <th class="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="match in store.recentMatches" :key="match.id" class="border-b border-[#e2e8f0]">
                <td class="p-4 font-medium text-[#0f172a]">M-{{ match.id }}</td>
                <td class="p-4">{{ getLostPetName(match.matchedWithId) }}</td>
                <td class="p-4">{{ match.type }} • {{ match.color }}</td>
                <td class="p-4">
                  <span :class="['px-3 py-1 rounded-full font-bold text-xs', match.matchScore > 90 ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fef3c7] text-[#92400e]']">
                    {{ match.matchScore }}%
                  </span>
                </td>
                <td class="p-4 flex gap-2">
                  <Button variant="success" size="sm">Approve</Button>
                  <Button variant="white" size="sm" class="text-red-500 border-red-200 hover:bg-red-50">Reject</Button>
                </td>
              </tr>
              <tr v-if="store.recentMatches.length === 0">
                <td colspan="5" class="p-8 text-center text-gray-500">No matches pending verification. Seed data to test.</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePetStore } from '../stores/petStore'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'

const store = usePetStore()
const hasSeeded = ref(false)

const handleSeed = () => {
  store.seedDummyData()
  hasSeeded.value = true
}

const getLostPetName = (id) => {
  if (!id) return 'Unknown'
  const pet = store.lostPets.find(p => p.id === id)
  return pet ? `${pet.name} (${pet.type})` : 'Unknown'
}
</script>
