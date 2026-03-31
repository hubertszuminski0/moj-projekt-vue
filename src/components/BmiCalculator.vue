<script setup>
import { ref, computed } from 'vue'

const weight = ref('')
const height = ref('')
const age = ref('')
const gender = ref('male')
const history = ref([])
const showHistory = ref(false)

const bmi = computed(() => {
  const w = parseFloat(weight.value)
  const h = parseFloat(height.value)

  if (!w || !h || w <= 0 || h <= 0) return null

  const hMeters = h / 100
  return (w / (hMeters * hMeters)).toFixed(2)
})

const category = computed(() => {
  if (!bmi.value) return null

  const value = parseFloat(bmi.value)

  if (value < 18.5) return 'Niedowaga'
  if (value < 25) return 'Waga prawidłowa'
  if (value < 30) return 'Nadwaga'
  return 'Otyłość'
})

const categoryIcon = computed(() => {
  switch (category.value) {
    case 'Niedowaga': return '⚠️'
    case 'Waga prawidłowa': return '✅'
    case 'Nadwaga': return '⚠️'
    case 'Otyłość': return '🔴'
    default: return ''
  }
})

const categoryClass = computed(() => {
  switch (category.value) {
    case 'Niedowaga': return 'underweight'
    case 'Waga prawidłowa': return 'normal'
    case 'Nadwaga': return 'overweight'
    case 'Otyłość': return 'obese'
    default: return ''
  }
})

const idealWeightRange = computed(() => {
  const h = parseFloat(height.value)
  if (!h || h <= 0) return null

  const hMeters = h / 100
  const minWeight = (18.5 * hMeters * hMeters).toFixed(1)
  const maxWeight = (24.9 * hMeters * hMeters).toFixed(1)

  return { min: minWeight, max: maxWeight }
})

const categoryDescription = computed(() => {
  switch (category.value) {
    case 'Niedowaga':
      return 'BMI poniżej 18.5 - może wskazywać na niewystarczającą masę ciała. Warto skonsultować się z lekarzem.'
    case 'Waga prawidłowa':
      return 'BMI w normie - gratulacje! Utrzymuj aktywny tryb życia i zdrową dietę.'
    case 'Nadwaga':
      return 'BMI powyżej 25 - warto rozważyć zmianę nawyków żywieniowych i zwiększenie aktywności fizycznej.'
    case 'Otyłość':
      return 'BMI powyżej 30 - zalecane skonsultowanie się z lekarzem i dietetykiem.'
    default:
      return ''
  }
})

const calculateBmi = () => {
  if (!weight.value || !height.value) {
    alert('Proszę wprowadzić wagę i wzrost!')
    return
  }

  const entry = {
    id: Date.now(),
    weight: weight.value,
    height: height.value,
    age: age.value,
    gender: gender.value,
    bmi: bmi.value,
    category: category.value,
    date: new Date().toLocaleString('pl-PL')
  }

  history.value.unshift(entry)
  
  if (history.value.length > 20) {
    history.value.pop()
  }
}

const clearHistory = () => {
  if (confirm('Na pewno chcesz usunąć całą historię?')) {
    history.value = []
  }
}

const deleteHistoryItem = (id) => {
  history.value = history.value.filter(item => item.id !== id)
}

const resetCalculator = () => {
  weight.value = ''
  height.value = ''
  age.value = ''
}

const exportHistory = () => {
  const csv = [
    ['Data', 'Waga (kg)', 'Wzrost (cm)', 'Wiek', 'Płeć', 'BMI', 'Kategoria'].join(','),
    ...history.value.map(item =>
      [item.date, item.weight, item.height, item.age, item.gender, item.bmi, item.category].join(',')
    )
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bmi-historia-${Date.now()}.csv`
  a.click()
}
</script>

<template>
  <div class="bmi-calculator">
    <div class="container">
      <header class="header">
        <h1>💪 Kalkulator BMI</h1>
        <p>Oblicz swój indeks masy ciała i monitoruj swoje zmiany</p>
      </header>

      <div class="content">
        <!-- Input Section -->
        <div class="input-section">
          <div class="form-group">
            <label>Waga (kg)</label>
            <input
              v-model="weight"
              type="number"
              placeholder="np. 75"
              min="0"
              step="0.1"
              @keyup.enter="calculateBmi"
            />
          </div>

          <div class="form-group">
            <label>Wzrost (cm)</label>
            <input
              v-model="height"
              type="number"
              placeholder="np. 180"
              min="0"
              step="0.1"
              @keyup.enter="calculateBmi"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Wiek (opcjonalnie)</label>
              <input
                v-model="age"
                type="number"
                placeholder="np. 30"
                min="0"
                max="150"
              />
            </div>

            <div class="form-group">
              <label>Płeć</label>
              <select v-model="gender">
                <option value="male">Mężczyzna</option>
                <option value="female">Kobieta</option>
              </select>
            </div>
          </div>

          <div class="button-group">
            <button @click="calculateBmi" class="btn btn-primary">
              Oblicz BMI
            </button>
            <button @click="resetCalculator" class="btn btn-secondary">
              Resetuj
            </button>
          </div>
        </div>

        <!-- Result Section -->
        <div v-if="bmi" class="result-section" :class="{ [categoryClass]: true }">
          <div class="bmi-card">
            <div class="bmi-value">
              <span class="icon">{{ categoryIcon }}</span>
              <span class="number">{{ bmi }}</span>
            </div>
            <p class="category">{{ category }}</p>
            <p class="description">{{ categoryDescription }}</p>

            <div v-if="idealWeightRange" class="ideal-weight">
              <p class="label">Idealna waga dla Ciebie:</p>
              <div class="range">
                <strong>{{ idealWeightRange.min }} - {{ idealWeightRange.max }} kg</strong>
              </div>
            </div>

            <div class="bmi-info">
              <div class="info-item">
                <span class="label">Waga:</span>
                <span class="value">{{ weight }} kg</span>
              </div>
              <div class="info-item">
                <span class="label">Wzrost:</span>
                <span class="value">{{ height }} cm</span>
              </div>
              <div v-if="age" class="info-item">
                <span class="label">Wiek:</span>
                <span class="value">{{ age }} lat</span>
              </div>
            </div>
          </div>
        </div>

        <!-- History Section -->
        <div class="history-section">
          <div class="history-header">
            <button
              @click="showHistory = !showHistory"
              class="btn btn-toggle"
              :class="{ active: showHistory }"
            >
              📊 Historia ({{ history.length }})
            </button>
            <div v-if="history.length > 0" class="history-actions">
              <button @click="exportHistory" class="btn btn-small" title="Eksportuj do CSV">
                📥 Eksportuj
              </button>
              <button @click="clearHistory" class="btn btn-small btn-danger" title="Usuń historię">
                🗑️ Wyczyść
              </button>
            </div>
          </div>

          <transition name="slide">
            <div v-if="showHistory" class="history-list">
              <div v-if="history.length === 0" class="empty-history">
                Brak zapisanych obliczeń. Oblicz BMI, aby dodać do historii.
              </div>
              <div v-for="item in history" :key="item.id" :class="['history-item', item.category.toLowerCase().replace(' ', '-')]">
                <div class="history-main">
                  <div class="history-info">
                    <span class="date">{{ item.date }}</span>
                    <span class="bmi-quick">BMI: <strong>{{ item.bmi }}</strong></span>
                    <span class="category-badge">{{ item.category }}</span>
                  </div>
                  <div class="history-data">
                    <span>{{ item.weight }} kg • {{ item.height }} cm</span>
                    <span v-if="item.age">{{ item.age }} lat • {{ item.gender === 'male' ? 'M' : 'K' }}</span>
                  </div>
                </div>
                <button
                  @click="deleteHistoryItem(item.id)"
                  class="btn-delete"
                  title="Usuń z historii"
                >
                  ✕
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- BMI Categories Info -->
        <div class="info-section">
          <h3>📈 Kategorie BMI</h3>
          <div class="categories-grid">
            <div class="category-info underweight">
              <span class="cat-range">Poniżej 18.5</span>
              <span class="cat-name">Niedowaga</span>
            </div>
            <div class="category-info normal">
              <span class="cat-range">18.5 - 24.9</span>
              <span class="cat-name">Waga prawidłowa</span>
            </div>
            <div class="category-info overweight">
              <span class="cat-range">25.0 - 29.9</span>
              <span class="cat-name">Nadwaga</span>
            </div>
            <div class="category-info obese">
              <span class="cat-range">30.0+</span>
              <span class="cat-name">Otyłość</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.bmi-calculator {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
  animation: slideDown 0.6s ease-out;
}

.header h1 {
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
}

.header p {
  font-size: 1.1rem;
  margin: 10px 0 0 0;
  opacity: 0.9;
}

.content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.6s ease-out;
}

/* Input Section */
.input-section {
  background: #f8f9fa;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.btn-small {
  padding: 8px 16px;
  font-size: 0.9rem;
  flex: none;
}

.btn-danger {
  background: #ff6b6b;
  color: white;
}

.btn-danger:hover {
  background: #ff5252;
}

.btn-toggle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: auto;
  flex: none;
}

.btn-toggle.active {
  opacity: 0.8;
}

/* Result Section */
.result-section {
  margin-bottom: 30px;
}

.bmi-card {
  background: white;
  border: 3px solid #e0e0e0;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  animation: resultAppear 0.5s ease-out;
}

.result-section.underweight .bmi-card {
  border-color: #3498db;
  background: linear-gradient(to bottom, #e3f2fd 0%, #fff 100%);
}

.result-section.normal .bmi-card {
  border-color: #2ecc71;
  background: linear-gradient(to bottom, #f0fdf4 0%, #fff 100%);
}

.result-section.overweight .bmi-card {
  border-color: #f39c12;
  background: linear-gradient(to bottom, #fffbf0 0%, #fff 100%);
}

.result-section.obese .bmi-card {
  border-color: #e74c3c;
  background: linear-gradient(to bottom, #ffe6e6 0%, #fff 100%);
}

.bmi-value {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

.bmi-value .icon {
  font-size: 3rem;
}

.bmi-value .number {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.category {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 15px 0;
  color: #333;
}

.description {
  background: rgba(0, 0, 0, 0.05);
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  line-height: 1.6;
  color: #555;
}

.ideal-weight {
  margin: 20px 0;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}

.ideal-weight .label {
  margin: 0;
  font-weight: 600;
  margin-bottom: 8px;
}

.ideal-weight .range {
  font-size: 1.3rem;
}

.bmi-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid rgba(0, 0, 0, 0.1);
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item .label {
  font-size: 0.85rem;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
}

.info-item .value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

/* History Section */
.history-section {
  margin-bottom: 30px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.history-actions {
  display: flex;
  gap: 10px;
}

.history-list {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 15px;
  max-height: 400px;
  overflow-y: auto;
}

.empty-history {
  text-align: center;
  color: #999;
  padding: 30px 20px;
  font-style: italic;
}

.history-item {
  background: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
}

.history-item.niedowaga {
  border-left-color: #3498db;
}

.history-item.waga-prawidłowa {
  border-left-color: #2ecc71;
}

.history-item.nadwaga {
  border-left-color: #f39c12;
}

.history-item.otyłość {
  border-left-color: #e74c3c;
}

.history-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateX(5px);
}

.history-main {
  flex: 1;
  text-align: left;
}

.history-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.date {
  font-size: 0.85rem;
  color: #999;
}

.bmi-quick {
  font-weight: 600;
  color: #333;
}

.category-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.history-data {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  color: #666;
}

.btn-delete {
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background: #ff5252;
  transform: scale(1.1);
}

/* Info Section */
.info-section {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid #e0e0e0;
}

.info-section h3 {
  margin: 0 0 20px 0;
  text-align: center;
  color: #333;
  font-size: 1.3rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.category-info {
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: white;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.category-info:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.category-info.underweight {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
}

.category-info.normal {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}

.category-info.overweight {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
}

.category-info.obese {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.cat-range {
  font-size: 0.9rem;
  opacity: 0.9;
}

.cat-name {
  font-size: 1rem;
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes resultAppear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .header h1 {
    font-size: 1.8rem;
  }

  .content {
    padding: 20px;
  }

  .input-section {
    padding: 15px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .button-group {
    flex-direction: column;
  }

  .history-header {
    flex-direction: column;
    align-items: stretch;
  }

  .history-actions {
    flex-direction: column;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-delete {
    align-self: flex-end;
  }

  .categories-grid {
    grid-template-columns: 1fr 1fr;
  }

  .bmi-value {
    flex-direction: column;
    gap: 10px;
  }

  .bmi-value .number {
    font-size: 2.5rem;
  }
}
</style>