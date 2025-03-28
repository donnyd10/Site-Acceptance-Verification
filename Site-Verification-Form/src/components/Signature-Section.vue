<template>
  <div
    class="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-200"
  >
    <!-- Collapsible header -->
    <button
      type="button"
      @click="expanded = !expanded"
      class="w-full text-left font-semibold p-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none flex justify-between items-center transition-colors duration-200"
    >
      <span class="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z"
            clip-rule="evenodd"
          />
        </svg>
        Signatures
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 transform transition-transform duration-200"
        :class="{ 'rotate-180': expanded }"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Content when expanded -->
    <div v-if="expanded" class="mt-4 space-y-6 animate-fade-in">
      <!-- Loop through signatures -->
      <div
        v-for="(signature, index) in signatures"
        :key="index"
        class="signature-field"
      >
        <label class="block font-medium text-gray-700 mb-2">
          {{ signatureLabels[index] || `Signature ${index + 1}` }}
          <span class="text-red-500">*</span>
        </label>

        <!-- Signature canvas -->
        <div class="relative border border-gray-300 rounded-lg bg-gray-50">
          <canvas
            :id="'signatureCanvas' + index"
            :ref="'signatureCanvas' + index"
            class="w-full h-32 touch-none cursor-crosshair"
            @mousedown="startDrawing($event, index)"
            @mousemove="draw($event, index)"
            @mouseup="endDrawing(index)"
            @mouseleave="endDrawing(index)"
            @touchstart.prevent="startDrawing($event.touches[0], index)"
            @touchmove.prevent="draw($event.touches[0], index)"
            @touchend.prevent="endDrawing(index)"
          ></canvas>

          <!-- Clear button -->
          <button
            type="button"
            @click="clearSignature(index)"
            class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors"
          >
            Clear
          </button>
        </div>

        <!-- Date input -->
        <div class="mt-3">
          <label class="block font-medium text-gray-700 mb-1">
            Date Signed
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="signature.date"
            type="date"
            class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    signatureLabels: {
      type: Array,
      default: () => [
        "Customer Signature",
        "Technician Signature",
        "Supervisor Signature",
      ],
    },
  },
  data() {
    return {
      expanded: false,
      signatures: [
        { data: null, date: "" },
        { data: null, date: "" },
        { data: null, date: "" },
      ],
      isDrawing: false,
      currentCanvasIndex: null,
      ctx: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeCanvases();
    });
  },
  methods: {
    initializeCanvases() {
      // Initialize all canvases
      this.signatures.forEach((_, index) => {
        const canvas = this.$refs[`signatureCanvas${index}`]?.[0];
        if (canvas) {
          // Set canvas dimensions
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;

          // Set drawing style
          const ctx = canvas.getContext("2d");
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
        }
      });
    },
    startDrawing(event, index) {
      const canvas = this.$refs[`signatureCanvas${index}`]?.[0];
      if (!canvas) return;

      this.isDrawing = true;
      this.currentCanvasIndex = index;
      this.ctx = canvas.getContext("2d");

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    },
    draw(event, index) {
      if (!this.isDrawing || index !== this.currentCanvasIndex) return;

      const canvas = this.$refs[`signatureCanvas${index}`]?.[0];
      if (!canvas || !this.ctx) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    },
    endDrawing(index) {
      if (this.isDrawing && index === this.currentCanvasIndex) {
        this.isDrawing = false;
        const canvas = this.$refs[`signatureCanvas${index}`]?.[0];
        if (canvas) {
          this.signatures[index].data = canvas.toDataURL();
        }
      }
    },
    clearSignature(index) {
      const canvas = this.$refs[`signatureCanvas${index}`]?.[0];
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.signatures[index].data = null;
      }
    },
    getSignatureData() {
      return this.signatures;
    },
    validate() {
      return this.signatures.every((sig) => sig.data && sig.date);
    },
  },
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.signature-field {
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}
</style>
