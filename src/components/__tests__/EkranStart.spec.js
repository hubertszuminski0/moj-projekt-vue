import { mount } from '@vue/test-utils'
import EkranStart from '../EkranStart.vue'

describe('EkranStart', () => {
  it('wyświetla nagłówek i przycisk startu', () => {
    // Arrange
    const wrapper = mount(EkranStart)

    // Act
    const output = wrapper.text()

    // Assert
    expect(output).toContain('Quiz Wiedzy Ogólnej')
    expect(wrapper.find('button.start-btn').exists()).toBe(true)
  })

  it('emituje start po kliknięciu przycisku', async () => {
    // Arrange
    const wrapper = mount(EkranStart)

    // Act
    await wrapper.find('button.start-btn').trigger('click')

    // Assert
    expect(wrapper.emitted('start')).toBeTruthy()
    expect(wrapper.emitted('start')[0]).toEqual([])
  })
})
