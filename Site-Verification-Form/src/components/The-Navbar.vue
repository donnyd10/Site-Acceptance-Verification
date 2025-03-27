<template>
  <!-- Add this right before the closing </form> tag in your template -->
  <div
    class="md:hidden fixed bottom-0 left-0 right-0 bg-slate-100 shadow-lg border-t border-gray-200 z-50"
  >
    <div class="flex justify-around items-center h-16">
      <!-- Form Button -->
      <button
        @click="$router.push('/form')"
        class="flex flex-col items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <span class="text-xs mt-1">Form</span>
      </button>

      <!-- Map Button -->
      <button
        @click="$router.push('/Map')"
        class="flex flex-col items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span class="text-xs mt-1">Map</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
