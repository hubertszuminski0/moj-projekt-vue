import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App.vue', () => {
  const findNavButton = (wrapper, label) => wrapper.findAll('button').find(button => button.text() === label)

  it('pokazuje ekran startowy quizu po kliknięciu przycisku Quiz', async () => {
    // Arrange
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Kalkulator BMI')
    const quizButton = findNavButton(wrapper, 'Quiz')

    // Act
    await quizButton.trigger('click')

    // Assert
    expect(wrapper.text()).toContain('Quiz Wiedzy Ogólnej')
  })

  it('przechodzi do pierwszego pytania po rozpoczęciu quizu', async () => {
    // Arrange
    const wrapper = mount(App)
    const quizButton = findNavButton(wrapper, 'Quiz')

    // Act
    await quizButton.trigger('click')
    await wrapper.find('button.start-btn').trigger('click')

    // Assert
    expect(wrapper.text()).toContain('Pytanie 1 / 5')
    expect(wrapper.text()).not.toContain('Rozpocznij Quiz')
  })
})
