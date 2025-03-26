<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <!-- Success Icon -->
        <div
          class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100"
        >
          <svg
            class="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <!-- Success Message -->
        <h2 class="mt-3 text-center text-3xl font-extrabold text-gray-900">
          Form Submitted Successfully!
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Thank you for your submission. Your site acceptance verification has
          been received.
        </p>

        <!-- Additional Info (optional) -->
        <!-- <div class="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-blue-700">
                  Your submission reference: <span class="font-medium">#{{ submissionId }}</span>
                </p>
              </div>
            </div>
          </div> -->
      </div>

      <!-- Action Buttons -->
      <div
        class="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center"
      >
        <button
          @click="submitAnotherForm"
          class="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Another Form
        </button>

        <!-- <button
            @click="goToDashboard"
            class="w-full sm:w-auto flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Dashboard
          </button> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubmissionSuccess",
  data() {
    return {
      submissionId: this.generateId(),
    };
  },
  methods: {
    generateId() {
      // Generate a random reference ID
      return Math.random().toString(36).substring(2, 10).toUpperCase();
    },
    submitAnotherForm() {
      // Navigate back to the form
      this.$router.push("/form"); // Update with your form route
    },
    goToDashboard() {
      // Navigate to dashboard
      this.$router.push("/dashboard"); // Update with your dashboard route
    },
  },
};
</script>

<style scoped>
/* Animation for success checkmark */
@keyframes checkmark {
  0% {
    stroke-dashoffset: 50;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

svg path {
  stroke-dasharray: 50;
  stroke-dashoffset: 0;
  animation: checkmark 0.5s ease-in-out forwards;
}
</style>
