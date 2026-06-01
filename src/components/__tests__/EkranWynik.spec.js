import { mount } from '@vue/test-utils'
import EkranWynik from '../EkranWynik.vue'

describe('EkranWynik', () => {
  it.each([
    [5, 5, '100%', 'Doskonale! 🏆', '🏆'],
    [4, 5, '80%', 'Bardzo dobrze! 🎉', '⭐'],
    [1, 5, '20%', 'Warto się pouczyć 📚', '💪']
  ])('dla %i/%i wyświetla %s oraz komunikat %s', (score, total, percent, message, emoji) => {
    const wrapper = mount(EkranWynik, { props: { score, total } })
    const output = wrapper.text()

    expect(output).toContain(`${score} / ${total}`)
    expect(output).toContain(percent)
    expect(output).toContain(message)
    expect(output).toContain(emoji)
  })

  it('emituje reset po kliknięciu przycisku Zagraj Ponownie', async () => {
    const wrapper = mount(EkranWynik, { props: { score: 2, total: 5 } })

    await wrapper.find('button.replay-btn').trigger('click')

    expect(wrapper.emitted('reset')).toBeTruthy()
    expect(wrapper.emitted('reset')[0]).toEqual([])
  })
})
