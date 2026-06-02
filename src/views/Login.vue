<template>
  <div class="min-h-screen flex items-center justify-center bg-[#fffbeb] p-6 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#fce7f3] rounded-full opacity-60"></div>
    <div class="absolute bottom-10 left-10 w-32 h-32 bg-[#dbeafe] rounded-full opacity-60"></div>

    <Card class="w-full max-w-md z-10 border-none">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold mb-2 text-[#78350f]">Welcome Back!</h1>
        <p class="text-[#6b7280] font-medium">Log in to help pawpaws</p>
      </div>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
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
          placeholder="Enter your password" 
        />

        <div class="text-right">
          <router-link to="/forgot-password" class="text-sm font-semibold text-[#60a5fa] hover:underline">Forgot password?</router-link>
        </div>

        <Button variant="primary" block type="submit" class="mt-2">Log In</Button>
        
        <div class="relative flex py-2 items-center">
          <div class="flex-grow border-t border-[#e5e7eb] rounded"></div>
          <span class="flex-shrink-0 mx-4 text-[#9ca3af] font-medium text-sm">OR</span>
          <div class="flex-grow border-t border-[#e5e7eb] rounded"></div>
        </div>

        <Button variant="white" block @click="handleGoogleLogin" type="button" class="flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </Button>
      </form>

      <p class="text-center mt-6 font-medium text-[#6b7280]">
        Don't have an account? 
        <router-link to="/register" class="font-bold text-[#f472b6] hover:underline">Sign up</router-link>
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
const email = ref('')
const password = ref('')

const handleLogin = () => {
  console.log('Login attempt', email.value)
  // Mock login for now
  router.push('/dashboard')
}

const handleGoogleLogin = () => {
  console.log('Google login attempt')
}
</script>
