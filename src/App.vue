<script setup>
import { ref } from 'vue'

import BmiCalculator from './components/BmiCalculator.vue'
import EkranStart from './components/EkranStart.vue'
import EkranPytanie from './components/EkranPytanie.vue'
import EkranWynik from './components/EkranWynik.vue'
import { pytania } from './questions'

const view = ref('bmi')

// quiz
const screen = ref('start')
const index = ref(0)
const score = ref(0)

const start = () => screen.value = 'quiz'

const next = (isCorrect) => {
  if (isCorrect) score.value++
  if (index.value < pytania.length - 1) index.value++
  else screen.value = 'wynik'
}

const reset = () => {
  screen.value = 'start'
  index.value = 0
  score.value = 0
}
</script>

<template>
  <div class="app">
    <h1>Moja aplikacja Vue</h1>

    <div class="menu">
      <button @click="view = 'bmi'" :class="{active: view==='bmi'}">BMI</button>
      <button @click="view = 'quiz'" :class="{active: view==='quiz'}">Quiz</button>
    </div>

    <div class="card">
      <BmiCalculator v-if="view === 'bmi'" />

      <div v-else>
        <EkranStart v-if="screen === 'start'" @start="start" />

        <EkranPytanie
          v-else-if="screen === 'quiz'"
          :pytanie="pytania[index]"
          :index="index"
          :total="pytania.length"
          @next="next"
        />

        <EkranWynik
          v-else
          :score="score"
          :total="pytania.length"
          @reset="reset"
        />
      </div>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #667eea, #764ba2);
  min-height: 100vh;
}

.app {
  text-align: center;
  color: white;
  padding: 30px;
  min-height: 100vh;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.menu {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.menu button {
  padding: 14px 35px;
  border-radius: 30px;
  border: 2px solid white;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.menu button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.menu button.active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-color: white;
  box-shadow: 0 6px 25px rgba(245, 87, 108, 0.4);
}

.card {
  background: white;
  color: black;
  padding: 40px;
  border-radius: 25px;
  max-width: 750px;
  margin: auto;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
}
</style>
