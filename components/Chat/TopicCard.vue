<template>
  <div
    class="group p-4 rounded-xl cursor-pointer transition-all duration-300 border"
    :class="
      isActive
        ? 'bg-gradient-to-r from-blue-500/30 to-pink-500/30 border-blue-400/50 shadow-lg shadow-blue-500/20'
        : 'border-white/10 hover:bg-white/10 hover:border-white/20'
    "
    @click="$emit('click', topic)"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center text-xl"
          :class="isActive ? 'bg-blue-500' : 'bg-white/10'"
        >
          {{ emoji }}
        </div>
        <div>
          <div class="font-semibold group-hover:text-blue-300 transition">
            {{ topic.name }}
          </div>
          <div class="text-xs text-gray-600 flex items-center gap-1">
            <span
              class="w-2 h-2 bg-green-400 rounded-full animate-pulse"
            ></span>
            Online
          </div>
        </div>
      </div>
      <a-icon
        v-if="isActive"
        type="check-circle"
        theme="filled"
        class="text-blue-400 text-lg"
      />
      <a-icon
        v-else
        type="right"
        class="text-gray-500 transition opacity-0 group-hover:opacity-100"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "TopicCard",
  props: {
    topic: {
      type: Object,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    emoji() {
      const emojis = [
        "💬",
        "🎯",
        "📚",
        "🌟",
        "🎨",
        "🎵",
        "🏆",
        "💡",
        "🔥",
        "✨",
      ];
      return emojis[this.topic.id % emojis.length];
    },
  },
};
</script>
