import { mount } from '@vue/test-utils'
import EkranPytanie from '../EkranPytanie.vue'

describe('EkranPytanie', () => {
  const sampleQuestion = {
    tresc: 'Jak nazywa się stolica Polski?',
    odpowiedzi: ['Kraków', 'Warszawa', 'Gdańsk'],
    poprawna: 1
  }

  it('renderuje treść pytania oraz wszystkie odpowiedzi', () => {
    const wrapper = mount(EkranPytanie, {
      props: { pytanie: sampleQuestion, index: 0, total: 3 }
    })

    const answers = wrapper.findAll('button.answer-btn')
    const answerLabels = answers.map(button => button.find('.answer-text').text())

    expect(wrapper.text()).toContain('Jak nazywa się stolica Polski?')
    expect(answers).toHaveLength(3)
    expect(answerLabels).toEqual(expect.arrayContaining(['Kraków', 'Warszawa', 'Gdańsk']))
  })

  it.each([
    [true, 1],
    [false, 0]
  ])('emituje next %s dla wyboru indeksu %i', async (expectedValue, selectedIndex) => {
    const wrapper = mount(EkranPytanie, {
      props: { pytanie: sampleQuestion, index: 0, total: 3 }
    })
    const answers = wrapper.findAll('button.answer-btn')

    await answers[selectedIndex].trigger('click')
    await wrapper.get('button.next-btn').trigger('click')

    expect(wrapper.emitted('next')).toBeTruthy()
    expect(wrapper.emitted('next')[0]).toEqual([expectedValue])
  })

  it('blokuje kolejne wybory po wybraniu odpowiedzi', async () => {
    const wrapper = mount(EkranPytanie, {
      props: { pytanie: sampleQuestion, index: 0, total: 3 }
    })
    const answers = wrapper.findAll('button.answer-btn')

    await answers[0].trigger('click')

    expect(wrapper.get('button.next-btn').exists()).toBe(true)
    expect(wrapper.findAll('button.answer-btn.selected')).toHaveLength(1)

    await answers[2].trigger('click')
    expect(wrapper.findAll('button.answer-btn.selected')).toHaveLength(1)
  })
})
