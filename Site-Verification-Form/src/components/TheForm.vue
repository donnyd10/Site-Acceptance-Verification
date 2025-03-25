<template>
  <!-- Form element to submit the site acceptance verification -->
  <!-- Prevent default form submission and trigger submitForm method  -->
  <form
    @submit.prevent="submitForm"
    class="p-6 max-w-2xl mx-auto shadow-lg rounded-xl bg-gray-100"
  >
    <!-- Title for the form -->
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">
      Site Acceptance Verification
    </h2>

    <!-- General Installation Details Section (Collapsible) -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow-sm">
      <!-- Button to toggle the visibility of the General Installation Details -->
      <!-- Calls toggleGeneralDetails method when clicked -->
      <button
        type="button"
        @click="toggleGeneralDetails"
        class="w-full text-left font-semibold p-3 text-black rounded-lg focus:outline-none"
      >
        Section 1: General Installation Details
      </button>

      <!-- Conditionally show the General Details input fields if expanded -->
      <div v-if="generalDetailsExpanded" class="mt-3">
        <div v-for="(field, key) in generalDetails" :key="key" class="mb-3">
          <!-- Loop through each general detail and render its input -->
          <label class="block font-medium text-gray-700">{{
            field.label
          }}</label>
          <input
            v-model="field.value"
            type="text"
            class="w-full border rounded p-2 focus:ring focus:ring-blue-300"
          />
        </div>
      </div>
    </div>

    <!-- Verification Sections (loop over different sections such as physical verification, communication integration) -->
    <!-- Loop through each section and render it -->
    <div
      v-for="(section, sectionKey) in sections"
      :key="sectionKey"
      class="mb-4 border-b pb-2 bg-white p-4 rounded-lg shadow-sm"
    >
      <!-- Button to toggle visibility of the current section -->
      <!-- Calls toggleSection method when clicked -->
      <button
        type="button"
        @click="toggleSection(sectionKey)"
        class="w-full text-left font-semibold p-3 text-black rounded-lg focus:outline-none"
      >
        {{ section.label }}
        <!-- Displays the label of the current section -->
      </button>

      <!-- Conditionally show the section content if expanded -->
      <div v-if="section.expanded" class="mt-3">
        <div v-for="(field, key) in section.fields" :key="key" class="mb-3">
          <!-- Loop through each field within the section and render its options -->
          <label class="block font-medium text-gray-700">{{
            field.label
          }}</label>

          <!-- Radio buttons to select "Yes" or "No" -->
          <!-- Two-way binding for radio button value -->
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
        </div>

        <!-- Additional Notes Fields (conditionally shown based on section) -->
        <!-- Bind additional notes for physical verification -->
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

        <!-- Communication Notes Section for AMR/AMI Communication & Integration -->
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

        <!-- Customer Engagement & Documentation Section -->
        <div v-if="sectionKey === 'customerEngagement'" class="mt-4">
          <label class="block font-medium text-gray-700"
            >Additional Notes</label
          >
          <textarea
            v-model="section.engagementNotes"
            class="w-full border rounded p-2 focus:ring focus:ring-blue-300"
            rows="4"
            placeholder="Enter any additional engagement-related details here..."
          ></textarea>
        </div>

        <!-- Final Acceptance Section -->
        <div v-if="sectionKey === 'finalAcceptance'" class="mt-4">
          <label class="block font-medium text-gray-700"
            >Communication Notes</label
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

    <!-- Submit button to submit the form -->
    <button
      type="submit"
      class="mt-6 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
    >
      Submit
    </button>
  </form>
</template>

<script>
// Vue component logic
export default {
  data() {
    return {
      // Controls visibility of the general details section
      generalDetailsExpanded: false,

      // General installation details for input
      generalDetails: [
        { label: "Customer Name", value: "" },
        { label: "Account Number", value: "" },
        { label: "GPS Coordinates of Installation", value: "" },
        { label: "Meter Serial Number", value: "" },
        { label: "Meter Size (mm)", value: "" },
        { label: "Work Order Number", value: "" },
        { label: "Installation Date", value: "" },
        { label: "Installed by (Contractor Name)", value: "" },
        { label: "Meter Type (AMR/AMI)", value: "" },
      ],

      // Sections for different verification categories
      sections: {
        physicalVerification: {
          label: "Physical Site Verification", // Section label
          expanded: false, // Controls visibility of this section
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
          notes: "", // Additional notes field for this section
        },
        communicationIntegration: {
          label: "AMR/AMI Communication & Integration", // Section label
          expanded: false, // Controls visibility of this section
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
          communicationNotes: "", // Communication notes for this section
        },
        customerEngagement: {
          label: "Customer Engagement & Documentation", // Section label
          expanded: false, // Controls visibility of this section
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
          engagementNotes: "", // Additional notes for this section
        },
        finalAcceptance: {
          label: "Final Acceptance", // Section label
          expanded: false, // Controls visibility of this section
          fields: [
            { label: "Installation meets all required standards", value: "" },
            { label: "Site accepted for operational handover", value: "" },
          ],
          acceptanceNotes: "", // Acceptance notes for this section
        },
      },
    };
  },
  methods: {
    // Method to toggle visibility of the general details section
    toggleGeneralDetails() {
      this.generalDetailsExpanded = !this.generalDetailsExpanded;
    },

    // Method to toggle visibility of any given section
    toggleSection(sectionKey) {
      this.sections[sectionKey].expanded = !this.sections[sectionKey].expanded;
    },

    // Method to handle form submission
    submitForm() {
      console.log("Form submitted", this.generalDetails, this.sections);
    },
  },
};
</script>
