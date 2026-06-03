<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f0fdf4] p-6 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute top-10 right-10 w-48 h-48 bg-[#dcfce7] rounded-full opacity-60"></div>
    <div class="absolute bottom-[-20px] left-[-20px] w-64 h-64 bg-[#fef3c7] rounded-full opacity-60"></div>

    <Card class="w-full max-w-md z-10 border-none">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold mb-2 text-[#14532d]">Join Us!</h1>
        <p class="text-[#6b7280] font-medium">Create an account to report pets</p>
      </div>

      <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
        <Input 
          v-model="fullname" 
          type="text" 
          label="Full Name" 
          placeholder="Enter your name" 
        />
        <Input 
          v-model="phone" 
          type="text" 
          label="Phone Number" 
          placeholder="Enter your phone number" 
        />
        <Input 
          v-model="email" 
          type="email" 
          label="Email Address" 
          placeholder="Enter your email" 
        />
        <Input 
          v-model="password" 
          type="password" 
          label="Password" 
          placeholder="Create a password" 
        />

        <Button variant="success" block type="submit" class="mt-4">Sign Up</Button>
      </form>

      <p class="text-center mt-6 font-medium text-[#6b7280]">
        Already have an account? 
        <router-link to="/login" class="font-bold text-[#60a5fa] hover:underline">Log in</router-link>
      </p>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Card from '../components/ui/Card.vue'
import Input from '../components/ui/Input.vue'
import Button from '../components/ui/Button.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fullname = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')

const handleRegister = () => {
  console.log('Register attempt', email.value)
  // Mock register for now
  router.push('/dashboard')
}
</script>
