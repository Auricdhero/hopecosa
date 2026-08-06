<template>
  <div class="space-y-4">
    <!-- Associate Member Fields (Personal Information) -->
    <div v-if="membershipType === 'associate'" class="space-y-4">
      <div>
        <label
          for="associate-title"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Title *</label
        >
        <select
          id="associate-title"
          v-model="formData.title"
          required
          class="input-field"
        >
          <option value="" disabled>Select title</option>
          <option value="Mr.">Mr.</option>
          <option value="Mrs.">Mrs.</option>
          <option value="Ms.">Ms.</option>
          <option value="Miss">Miss</option>
          <option value="Dr.">Dr.</option>
          <option value="Prof.">Prof.</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label
          for="full-name-id"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Full Name (as it should appear on ID card) *</label
        >
        <input
          id="full-name-id"
          v-model="formData.full_name"
          type="text"
          required
          class="input-field"
          placeholder="Enter your full legal name"
        />
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="gender"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Gender *</label
          >
          <select
            id="gender"
            v-model="formData.gender"
            required
            class="input-field"
          >
            <option value="" disabled>Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label
            for="dob"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Date of Birth *</label
          >
          <input
            id="dob"
            v-model="formData.dateOfBirth"
            type="date"
            required
            class="input-field"
            :max="new Date().toISOString().split('T')[0]"
          />
        </div>

        <div>
          <label
            for="associate-marital-status"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Marital Status *</label
          >
          <select
            id="associate-marital-status"
            v-model="formData.maritalStatus"
            required
            class="input-field"
          >
            <option value="" disabled>Select marital status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="widowed">Widowed</option>
            <option value="divorced">Divorced</option>
          </select>
        </div>
      </div>

      <div>
        <label
          for="associate-previous-affiliation"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Previous Affiliation with Hope College *</label
        >
        <select
          id="associate-previous-affiliation"
          v-model="formData.previousAffiliation"
          required
          class="input-field"
        >
          <option value="" disabled>Select affiliation</option>
          <option value="ex_student_not_complete">
            Ex-student (did not complete)
          </option>
          <option value="former_faculty_member">Former faculty member</option>
          <option value="former_staff">Former staff</option>
          <option value="no_previous_affiliation">
            No previous affiliation
          </option>
        </select>
      </div>

      <div
        v-if="
          formData.previousAffiliation &&
          formData.previousAffiliation !== 'no_previous_affiliation'
        "
        class="grid md:grid-cols-2 gap-4"
      >
        <div>
          <label
            for="associate-affiliation-start-year"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Start Year *</label
          >
          <input
            id="associate-affiliation-start-year"
            v-model.number="formData.affiliationStartYear"
            type="number"
            required
            class="input-field"
            placeholder="e.g., 2018"
            :min="1950"
            :max="new Date().getFullYear() + 10"
          />
        </div>

        <div>
          <label
            for="associate-affiliation-end-year"
            class="block text-sm font-medium text-gray-700 mb-1"
            >End Year *</label
          >
          <input
            id="associate-affiliation-end-year"
            v-model.number="formData.affiliationEndYear"
            type="number"
            required
            class="input-field"
            placeholder="e.g., 2021"
            :min="1950"
            :max="new Date().getFullYear() + 10"
          />
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="phone-number"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Phone Number *</label
          >
          <PhoneNumberField
            id="phone-number"
            v-model="formData.phone"
            v-model:country="formData.phoneCountry"
            required
          />
        </div>

        <div>
          <label
            for="email-address"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Email Address *</label
          >
          <input
            id="email-address"
            v-model="formData.email"
            type="email"
            required
            class="input-field"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div>
        <label
          for="residential-address"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Residential Address *</label
        >
        <textarea
          id="residential-address"
          v-model="formData.residentialAddress"
          required
          rows="2"
          class="input-field"
          placeholder="Street address, apartment/unit number"
        />
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="associate-nationality"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Nationality *</label
          >
          <input
            id="associate-nationality"
            v-model="formData.nationality"
            type="text"
            required
            class="input-field"
            placeholder="Nationality"
          />
        </div>

        <div>
          <label for="city" class="block text-sm font-medium text-gray-700 mb-1"
            >City *</label
          >
          <input
            id="city"
            v-model="formData.city"
            type="text"
            required
            class="input-field"
            placeholder="City"
          />
        </div>

        <div>
          <label
            for="country"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Country of Residence *</label
          >
          <input
            id="country"
            v-model="formData.country"
            type="text"
            required
            class="input-field"
            placeholder="Country"
          />
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="associate-region"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Region of Residence *</label
          >
          <input
            id="associate-region"
            v-model="formData.regionOfResidence"
            type="text"
            required
            class="input-field"
            placeholder="Region"
          />
        </div>

        <div>
          <label
            for="associate-suburb"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Suburb *</label
          >
          <input
            id="associate-suburb"
            v-model="formData.suburb"
            type="text"
            required
            class="input-field"
            placeholder="Suburb"
          />
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="associate-tertiary-status"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Tertiary Status *</label
          >
          <select
            id="associate-tertiary-status"
            v-model="formData.tertiaryStatus"
            required
            class="input-field"
          >
            <option value="" disabled>Select status</option>
            <option value="student">Student</option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
            <option value="not_applicable">Not applicable</option>
          </select>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="associate-tertiary-completion-year"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Year of Completion - Tertiary</label
          >
          <input
            id="associate-tertiary-completion-year"
            v-model.number="formData.tertiaryCompletionYear"
            type="number"
            class="input-field"
            placeholder="e.g., 2026"
            :min="1950"
            :max="new Date().getFullYear() + 10"
          />
        </div>

        <div v-if="formData.tertiaryStatus === 'student'">
          <label
            for="associate-level"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Level *</label
          >
          <input
            id="associate-level"
            v-model="formData.level"
            type="text"
            required
            class="input-field"
            placeholder="e.g., Level 200"
          />
        </div>
      </div>

      <div>
        <label
          for="associate-programme-read"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Programme Read - Tertiary *</label
        >
        <input
          id="associate-programme-read"
          v-model="formData.programmeRead"
          type="text"
          required
          class="input-field"
          placeholder="e.g., BSc Information Technology"
        />
      </div>

      <div>
        <label
          for="associate-course-studied-hc"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Course Studied - HC</label
        >
        <input
          id="associate-course-studied-hc"
          v-model="formData.courseStudiedHC"
          type="text"
          class="input-field"
          placeholder="e.g., Bachelor of Science in Computer Science"
        />
      </div>

      <div>
        <label
          for="associate-employment-status"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Employment Status *</label
        >
        <select
          id="associate-employment-status"
          v-model="formData.employmentStatus"
          required
          class="input-field"
        >
          <option value="" disabled>Select employment status</option>
          <option value="employed">Employed</option>
          <option value="unemployed">Unemployed</option>
          <option value="self_employed">Self-Employed</option>
        </select>
      </div>

      <div>
        <label
          for="occupation"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Occupation *</label
        >
        <input
          id="occupation"
          v-model="formData.occupation"
          type="text"
          required
          class="input-field"
          placeholder="Your current occupation"
        />
      </div>

      <div>
        <label
          for="associate-employer-institution"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Employer Institution</label
        >
        <input
          id="associate-employer-institution"
          v-model="formData.employerInstitution"
          type="text"
          class="input-field"
          placeholder="Company or institution name"
        />
      </div>
    </div>

    <!-- Honourary Member Fields -->
    <div v-if="membershipType === 'honourary'" class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="honorary-title"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Title *</label
          >
          <select
            id="honorary-title"
            v-model="formData.professionalTitle"
            required
            class="input-field"
          >
            <option value="" disabled>Select title</option>
            <option value="Mr.">Mr.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Dr.">Dr.</option>
            <option value="Prof.">Prof.</option>
            <option value="PhD (Dr)">PhD (Dr)</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            for="full-name-hon"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Full Name *</label
          >
          <input
            id="full-name-hon"
            v-model="formData.full_name"
            type="text"
            required
            class="input-field"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label
            for="email-hon"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Email Address *</label
          >
          <input
            id="email-hon"
            v-model="formData.email"
            type="email"
            required
            class="input-field"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="honorary-gender"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Gender *</label
          >
          <select
            id="honorary-gender"
            v-model="formData.gender"
            required
            class="input-field"
          >
            <option value="" disabled>Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label
            for="honorary-marital-status"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Marital Status *</label
          >
          <select
            id="honorary-marital-status"
            v-model="formData.maritalStatus"
            required
            class="input-field"
          >
            <option value="" disabled>Select marital status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="widowed">Widowed</option>
            <option value="divorced">Divorced</option>
          </select>
        </div>
      </div>

      <div>
        <label
          for="phone-hon"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Phone Number *</label
        >
        <PhoneNumberField
          id="phone-hon"
          v-model="formData.phone"
          v-model:country="formData.phoneCountry"
          required
        />
      </div>

      <div>
        <label
          for="honorary-previous-affiliation"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Previous Affiliation with Hope College *</label
        >
        <select
          id="honorary-previous-affiliation"
          v-model="formData.previousAffiliation"
          required
          class="input-field"
        >
          <option value="" disabled>Select affiliation</option>
          <option value="ex_student_not_complete">
            Ex-student (did not complete)
          </option>
          <option value="former_faculty_member">Former faculty member</option>
          <option value="former_staff">Former staff</option>
          <option value="no_previous_affiliation">
            No previous affiliation
          </option>
        </select>
      </div>

      <div
        v-if="
          formData.previousAffiliation &&
          formData.previousAffiliation !== 'no_previous_affiliation'
        "
        class="grid md:grid-cols-2 gap-4"
      >
        <div>
          <label
            for="honorary-affiliation-start-year"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Start Year *</label
          >
          <input
            id="honorary-affiliation-start-year"
            v-model.number="formData.affiliationStartYear"
            type="number"
            required
            class="input-field"
            placeholder="e.g., 2004"
            :min="1950"
            :max="new Date().getFullYear() + 10"
          />
        </div>

        <div>
          <label
            for="honorary-affiliation-end-year"
            class="block text-sm font-medium text-gray-700 mb-1"
            >End Year *</label
          >
          <input
            id="honorary-affiliation-end-year"
            v-model.number="formData.affiliationEndYear"
            type="number"
            required
            class="input-field"
            placeholder="e.g., 2008"
            :min="1950"
            :max="new Date().getFullYear() + 10"
          />
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="honorary-nationality"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Nationality *</label
          >
          <input
            id="honorary-nationality"
            v-model="formData.nationality"
            type="text"
            required
            class="input-field"
            placeholder="Nationality"
          />
        </div>

        <div>
          <label
            for="honorary-country-residence"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Country of Residence *</label
          >
          <input
            id="honorary-country-residence"
            v-model="formData.countryOfResidence"
            type="text"
            required
            class="input-field"
            placeholder="Country"
          />
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="honorary-region-residence"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Region of Residence *</label
          >
          <input
            id="honorary-region-residence"
            v-model="formData.regionOfResidence"
            type="text"
            required
            class="input-field"
            placeholder="Region"
          />
        </div>

        <div>
          <label
            for="honorary-suburb"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Suburb *</label
          >
          <input
            id="honorary-suburb"
            v-model="formData.suburb"
            type="text"
            required
            class="input-field"
            placeholder="Suburb"
          />
        </div>
      </div>

      <div>
        <label
          for="honorary-employment-status"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Employment Status *</label
        >
        <select
          id="honorary-employment-status"
          v-model="formData.employmentStatus"
          required
          class="input-field"
        >
          <option value="" disabled>Select employment status</option>
          <option value="employed">Employed</option>
          <option value="unemployed">Unemployed</option>
          <option value="self_employed">Self-Employed</option>
        </select>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="honorary-occupation"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Occupation *</label
          >
          <input
            id="honorary-occupation"
            v-model="formData.occupation"
            type="text"
            required
            class="input-field"
            placeholder="Current occupation"
          />
        </div>

        <div>
          <label
            for="honorary-employer-institution"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Employer Institution *</label
          >
          <input
            id="honorary-employer-institution"
            v-model="formData.employerInstitution"
            type="text"
            required
            class="input-field"
            placeholder="Employer or institution"
          />
        </div>
      </div>

      <div>
        <label
          for="honorary-course-studied-hc"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Course Studied - HC</label
        >
        <input
          id="honorary-course-studied-hc"
          v-model="formData.courseStudiedHC"
          type="text"
          class="input-field"
          placeholder="e.g., Bachelor of Science in Computer Science"
        />
      </div>

      <div>
        <label
          for="field-expertise"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Field of Expertise *</label
        >
        <input
          id="field-expertise"
          v-model="formData.fieldOfExpertise"
          type="text"
          required
          class="input-field"
          placeholder="e.g., Education, Medicine, Engineering"
        />
      </div>

      <div>
        <label
          for="current-position-hon"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Current Position *</label
        >
        <input
          id="current-position-hon"
          v-model="formData.currentPosition"
          type="text"
          required
          class="input-field"
          placeholder="Your current professional position"
        />
      </div>

      <div>
        <label
          for="organization-institution"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Organization / Institution *</label
        >
        <input
          id="organization-institution"
          v-model="formData.organizationInstitution"
          type="text"
          required
          class="input-field"
          placeholder="Where you currently work or are affiliated"
        />
      </div>

      <div>
        <label
          for="brief-biography"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Brief Biography *</label
        >
        <textarea
          id="brief-biography"
          v-model="formData.briefBiography"
          required
          rows="4"
          class="input-field"
          placeholder="Provide a brief professional biography (200-500 words)"
        />
      </div>

      <div>
        <label
          for="honorary-reason"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Reason for Honorary Consideration *</label
        >
        <textarea
          id="honorary-reason"
          v-model="formData.reasonForHonorary"
          required
          rows="4"
          class="input-field"
          placeholder="Explain why you are seeking honorary membership and your contributions to the field or community"
        />
      </div>

      <div>
        <label
          for="cv-upload-hon"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Upload CV (Optional)</label
        >
        <input
          id="cv-upload-hon"
          type="file"
          accept=".pdf,.doc,.docx"
          @change="handleFileUpload($event, 'cv')"
          class="input-field"
        />
        <p class="text-xs text-gray-500 mt-1">
          Accepted formats: PDF, DOC, DOCX (Max 5MB)
        </p>
      </div>
    </div>

    <!-- Regular Member Fields -->
    <div v-if="membershipType === 'regular'" class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="full-name-reg"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Full Name *</label
          >
          <input
            id="full-name-reg"
            v-model="formData.full_name"
            type="text"
            required
            class="input-field"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label
            for="email-reg"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Email Address *</label
          >
          <input
            id="email-reg"
            v-model="formData.email"
            type="email"
            required
            class="input-field"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div>
        <label
          for="phone-reg"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Phone Number *</label
        >
        <PhoneNumberField
          id="phone-reg"
          v-model="formData.phone"
          v-model:country="formData.phoneCountry"
          required
        />
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="regular-gender"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Gender *</label
          >
          <select
            id="regular-gender"
            v-model="formData.gender"
            required
            class="input-field"
          >
            <option value="" disabled>Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label
            for="regular-nationality"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Nationality *</label
          >
          <input
            id="regular-nationality"
            v-model="formData.nationality"
            type="text"
            required
            class="input-field"
            placeholder="Nationality"
          />
        </div>

        <div>
          <label
            for="regular-marital-status"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Marital Status *</label
          >
          <select
            id="regular-marital-status"
            v-model="formData.maritalStatus"
            required
            class="input-field"
          >
            <option value="" disabled>Select marital status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="widowed">Widowed</option>
            <option value="divorced">Divorced</option>
          </select>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="regular-country-residence"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Country of Residence *</label
          >
          <input
            id="regular-country-residence"
            v-model="formData.countryOfResidence"
            type="text"
            required
            class="input-field"
            placeholder="Country"
          />
        </div>

        <div>
          <label
            for="regular-region-residence"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Region of Residence *</label
          >
          <input
            id="regular-region-residence"
            v-model="formData.regionOfResidence"
            type="text"
            required
            class="input-field"
            placeholder="Region"
          />
        </div>
      </div>

      <div>
        <label
          for="regular-suburb"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Suburb *</label
        >
        <input
          id="regular-suburb"
          v-model="formData.suburb"
          type="text"
          required
          class="input-field"
          placeholder="Suburb"
        />
      </div>

      <div>
        <label
          for="regular-tertiary-institution"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Tertiary Institution *</label
        >
        <input
          id="regular-tertiary-institution"
          v-model="formData.tertiaryInstitution"
          type="text"
          required
          class="input-field"
          placeholder="Institution name"
        />
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="regular-tertiary-status"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Tertiary Status *</label
          >
          <select
            id="regular-tertiary-status"
            v-model="formData.tertiaryStatus"
            required
            class="input-field"
          >
            <option value="" disabled>Select status</option>
            <option value="student">Student</option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
            <option value="not_applicable">Not applicable</option>
          </select>
        </div>

        <div>
          <label
            for="regular-tertiary-completion-year"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Year of Completion - Tertiary *</label
          >
          <input
            id="regular-tertiary-completion-year"
            v-model.number="formData.tertiaryCompletionYear"
            type="number"
            required
            class="input-field"
            placeholder="2026"
            :min="1950"
            :max="new Date().getFullYear() + 10"
          />
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="regular-level"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Level *</label
          >
          <input
            id="regular-level"
            v-model="formData.level"
            type="text"
            required
            class="input-field"
            placeholder="e.g., Level 300"
          />
        </div>

        <div>
          <label
            for="regular-program-read"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Program Read - Tertiary *</label
          >
          <input
            id="regular-program-read"
            v-model="formData.programmeRead"
            type="text"
            required
            class="input-field"
            placeholder="e.g., BSc Computer Science"
          />
        </div>
      </div>

      <div>
        <label
          for="regular-employment-status"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Employment Status *</label
        >
        <select
          id="regular-employment-status"
          v-model="formData.employmentStatus"
          required
          class="input-field"
        >
          <option value="" disabled>Select employment status</option>
          <option value="employed">Employed</option>
          <option value="unemployed">Unemployed</option>
          <option value="self_employed">Self-Employed</option>
        </select>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label
            for="regular-occupation"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Occupation *</label
          >
          <input
            id="regular-occupation"
            v-model="formData.occupation"
            type="text"
            required
            class="input-field"
            placeholder="Current occupation"
          />
        </div>

        <div>
          <label
            for="regular-employer-institution"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Employer Institution *</label
          >
          <input
            id="regular-employer-institution"
            v-model="formData.employerInstitution"
            type="text"
            required
            class="input-field"
            placeholder="Employer or institution"
          />
        </div>
      </div>

      <div>
        <label
          for="graduation-year-reg"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Year of Graduation - HC *</label
        >
        <input
          id="graduation-year-reg"
          v-model.number="formData.yearOfGraduation"
          type="number"
          required
          class="input-field"
          placeholder="2026"
          :min="2015"
          :max="new Date().getFullYear() + 10"
        />
      </div>

      <div>
        <label
          for="program-course"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Course Studied - HC *</label
        >
        <input
          id="program-course"
          v-model="formData.programOrCourse"
          type="text"
          required
          class="input-field"
          placeholder="e.g., Bachelor of Science in Computer Science"
        />
      </div>

      <div>
        <label
          for="leadership-role"
          class="block text-sm font-medium text-gray-700 mb-1"
          >HC SRC Leadership Role Held (Optional)</label
        >
        <input
          id="leadership-role"
          v-model="formData.leadershipRole"
          type="text"
          class="input-field"
          placeholder="e.g., President, Secretary, Treasurer"
        />
      </div>

      <div class="flex items-start">
        <input
          id="graduation-consent"
          v-model="formData.graduationConsent"
          type="checkbox"
          required
          class="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label for="graduation-consent" class="ml-2 text-sm text-gray-700">
          I agree to HOPECOSA verifying my graduation status with Hope College
          *
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  membershipType: "associate" | "honourary" | "regular" | null;
}>();

const formData = defineModel<any>({ default: () => ({}) });

const emit = defineEmits<{
  fileSelected: [fileType: string, file: File];
  fileError: [message: string];
}>();

const handleFileUpload = (event: Event, fileType: string) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    emit("fileError", "File size must be less than 5MB");
    input.value = "";
    return;
  }

  emit("fileSelected", fileType, file);
};
</script>
