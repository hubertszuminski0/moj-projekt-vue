<script setup>
const emit = defineEmits(['start'])
</script>

<template>
  <div class="start-screen">
    <h2>🎯 Quiz Wiedzy Ogólnej</h2>
    <p>Sprawdź swoją wiedzę z przedmiotów ogólnokształcących!</p>
    <button class="start-btn" @click="emit('start')">Rozpocznij Quiz</button>
  </div>
</template>

<style scoped>
.start-screen {
  text-align: center;
  padding: 20px;
}

h2 {
  font-size: 2em;
  color: #667eea;
  margin-bottom: 15px;
}

p {
  font-size: 1.1em;
  color: #555;
  margin-bottom: 30px;
}

.start-btn {
  padding: 16px 50px;
  font-size: 18px;
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
}

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.6);
}

.start-btn:active {
  transform: translateY(-1px);
}
</style>
