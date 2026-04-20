<script setup>
import { ref } from 'vue'

const props = defineProps(['pytanie', 'index', 'total'])
const emit = defineEmits(['next'])

const selected = ref(null)
const locked = ref(false)

const wybierz = (i) => {
  if (locked.value) return
  selected.value = i
  locked.value = true
}

const dalej = () => {
  const correct = selected.value === props.pytanie.poprawna
  emit('next', correct)
  selected.value = null
  locked.value = false
}
</script>

<template>
  <div class="quiz-question">
    <div class="header">
      <p class="question-counter">Pytanie {{ index + 1 }} / {{ total }}</p>
    </div>

    <div class="progress">
      <div class="bar" :style="{ width: ((index+1)/total)*100 + '%' }"></div>
    </div>

    <h3 class="question-text">{{ pytanie.tresc }}</h3>

    <div class="answers-container">
      <button
        v-for="(o, i) in pytanie.odpowiedzi"
        :key="i"
        @click="wybierz(i)"
        class="answer-btn"
        :class="{
          selected: selected === i,
          good: locked && i === pytanie.poprawna,
          bad: locked && i === selected && i !== pytanie.poprawna,
          disabled: locked && i !== selected && i !== pytanie.poprawna
        }"
      >
        <span class="answer-letter">{{ String.fromCharCode(65 + i) }}</span>
        <span class="answer-text">{{ o }}</span>
      </button>
    </div>

    <button v-if="locked" class="next-btn" @click="dalej">Dalej →</button>
  </div>
</template>

<style scoped>
.quiz-question {
  width: 100%;
}

.header {
  margin-bottom: 15px;
}

.question-counter {
  font-size: 0.95em;
  color: #999;
  font-weight: bold;
  margin: 0;
}

.question-text {
  font-size: 1.5em;
  color: #333;
  margin: 20px 0 30px 0;
  line-height: 1.6;
}

.progress {
  height: 8px;
  background: #e0e0e0;
  margin-bottom: 25px;
  border-radius: 10px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.answers-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
}

.answer-btn {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.05em;
  text-align: left;
  font-weight: 500;
  color: #333;
}

.answer-btn:hover:not(.disabled) {
  border-color: #667eea;
  background: #f5f7ff;
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.answer-btn.selected {
  border-color: #667eea;
  background: #f5f7ff;
}

.answer-btn.good {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  border-color: #84fab0;
  color: white;
  font-weight: bold;
}

.answer-btn.bad {
  background: linear-gradient(135deg, #fa8072 0%, #ff6b6b 100%);
  border-color: #ff6b6b;
  color: white;
  font-weight: bold;
}

.answer-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.answer-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  margin-right: 15px;
  font-weight: bold;
  font-size: 0.95em;
  flex-shrink: 0;
}

.answer-btn.good .answer-letter,
.answer-btn.bad .answer-letter {
  background: inherit;
}

.answer-text {
  flex: 1;
}

.next-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.next-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.6);
}

.next-btn:active {
  transform: translateY(-1px);
}
</style>
