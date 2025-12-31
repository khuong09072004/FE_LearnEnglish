import { Howl } from "howler";

export default {
  data() {
    return {
      sounds: {
        answer: null,
        correct: null,
        wrong: null,
        click: null,
        submit: null,
        timeWarning: null,
        complete: null,
      },
    };
  },

  methods: {
    initSounds() {
      this.sounds.answer = new Howl({
        src: ["/sounds/pop.mp3"],
        volume: 0.5,
      });

      this.sounds.click = new Howl({
        src: ["/sounds/click.mp3"],
        volume: 0.3,
      });

      this.sounds.submit = new Howl({
        src: ["/sounds/success.mp3"],
        volume: 0.6,
      });

      this.sounds.timeWarning = new Howl({
        src: ["/sounds/countdown.mp3"],
        volume: 0.4,
      });

      this.sounds.complete = new Howl({
        src: ["/sounds/success.mp3"],
        volume: 0.7,
      });
    },

    playSound(soundName) {
      if (this.sounds[soundName]) {
        this.sounds[soundName].play();
      }
    },

    destroySounds() {
      Object.values(this.sounds).forEach((sound) => {
        if (sound) sound.unload();
      });
    },
  },
};