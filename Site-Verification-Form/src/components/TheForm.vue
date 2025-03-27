<template>
  <div
    class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8"
  >
    <!-- Form container -->
    <div
      class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100"
    >
      <!-- Form header with accent bar -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 py-4 px-6">
        <h2 class="text-2xl font-bold text-white">
          Site Acceptance Verification
        </h2>
        <p class="text-blue-100">Please complete all required fields</p>
      </div>

      <!-- Form content -->
      <form @submit.prevent="submitForm" class="p-6 space-y-6">
        <!-- General Installation Section -->
        <div
          class="bg-blue-50 rounded-lg border border-blue-100 overflow-hidden"
        >
          <button
            @click="toggleGeneralDetails"
            type="button"
            class="w-full flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium"
          >
            <div class="flex items-center">
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Section 1: General Installation Details</span>
            </div>
            <svg
              class="w-5 h-5 transform transition-transform"
              :class="{ 'rotate-180': generalDetailsExpanded }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          <div
            v-if="generalDetailsExpanded"
            class="p-4 space-y-4 animate-fade-in"
          >
            <!-- Loop through general details fields -->
            <div v-for="(field, key) in generalDetails" :key="key" class="mb-4">
              <!-- Field label with required asterisk (except for GPS) -->
              <label class="block font-medium text-gray-700 mb-1">
                {{ field.label }}
                <span v-if="field.type !== 'gps'" class="text-red-500">*</span>
              </label>

              <!-- Special handling for GPS fields -->
              <div v-if="field.type === 'gps'" class="space-y-3">
                <div class="flex space-x-4">
                  <!-- Latitude input -->
                  <div class="w-full">
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Latitude</label
                    >
                    <div class="relative">
                      <input
                        v-model="field.latitude"
                        type="text"
                        class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        :class="{
                          'border-red-500': errors.generalDetails.latitude,
                        }"
                        readonly
                        placeholder="Fetching location..."
                      />
                      <!-- Refresh location button -->
                      <button
                        @click="getUserLocation"
                        type="button"
                        class="absolute right-2 top-2 p-1 text-blue-600 hover:text-blue-800"
                        title="Refresh location"
                      >
                        <svg
                          class="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <!-- Error message for latitude -->
                    <p
                      v-if="errors.generalDetails.latitude"
                      class="text-red-500 text-sm mt-1"
                    >
                      {{ errors.generalDetails.latitude }}
                    </p>
                  </div>

                  <!-- Longitude input -->
                  <div class="w-full">
                    <label class="block text-sm font-medium text-gray-600 mb-1"
                      >Longitude</label
                    >
                    <input
                      v-model="field.longitude"
                      type="text"
                      class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      :class="{
                        'border-red-500': errors.generalDetails.longitude,
                      }"
                      readonly
                    />
                    <!-- Error message for longitude -->
                    <p
                      v-if="errors.generalDetails.longitude"
                      class="text-red-500 text-sm mt-1"
                    >
                      {{ errors.generalDetails.longitude }}
                    </p>
                  </div>
                </div>
                <!-- Map component container -->
                <div class="bg-gray-100 rounded-lg p-2 border border-gray-200">
                  <the-map
                    :lat="field.latitude"
                    :lng="field.longitude"
                  ></the-map>
                </div>
              </div>

              <!-- Regular input fields (non-GPS) -->
              <div v-else>
                <input
                  v-model="field.value"
                  :type="field.type || 'text'"
                  class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  :class="{ 'border-red-500': errors.generalDetails[key] }"
                  :placeholder="`Enter ${field.label.toLowerCase()}`"
                />
                <!-- Error message for regular fields -->
                <p
                  v-if="errors.generalDetails[key]"
                  class="text-red-500 text-sm mt-1"
                >
                  {{ errors.generalDetails[key] }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Verification Sections -->
        <div
          v-for="(section, sectionKey) in sections"
          :key="sectionKey"
          class="bg-blue-50 rounded-lg border border-blue-100 overflow-hidden"
        >
          <button
            @click="toggleSection(sectionKey)"
            type="button"
            class="w-full flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium"
          >
            <div class="flex items-center">
              <svg
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>{{ section.label }}</span>
            </div>
            <svg
              class="w-5 h-5 transform transition-transform"
              :class="{ 'rotate-180': section.expanded }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          <div v-if="section.expanded" class="p-4 space-y-4 animate-fade-in">
            <!-- Loop through section fields -->
            <div
              v-for="(field, key) in section.fields"
              :key="key"
              class="mb-4 p-3 bg-white rounded-lg"
            >
              <label class="block font-medium text-gray-700 mb-2">
                {{ field.label }}
                <span class="text-red-500">*</span>
              </label>
              <!-- Yes/No radio buttons -->
              <div class="flex items-center space-x-6">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    v-model="field.value"
                    :value="'Yes'"
                    class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-gray-700">Yes</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    v-model="field.value"
                    :value="'No'"
                    class="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-gray-700">No</span>
                </label>
              </div>
              <!-- Field error message -->
              <p
                v-if="errors[sectionKey]?.fields?.[key]"
                class="text-red-500 text-sm mt-1"
              >
                {{ errors[sectionKey]?.fields?.[key] }}
              </p>
            </div>

            <!-- Additional Notes Fields -->
            <div v-if="sectionKey === 'physicalVerification'" class="mt-4">
              <label class="block font-medium text-gray-700 mb-2">
                <svg
                  class="w-5 h-5 inline-block mr-1 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                Additional Notes
              </label>
              <textarea
                v-model="section.notes"
                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="4"
                placeholder="Enter any additional details here..."
              ></textarea>
            </div>

            <!-- Communication Integration Notes -->
            <div v-if="sectionKey === 'communicationIntegration'" class="mt-4">
              <label class="block font-medium text-gray-700 mb-2">
                <svg
                  class="w-5 h-5 inline-block mr-1 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  ></path>
                </svg>
                Communication Notes
              </label>
              <textarea
                v-model="section.communicationNotes"
                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="4"
                placeholder="Enter any communication-related details here..."
              ></textarea>
            </div>

            <!-- Customer Engagement Notes -->
            <div v-if="sectionKey === 'customerEngagement'" class="mt-4">
              <label class="block font-medium text-gray-700 mb-2">
                <svg
                  class="w-5 h-5 inline-block mr-1 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                Engagement Notes
              </label>
              <textarea
                v-model="section.engagementNotes"
                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="4"
                placeholder="Enter any engagement-related details here..."
              ></textarea>
            </div>

            <!-- Final Acceptance Notes -->
            <div v-if="sectionKey === 'finalAcceptance'" class="mt-4">
              <label class="block font-medium text-gray-700 mb-2">
                <svg
                  class="w-5 h-5 inline-block mr-1 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Acceptance Notes
              </label>
              <textarea
                v-model="section.acceptanceNotes"
                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                rows="4"
                placeholder="Enter any acceptance-related details here..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Photo Upload Section -->
        <div class="bg-blue-50 rounded-lg border border-blue-100 p-4">
          <h3 class="flex items-center text-blue-800 font-medium mb-3">
            <svg
              class="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            Attach Photo Documentation
          </h3>

          <!-- File upload drop zone -->
          <div class="flex items-center justify-center w-full">
            <label
              class="flex flex-col w-full h-32 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-100"
            >
              <div class="flex flex-col items-center justify-center pt-7">
                <svg
                  class="h-8 w-8 text-blue-400 group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p
                  class="pt-1 text-sm tracking-wider text-blue-500 group-hover:text-blue-700"
                >
                  {{ photo ? "Change photo" : "Upload a photo" }}
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                @change="onFileChange"
                class="opacity-0"
              />
            </label>
          </div>

          <!-- Selected file name display -->
          <p v-if="photo" class="text-blue-600 text-sm mt-3 flex items-center">
            <svg
              class="h-4 w-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Selected: {{ photo.name }}
          </p>

          <!-- Image preview with remove button -->
          <div v-if="imagePreview" class="mt-4 relative inline-block">
            <img
              :src="imagePreview"
              alt="Image Preview"
              class="w-full max-w-xs h-48 object-contain rounded-lg shadow-md border border-blue-200 bg-white"
            />
            <button
              @click="removeImage"
              class="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-700 transition-colors duration-200 z-10"
              title="Remove Image"
            >
              ✕
            </button>
          </div>

          <!-- Photo upload error message -->
          <p v-if="errors.photo" class="text-red-500 text-sm mt-2">
            {{ errors.photo }}
          </p>
        </div>

        <!-- Signature Section -->
        <signature-section
          ref="signatureComponent"
          :signature-labels="[
            'Customer Signature',
            'Technician Signature',
            'Supervisor Approval',
          ]"
        ></signature-section>

        <!-- Submit Button -->
        <div class="pt-4">
          <button
            type="submit"
            class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center"
            :disabled="loading"
          >
            <span v-if="loading">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
            <span v-else class="flex items-center">
              <svg
                class="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Submit Verification
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import TheMap from "./The-Map.vue";
import TheNavbar from "./The-Navbar.vue";
import SignatureSection from "./Signature-Section.vue";

const toast = useToast();

export default {
  components: {
    TheMap,
    TheNavbar,
    SignatureSection,
  },
  data() {
    return {
      generalDetailsExpanded: false,
      loading: false,
      generalDetails: [
        { label: "Customer Name", value: "" },
        { label: "Account Number", value: "" },
        {
          label: "GPS Coordinates of Installation",
          latitude: "",
          longitude: "",
          type: "gps",
        },
        { label: "Meter Serial Number", value: "" },
        { label: "Meter Size (mm)", value: "" },
        { label: "Work Order Number", value: "" },
        { label: "Installation Date", value: "", type: "date" },
        { label: "Installed by (Contractor Name)", value: "" },
        { label: "Meter Type (AMR/AMI)", value: "" },
      ],
      photo: null,
      imagePreview: null,
      sections: {
        physicalVerification: {
          label: "Physical Site Verification",
          expanded: false,
          fields: [
            { label: "Meter installed away from vehicular access", value: "" },
            {
              label:
                "Meter accessible for Authority troubleshooting, inspection, and testing",
              value: "",
            },
            {
              label: "Secure and tamper-resistant installation location",
              value: "",
            },
            {
              label: "Adequate clearance around the meter for maintenance",
              value: "",
            },
            {
              label: "Correct flow direction (verified by markings)",
              value: "",
            },
            {
              label: "Fittings and couplings securely installed (no damage)",
              value: "",
            },

            { label: "Expansion coupling used where applicable", value: "" },
            { label: "Leak test completed and passed", value: "" },
            { label: "Shut-off valve present and functional", value: "" },
          ],
          notes: "",
        },
        communicationIntegration: {
          label: "AMR/AMI Communication & Integration",
          expanded: false,
          fields: [
            {
              label: "Communication module installed and configured",
              value: "",
            },
            {
              label: "Meter successfully communicating with vendor platform",
              value: "",
            },
            {
              label: "Data received accurately in Authority’s central system",
              value: "",
            },
            {
              label: "Meter mapped correctly to Oracle billing record",
              value: "",
            },
            { label: "Signal strength verified and acceptable", value: "" },
            {
              label: "Cellular/concentrator coverage verified (if applicable)",
              value: "",
            },
            {
              label: "Remote config confirmed (read interval, alarms, etc.)",
              value: "",
            },
          ],
          communicationNotes: "",
        },
        customerEngagement: {
          label: "Customer Engagement & Documentation",
          expanded: false,
          fields: [
            { label: "Customer notified before installation", value: "" },
            { label: "Customer briefed on AMI meter functionality", value: "" },
            { label: "Work order completed and documented", value: "" },
            {
              label: "Photos of meter, site, and serial number taken",
              value: "",
            },
            {
              label: "Data submitted to NIO/Commercial in Excel Tracker",
              value: "",
            },
            {
              label: "Work order copy given to customer (if applicable)",
              value: "",
            },
          ],
          engagementNotes: "",
        },
        finalAcceptance: {
          label: "Final Acceptance",
          expanded: false,
          fields: [
            { label: "Installation meets all required standards", value: "" },
            { label: "Site accepted for operational handover", value: "" },
          ],
          acceptanceNotes: "",
        },
      },
      errors: {
        generalDetails: {},
        photo: "",
        physicalVerification: { fields: {} },
        communicationIntegration: { fields: {} },
        customerEngagement: { fields: {} },
        finalAcceptance: { fields: {} },
      },
    };
  },
  mounted() {
    this.getUserLocation();
  },
  methods: {
    toggleGeneralDetails() {
      this.generalDetailsExpanded = !this.generalDetailsExpanded;
    },
    toggleSection(sectionKey) {
      this.sections[sectionKey].expanded = !this.sections[sectionKey].expanded;
    },
    updateCoordinates(location) {
      this.generalDetails[2].latitude = location.lat.toFixed(6);
      this.generalDetails[2].longitude = location.lng.toFixed(6);
    },
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.generalDetails[2].latitude =
              position.coords.latitude.toFixed(6);
            this.generalDetails[2].longitude =
              position.coords.longitude.toFixed(6);
          },
          () => {
            console.error("Geolocation permission denied.");
          }
        );
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.photo = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    removeImage() {
      this.photo = null;
      this.imagePreview = null;
    },
    validateForm() {
      let isValid = true;
      this.errors = {
        generalDetails: {},
        photo: "",
        physicalVerification: { fields: {} },
        communicationIntegration: { fields: {} },
        customerEngagement: { fields: {} },
        finalAcceptance: { fields: {} },
      };

      this.generalDetails.forEach((field, index) => {
        if (field.type === "gps") {
          if (!field.latitude || !field.longitude) {
            if (!field.latitude) {
              this.errors.generalDetails.latitude = "Latitude is required.";
              toast.error("Latitude is required.");
              isValid = false;
            }
            if (!field.longitude) {
              this.errors.generalDetails.longitude = "Longitude is required.";
              toast.error("Longitude is required.");
              isValid = false;
            }
          }
        } else if (!field.value) {
          this.errors.generalDetails[index] = "This field is required.";
          toast.error(`${field.label} is required.`);
          isValid = false;
        }
      });

      Object.keys(this.sections).forEach((sectionKey) => {
        const section = this.sections[sectionKey];
        section.fields.forEach((field, index) => {
          if (!field.value) {
            this.errors[sectionKey].fields[index] = "This field is required.";
            toast.error(`${field.label} in ${section.label} is required.`);
            isValid = false;
          }
        });
      });

      return isValid;
    },
    submitForm() {
      if (!this.$refs.signatureComponent.validate()) {
        toast.error("Please complete all signature fields");
        return;
      }

      const signatureData = this.$refs.signatureComponent.getSignatureData();
      const formData = {
        signatures: signatureData,
      };

      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      setTimeout(() => {
        console.log(
          "Form submitted",
          this.generalDetails,
          this.sections,
          this.photo
        );
        this.loading = false;
        this.$router.push("/Submitted");
      }, 1000);
    },
  },
};
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 4px;
}

/* Textarea specific scrollbar */
textarea {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #e5e7eb;
}
textarea::-webkit-scrollbar-track {
  background: #e5e7eb;
  border-radius: 4px;
}
textarea::-webkit-scrollbar-thumb {
  background-color: #3b82f6;
  border-radius: 4px;
}
</style>
