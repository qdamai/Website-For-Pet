<template>
  <div class="min-h-screen bg-[#fdf2f8] p-6 flex flex-col items-center justify-center relative overflow-hidden">
    <div class="absolute top-20 left-10 w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center text-3xl font-bold text-[#f472b6] opacity-50">1</div>
    <div class="absolute top-1/2 right-10 w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-3xl font-bold text-[#60a5fa] opacity-50">2</div>
    <div class="absolute bottom-20 left-20 w-32 h-32 bg-white rounded-full shadow-sm flex items-center justify-center text-4xl font-bold text-[#4ade80] opacity-50">3</div>
    
    <div class="z-10 text-center max-w-4xl w-full">
      <h1 class="text-4xl font-bold mb-12 text-[#831843]">How it works</h1>
      
      <div class="grid gap-6 md:grid-cols-3 mb-12">
        <Card class="flex flex-col items-center text-center border-none" noShadow>
          <div class="w-20 h-20 bg-[#fef3c7] rounded-full mb-6 flex items-center justify-center text-[#d97706] shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h3 class="font-bold text-xl mb-3 text-[#78350f]">Report Lost Pet</h3>
          <p class="text-sm font-medium text-[#6b7280]">Fill in the details and last seen location of your missing pawpaw.</p>
        </Card>
        
        <Card class="flex flex-col items-center text-center border-none" noShadow>
          <div class="w-20 h-20 bg-[#e0e7ff] rounded-full mb-6 flex items-center justify-center text-[#4338ca] shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
          </div>
          <h3 class="font-bold text-xl mb-3 text-[#1e3a8a]">Found a Pet?</h3>
          <p class="text-sm font-medium text-[#6b7280]">Snap a photo and share the location to help them find their way home.</p>
        </Card>
        
        <Card class="flex flex-col items-center text-center border-none" noShadow>
          <div class="w-20 h-20 bg-[#dcfce7] rounded-full mb-6 flex items-center justify-center text-[#15803d] shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <h3 class="font-bold text-xl mb-3 text-[#14532d]">Reunite</h3>
          <p class="text-sm font-medium text-[#6b7280]">Our AI matching and community will help bring pets back to their families.</p>
        </Card>
      </div>
      
      <Button variant="primary" size="lg" @click="$router.push('/')">Got it, let's go!</Button>
    </div>
  </div>
</template>

<script setup>
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
</script>
