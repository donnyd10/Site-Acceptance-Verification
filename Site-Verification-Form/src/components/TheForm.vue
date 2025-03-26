<template>
  <!-- Main form container with gradient background, shadow, and rounded corners -->
  <form
    @submit.prevent="submitForm"  
    class="p-6 max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-gray-50 shadow-xl rounded-xl border border-gray-200"
  >
    <!-- Form header section -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold mb-2 text-blue-800">
        Site Acceptance Verification
      </h2>
      <p class="text-gray-600">Please fill out all required fields</p>
    </div>

    <!-- General Installation Details Section (Collapsible) -->
    <div class="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-200">
      <!-- Collapsible section header button -->
      <button
        type="button"
        @click="toggleGeneralDetails"  
        class="w-full text-left font-semibold p-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none flex justify-between items-center transition-colors duration-200"
      >
        <span class="flex items-center">
          <!-- Information icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          Section 1: General Installation Details
        </span>
        <!-- Chevron icon that rotates when expanded -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform transition-transform duration-200" 
             :class="{ 'rotate-180': generalDetailsExpanded }" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>

      <!-- Content that shows when section is expanded -->
      <div v-if="generalDetailsExpanded" class="mt-4 space-y-4 animate-fade-in">
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
                <label class="block text-sm font-medium text-gray-600 mb-1">Latitude</label>
                <div class="relative">
                  <input
                    v-model="field.latitude"
                    type="text"
                    class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    :class="{ 'border-red-500': errors.generalDetails.latitude }"
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
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </div>
                <!-- Error message for latitude -->
                <p v-if="errors.generalDetails.latitude" class="text-red-500 text-sm mt-1">
                  {{ errors.generalDetails.latitude }}
                </p>
              </div>
              
              <!-- Longitude input -->
              <div class="w-full">
                <label class="block text-sm font-medium text-gray-600 mb-1">Longitude</label>
                <input
                  v-model="field.longitude"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  :class="{ 'border-red-500': errors.generalDetails.longitude }"
                  readonly
                />
                <!-- Error message for longitude -->
                <p v-if="errors.generalDetails.longitude" class="text-red-500 text-sm mt-1">
                  {{ errors.generalDetails.longitude }}
                </p>
              </div>
            </div>
            <!-- Map component container -->
            <div class="bg-gray-100 rounded-lg p-2 border border-gray-200">
              <the-map :lat="field.latitude" :lng="field.longitude"></the-map>
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
            <p v-if="errors.generalDetails[key]" class="text-red-500 text-sm mt-1">
              {{ errors.generalDetails[key] }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Verification Sections (loop over different sections) -->
    <div
      v-for="(section, sectionKey) in sections"
      :key="sectionKey"
      class="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-200"
    >
      <!-- Section header button -->
      <button
        type="button"
        @click="toggleSection(sectionKey)"
        class="w-full text-left font-semibold p-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none flex justify-between items-center transition-colors duration-200"
      >
        <span class="flex items-center">
          <!-- Checkmark icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          {{ section.label }}
        </span>
        <!-- Chevron icon that rotates when expanded -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform transition-transform duration-200"
             :class="{ 'rotate-180': section.expanded }" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>

      <!-- Section content that shows when expanded -->
      <div v-if="section.expanded" class="mt-4 space-y-4 animate-fade-in">
        <!-- Loop through section fields -->
        <div v-for="(field, key) in section.fields" :key="key" class="mb-4 p-3 bg-gray-50 rounded-lg">
          <label class="block font-medium text-gray-700 mb-2">
            {{ field.label }}
            <span class="text-red-500">*</span>  <!-- Required field indicator -->
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
          <p v-if="errors[sectionKey]?.fields?.[key]" class="text-red-500 text-sm mt-1">
            {{ errors[sectionKey]?.fields?.[key] }}
          </p>
        </div>

        <!-- Additional Notes Fields (specific to each section) -->
        <!-- Physical Verification Notes -->
        <div v-if="sectionKey === 'physicalVerification'" class="mt-4">
          <label class="block font-medium text-gray-700 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
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
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd"/>
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
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z"/>
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
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
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
    <div class="mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <label class="block font-medium text-gray-700 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
        </svg>
        Attach a Photo
      </label>

      <!-- File upload drop zone -->
      <div class="flex items-center justify-center w-full">
        <label class="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-50">
          <div class="flex flex-col items-center justify-center pt-7">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
              {{ photo ? "Change photo" : "Upload a photo" }}
            </p>
          </div>
          <!-- Hidden file input -->
          <input type="file" accept="image/*" @change="onFileChange" class="opacity-0"/>
        </label>
      </div>

      <!-- Selected file name display -->
      <p v-if="photo" class="text-gray-600 text-sm mt-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
        </svg>
        Selected: {{ photo.name }}
      </p>

      <!-- Image preview with remove button -->
      <div v-if="imagePreview" class="mt-4 relative inline-block">
        <img
          :src="imagePreview"
          alt="Image Preview"
          class="w-full max-w-xs h-48 object-contain rounded-lg shadow-md border border-gray-200 bg-white"
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

    <!-- Form submit button -->
    <div class="mt-8">
      <button
        type="submit"
        class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center"
        :disabled="loading"
      >
        <!-- Loading spinner when submitting -->
        <span v-if="loading">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
        <!-- Normal submit button content -->
        <span v-else class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          Submit Verification
        </span>
      </button>
    </div>
  </form>
</template>

<script>
import TheMap from "./The-Map.vue";

export default {
  components: {
    TheMap,  // Import and register the map component
  },

  data() {
    return {
      generalDetailsExpanded: false,  // Controls if general details section is expanded
      loading: false,  // Loading state for form submission
      
      // Array of general details fields with initial values
      generalDetails: [
        { label: "Customer Name", value: "" },
        { label: "Account Number", value: "" },
        { label: "GPS Coordinates of Installation", latitude: "", longitude: "", type: "gps" },
        { label: "Meter Serial Number", value: "" },
        { label: "Meter Size (mm)", value: "" },
        { label: "Work Order Number", value: "" },
        { label: "Installation Date", value: "", type: "date" },
        { label: "Installed by (Contractor Name)", value: "" },
        { label: "Meter Type (AMR/AMI)", value: "" },
      ],
      
      photo: null,  // Stores the selected photo file
      imagePreview: null,  // Stores URL for image preview
      
      // Object containing all verification sections and their fields
      sections: {
        physicalVerification: {
          label: "Physical Site Verification",
          expanded: false,
          fields: [
            { label: "Meter installed away from vehicular access", value: "" },
            { label: "Meter accessible for troubleshooting", value: "" },
            { label: "Secure and tamper-resistant installation location", value: "" },
            { label: "Adequate clearance around the meter", value: "" },
            { label: "Correct flow direction (verified by markings)", value: "" },
            { label: "Expansion coupling used where applicable", value: "" },
            { label: "Leak test completed and passed", value: "" },
            { label: "Shut-off valve present and functional", value: "" },
          ],
          notes: "",  // Additional notes for this section
        },
        communicationIntegration: {
          label: "AMR/AMI Communication & Integration",
          expanded: false,
          fields: [
            { label: "Communication module installed and configured", value: "" },
            { label: "Meter successfully communicating with vendor platform", value: "" },
            { label: "Data received accurately in central system", value: "" },
            { label: "Meter mapped correctly to Oracle billing record", value: "" },
            { label: "Signal strength verified and acceptable", value: "" },
            { label: "Cellular/concentrator coverage verified (if applicable)", value: "" },
            { label: "Remote config confirmed (read interval, alarms, etc.)", value: "" },
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
            { label: "Photos of meter, site, and serial number taken", value: "" },
            { label: "Data submitted to NIO/Commercial in Excel Tracker", value: "" },
            { label: "Work order copy given to customer (if applicable)", value: "" },
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
      
      // Object to store validation errors
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

  // Lifecycle hook - runs when component is mounted to DOM
  mounted() {
    this.getUserLocation();  // Get user's current location when component loads
  },

  methods: {
    // Toggle general details section expand/collapse
    toggleGeneralDetails() {
      this.generalDetailsExpanded = !this.generalDetailsExpanded;
    },

    // Toggle specific section expand/collapse
    toggleSection(sectionKey) {
      this.sections[sectionKey].expanded = !this.sections[sectionKey].expanded;
    },

    // Update GPS coordinates (used by map component)
    updateCoordinates(location) {
      this.generalDetails[2].latitude = location.lat.toFixed(6);
      this.generalDetails[2].longitude = location.lng.toFixed(6);
    },

    // Get user's current location using browser geolocation API
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Update latitude and longitude in generalDetails
            this.generalDetails[2].latitude = position.coords.latitude.toFixed(6);
            this.generalDetails[2].longitude = position.coords.longitude.toFixed(6);
          },
          () => {
            console.error("Geolocation permission denied.");
          }
        );
      }
    },

    // Handle file selection for photo upload
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.photo = file;
        this.imagePreview = URL.createObjectURL(file);  // Create preview URL
      }
    },

    // Remove selected image
    removeImage() {
      this.photo = null;
      this.imagePreview = null;
    },

    // Validate form fields
    validateForm() {
      let isValid = true;
      // Reset errors object
      this.errors = {
        generalDetails: {},
        photo: "",
        physicalVerification: { fields: {} },
        communicationIntegration: { fields: {} },
        customerEngagement: { fields: {} },
        finalAcceptance: { fields: {} },
      };

      // Validate General Details
      this.generalDetails.forEach((field, index) => {
        if (field.type === "gps") {
          // Validate GPS coordinates
          if (!field.latitude || !field.longitude) {
            if (!field.latitude) {
              this.errors.generalDetails.latitude = "Latitude is required.";
              isValid = false;
            }
            if (!field.longitude) {
              this.errors.generalDetails.longitude = "Longitude is required.";
              isValid = false;
            }
          }
        } else if (!field.value) {
          // Validate other required fields
          this.errors.generalDetails[index] = "This field is required.";
          isValid = false;
        }
      });

      // Photo validation (currently commented out)
      // if (!this.photo) {
      //   this.errors.photo = "Photo is required.";
      //   isValid = false;
      // }

      return isValid;
    },

    // Handle form submission
    submitForm() {
      // Don't submit if validation fails
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;  // Show loading state
      
      // Simulate form submission with timeout
      setTimeout(() => {
        console.log("Form submitted", this.generalDetails, this.sections, this.photo);
        this.loading = false;
        
        // Redirect to submitted page
        this.$router.push("/Submitted");
      }, 1000);
    },
  },
};
</script>

<style>
/* Animation for expanding sections */
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

/* Custom scrollbar styles for textareas */
textarea {
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #e5e7eb;
}

textarea::-webkit-scrollbar {
  width: 8px;
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