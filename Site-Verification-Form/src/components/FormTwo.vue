<template>
  <!-- Form element to submit the site acceptance verification -->
  <form
    @submit.prevent="submitForm"
    class="p-6 max-w-2xl mx-auto shadow-lg rounded-xl"
  >
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">
      Site Acceptance Verification
    </h2>

    <!-- General Installation Details Section (Collapsible) -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
      <button
        type="button"
        @click="toggleGeneralDetails"
        class="w-full text-left font-semibold p-3 text-black rounded-lg focus:outline-none"
      >
        Section 1: General Installation Details
      </button>

      <div v-if="generalDetailsExpanded" class="mt-3">
        <div v-for="(field, key) in generalDetails" :key="key" class="mb-3">
          <label class="block font-medium text-gray-700">{{
            field.label
          }}</label>
          <div v-if="field.type === 'gps'">
            <div class="flex space-x-4">
              <div class="w-full">
                <label class="block font-medium text-gray-700">Latitude</label>
                <input
                  v-model="field.latitude"
                  type="text"
                  class="w-full border rounded p-2 focus:ring focus:ring-blue-300"
                  :class="{ 'border-red-500': errors.generalDetails.latitude }"
                  readonly
                />
                <p
                  v-if="errors.generalDetails.latitude"
                  class="text-red-500 text-sm"
                >
                  {{ errors.generalDetails.latitude }}
                </p>
              </div>
              <div class="w-full">
                <label class="block font-medium text-gray-700">Longitude</label>
                <input
                  v-model="field.longitude"
                  type="text"
                  class="w-full border rounded p-2 focus:ring focus:ring-blue-300"
                  :class="{ 'border-red-500': errors.generalDetails.longitude }"
                  readonly
                />
                <p
                  v-if="errors.generalDetails.longitude"
                  class="text-red-500 text-sm"
                >
                  {{ errors.generalDetails.longitude }}
                </p>
              </div>
            </div>
            <!--For map-->
          </div>

          <div v-else>
            <input
              v-model="field.value"
              type="text"
              class="w-full border rounded p-2 focus:ring focus:ring-blue-300"
              :class="{ 'border-red-500': errors.generalDetails[key] }"
            />
            <p v-if="errors.generalDetails[key]" class="text-red-500 text-sm">
              {{ errors.generalDetails[key] }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- New Section for Attaching Photo -->

    <!-- Verification Sections (loop over different sections) -->
    <div
      v-for="(section, sectionKey) in sections"
      :key="sectionKey"
      class="mb-4 border-b pb-2 bg-white p-4 rounded-lg shadow-sm"
    >
      <button
        type="button"
        @click="toggleSection(sectionKey)"
        class="w-full text-left font-semibold p-3 text-black rounded-lg focus:outline-none"
      >
        {{ section.label }}
      </button>

      <div v-if="section.expanded" class="mt-3">
        <div v-for="(field, key) in section.fields" :key="key" class="mb-3">
          <label class="block font-medium text-gray-700">{{
            field.label
          }}</label>
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                v-model="field.value"
                :value="'Yes'"
                class="w-5 h-5 text-blue-500"
              />
              <span>Yes</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                type="radio"
                v-model="field.value"
                :value="'No'"
                class="w-5 h-5 text-blue-500"
              />
              <span>No</span>
            </label>
          </div>
          <p
            v-if="errors[sectionKey]?.fields?.[key]"
            class="text-red-500 text-sm"
          >
            {{ errors[sectionKey]?.fields?.[key] }}
          </p>
        </div>

        <!-- Additional Notes Fields -->
        <div v-if="sectionKey === 'physicalVerification'" class="mt-4">
          <label class="block font-medium text-gray-700"
            >Additional Notes</label
          >
          <textarea
            v-model="section.notes"
            class="w-full border rounded p-2 focus:ring focus:ring-blue-300"
            rows="4"
            placeholder="Enter any additional details here..."
          ></textarea>
        </div>

        <div v-if="sectionKey === 'communicationIntegration'" class="mt-4">
          <label class="block font-medium text-gray-700"
            >Communication Notes</label
          >
          <textarea
            v-model="section.communicationNotes"
            class="w-full border rounded p-2 focus:ring focus:ring-blue-300"
            rows="4"
            placeholder="Enter any communication-related details here..."
          ></textarea>
        </div>

        <div v-if="sectionKey === 'customerEngagement'" class="mt-4">
          <label class="block font-medium text-gray-700"
            >Engagement Notes</label
          >
          <textarea
            v-model="section.engagementNotes"
            class="w-full border rounded p-2 focus:ring focus:ring-blue-300"
            rows="4"
            placeholder="Enter any engagement-related details here..."
          ></textarea>
        </div>

        <div v-if="sectionKey === 'finalAcceptance'" class="mt-4">
          <label class="block font-medium text-gray-700"
            >Acceptance Notes</label
          >
          <textarea
            v-model="section.acceptanceNotes"
            class="w-full border rounded p-2 focus:ring focus:ring-blue-300"
            rows="4"
            placeholder="Enter any acceptance-related details here..."
          ></textarea>
        </div>
      </div>
    </div>

    <!-- New Section for Attaching Photo -->
    <!-- Attach a Photo Section -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
      <label class="block font-medium text-gray-700">Attach a Photo</label>
      <input
        type="file"
        accept="image/*"
        @change="onFileChange"
        class="w-full border rounded p-2 focus:ring focus:ring-blue-300"
      />
      <p v-if="photo" class="text-gray-500 text-sm mt-2">
        Selected File: {{ photo.name }}
      </p>

      <!-- Image Preview with Remove Button -->
      <div v-if="imagePreview" class="relative mt-4 inline-block">
        <img
          :src="imagePreview"
          alt="Image Preview"
          class="w-32 h-32 object-cover rounded-lg shadow-md border"
        />
        <button
          @click="removeImage"
          class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-700"
          title="Remove Image"
        >
          ✕
        </button>
      </div>

      <p v-if="errors.photo" class="text-red-500 text-sm">{{ errors.photo }}</p>
    </div>
    <!-- Submit button to submit the form -->
    <button
      type="submit"
      class="mt-6 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
      :disabled="loading"
    >
      <span v-if="loading">Submitting...</span>
      <span v-else>Submit</span>
    </button>
  </form>
</template>

<script>
import map from "@/components/The-Map.vue";
export default {
  components: {
    map,
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
      photo: null, // Store the selected photo file
      imagePreview: null, // Store image preview URL
      sections: {
        physicalVerification: {
          label: "Physical Site Verification",
          expanded: false,
          fields: [
            { label: "Meter installed away from vehicular access", value: "" },
            { label: "Meter accessible for troubleshooting", value: "" },
            {
              label: "Secure and tamper-resistant installation location",
              value: "",
            },
            { label: "Adequate clearance around the meter", value: "" },
            {
              label: "Correct flow direction (verified by markings)",
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
            { label: "Data received accurately in central system", value: "" },
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
            this.generalDetails[2].latitude = position.coords.latitude;
            this.generalDetails[2].longitude = position.coords.longitude;
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

      // General Details Validation
      this.generalDetails.forEach((field, index) => {
        if (field.type === "gps") {
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
          this.errors.generalDetails[index] = "This field is required.";
          isValid = false;
        }
      });

      // Photo Validation
      if (!this.photo) {
        this.errors.photo = "Photo is required.";
        isValid = false;
      }

      return isValid;
    },
    submitForm() {
      //if (!this.validateForm()) {
      //return;
      //}

      this.loading = true;
      setTimeout(() => {
        console.log(
          "Form submitted",
          this.generalDetails,
          this.sections,
          this.photo
        );
        this.loading = false;
      }, 2000); // Simulate a network request delay
    },
  },
};
</script>

<style>
/* Custom styles for the form */
</style>
