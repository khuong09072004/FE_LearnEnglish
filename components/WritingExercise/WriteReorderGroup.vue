<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Question Header -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-2">
        Câu {{ questionNumber }}/{{ totalQuestions }}
      </h2>
      <p class="text-gray-600 mb-4">Sắp xếp các nhóm từ sau để tạo thành câu đúng:</p>
    </div>

    <!-- Groups Container - Draggable -->
    <div class="mb-8">
      <p class="text-sm text-gray-500 mb-3">Các nhóm từ có sẵn:</p>
      <div class="flex flex-wrap gap-2 p-4 bg-blue-50 rounded-lg min-h-20">
        <div
          v-for="(group, index) in availableGroups"
          :key="`available-${index}`"
          draggable="true"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-move hover:bg-blue-600 transition-colors select-none shadow-md whitespace-nowrap"
          @dragstart="dragStart($event, group, 'available', index)"
          @dragend="dragEnd"
        >
          {{ group }}
        </div>
      </div>
    </div>

    <!-- Answer Area - Drop Zone -->
    <div class="mb-8">
      <p class="text-sm text-gray-500 mb-3">Kéo và sắp xếp các nhóm:</p>
      <div
        class="min-h-24 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-wrap gap-2 items-start content-start"
        @dragover="dragOver"
        @drop="dropGroup($event)"
        @dragleave="dragLeave"
        :class="dragOverZone ? 'border-blue-500 bg-blue-50' : ''"
      >
        <div v-if="selectedGroups.length === 0" class="text-center text-gray-400 w-full py-8">
          Kéo các nhóm vào đây để sắp xếp câu
        </div>
        <div
          v-for="(group, index) in selectedGroups"
          :key="`selected-${index}`"
          draggable="true"
          class="px-4 py-2 bg-green-500 text-white rounded-lg cursor-move hover:bg-green-600 active:bg-green-700 transition-colors select-none shadow-md flex items-center gap-2 whitespace-nowrap"
          @dragstart="dragStart($event, group, 'selected', index)"
          @dragend="dragEnd"
          @dragover.prevent="dragOverItem($event, index)"
        >
          
          <span>{{ group }}</span>
          <button
            type="button"
            class="ml-1 text-white hover:text-red-200 font-bold text-sm"
            @click="removeGroup(index)"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- Display Sentence -->
    <div class="mb-6 p-4 bg-gray-100 rounded-lg">
      <p class="text-sm text-gray-600 mb-2">Câu của bạn:</p>
      <p class="text-lg font-semibold text-gray-800 leading-relaxed">
        {{ displaySentence }}
      </p>
    </div>

    <!-- Submit Buttons -->
    <div class="flex gap-3">
      <button
        type="button"
        class="flex-1 px-4 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
        @click="resetAnswer"
      >
        Làm lại
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "WriteReorderGroup",
  props: {
    question: {
      type: Object,
      required: true,
    },
    questionNumber: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    userAnswer: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      selectedGroups: [],
      draggedItem: null,
      dragOverZone: false,
      dragOverIndex: null,
    };
  },

  computed: {
    availableGroups() {
      if (!this.question.question?.groups) return [];
      return this.question.question.groups.filter(
        (group) => !this.selectedGroups.includes(group)
      );
    },
    
    displaySentence() {
      return this.selectedGroups.length > 0 ? this.selectedGroups.join(" ") : "...";
    },
  },

  mounted() {
    if (this.userAnswer) {
      this.parseUserAnswer(this.userAnswer);
    }
    console.log("✅ WriteReorderGroup mounted", {
      question: this.question,
      availableGroups: this.availableGroups,
      userAnswer: this.userAnswer,
    });
  },

  watch: {
    userAnswer(newVal) {
      if (newVal) {
        this.parseUserAnswer(newVal);
      } else {
        this.selectedGroups = [];
      }
    },
  },

  methods: {
    parseUserAnswer(answerString) {
      // Parse "Scientists may discover new planets beyond our solar system"
      // back to ["Scientists", "may discover", "new planets", "beyond our solar system"]
      const groups = this.question.question?.groups || [];
      const result = [];
      let remaining = answerString.trim();
      
      while (remaining.length > 0 && result.length < groups.length) {
        let matched = false;
        
        // Try to match each group from the original groups array
        for (const group of groups) {
          // Skip if we've already used this group
          if (result.includes(group)) continue;
          
          // Check if remaining string starts with this group
          if (remaining.startsWith(group)) {
            result.push(group);
            remaining = remaining.substring(group.length).trim();
            matched = true;
            break;
          }
        }
        
        // If no match found, break to avoid infinite loop
        if (!matched) break;
      }
      
      this.selectedGroups = result;
    },
    
    dragStart(e, group, source, index) {
      this.draggedItem = { group, source, index };
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", e.target.innerHTML);
    },

    dragEnd() {
      this.draggedItem = null;
      this.dragOverZone = false;
      this.dragOverIndex = null;
    },

    dragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      this.dragOverZone = true;
    },

    dragOverItem(e, index) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      this.dragOverIndex = index;
    },

    dragLeave() {
      this.dragOverZone = false;
      this.dragOverIndex = null;
    },

    dropGroup(e) {
      if (!this.draggedItem) return;

      e.preventDefault();
      const { group, source, index } = this.draggedItem;

      if (source === "available") {
        // Thêm nhóm mới vào danh sách
        this.selectedGroups.push(group);
      } else if (source === "selected") {
        // Reorder - xoá từ vị trí cũ
        const currentIndex = this.selectedGroups.indexOf(group);
        if (currentIndex > -1) {
          this.selectedGroups.splice(currentIndex, 1);
        }

        // Thêm vào vị trí mới (mặc định cuối)
        if (this.dragOverIndex !== null) {
          this.selectedGroups.splice(this.dragOverIndex, 0, group);
        } else {
          this.selectedGroups.push(group);
        }
      }

      this.dragOverZone = false;
      this.dragOverIndex = null;
      this.draggedItem = null;
      
      // Emit sau khi thay đổi
      this.emitAnswer();
    },

    removeGroup(index) {
      this.selectedGroups.splice(index, 1);
      this.emitAnswer();
    },

    resetAnswer() {
      this.selectedGroups = [];
      this.emitAnswer();
    },

    submitAnswer() {
      this.emitAnswer();
    },
    
    emitAnswer() {
      // Emit as readable string: "Scientists may discover new planets beyond our solar system"
      if (this.selectedGroups.length > 0) {
        this.$emit("answer", this.displaySentence);
      } else {
        this.$emit("answer", null);
      }
    },
  },
};
</script>