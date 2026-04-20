<script setup>
const props = defineProps(['score', 'total'])
const emit = defineEmits(['reset'])

const percent = Math.round((props.score / props.total) * 100)

const message = () => {
  if (percent === 100) return 'Doskonale! 🏆'
  if (percent >= 80) return 'Bardzo dobrze! 🎉'
  if (percent >= 60) return 'Nieźle! 👍'
  return 'Warto się pouczyć 📚'
}

const getEmoji = () => {
  if (percent === 100) return '🏆'
  if (percent >= 80) return '⭐'
  if (percent >= 60) return '😊'
  return '💪'
}
</script>

<template>
  <div class="results-screen">
    <div class="emoji-display">{{ getEmoji() }}</div>
    <h2>Koniec Quizu!</h2>
    <div class="score-card">
      <p class="score-text">{{ score }} / {{ total }}</p>
      <p class="percentage">{{ percent }}%</p>
    </div>
    <p class="message">{{ message() }}</p>
    <button class="replay-btn" @click="emit('reset')">Zagraj Ponownie</button>
  </div>
</template>

<style scoped>
.results-screen {
  text-align: center;
  padding: 20px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.emoji-display {
  font-size: 5em;
  margin-bottom: 20px;
  animation: bounce 1s ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

h2 {
  font-size: 2.2em;
  color: #667eea;
  margin: 0 0 30px 0;
}

.score-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 20px;
  margin: 25px 0;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.score-text {
  font-size: 2.5em;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.percentage {
  font-size: 1.8em;
  margin: 0;
  opacity: 0.9;
}

.message {
  font-size: 1.4em;
  color: #555;
  margin: 25px 0;
  font-weight: 500;
}

.replay-btn {
  padding: 16px 50px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 20px;
}

.replay-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.6);
}

.replay-btn:active {
  transform: translateY(-1px);
}
</style>
