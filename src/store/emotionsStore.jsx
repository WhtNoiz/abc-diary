import { create } from 'zustand'
import EMOTIONS   from '../data/emotionsData'

const today = new Date().toISOString().split('T')[0]

const useEmotionsStore = create((set, get) => ({

  //Wheel
  coreId: null,
  secIdx: null,
  terIdx: null,
  step: 'core',
  selectedEmotion: null,
  savedEmotions: [],

  //Form
  name: '',
  surname: '',
  date: today,
  situationValues: { cosa: '', quando: '', dove: '', chi: '', facendo: '' },
  thoughts: '',
  conseqValues: { sensazioni: '', fatto: '', voluto: '', nonVoluto: '' },

  //Form setters
  setName: (v) => set({ name: v }),
  setSurname: (v) => set({ surname: v }),
  setDate: (v) => set({ date: v }),

  setSituationValue: (id, val) =>
    set((state) => ({ situationValues: { ...state.situationValues, [id]: val } })),

  setThoughts: (v) => set({ thoughts: v }),

  setConseqValue: (id, val) =>
    set((state) => ({ conseqValues: { ...state.conseqValues, [id]: val } })),

  reset: () => set({ 
      coreId: null, 
      secIdx: null, 
      terIdx: null, 
      step: 'core', 
      selectedEmotion: null 
    }),

  pickCore: (emotion) => set({
    coreId: emotion.id,
    secIdx: null,
    terIdx: null,
    step: 'secondary',
    selectedEmotion: { id: emotion.id, label: emotion.label },
  }),

  pickSec: (idx) => {
    const emotion = EMOTIONS.find((e) => e.id === get().coreId)
    set({
      secIdx: idx,
      terIdx: null,
      step: 'tertiary',
      selectedEmotion: { id: emotion.children[idx].id, label: emotion.children[idx].label },
    })
  },

  pickTer: (idx) => {
    const emotion = EMOTIONS.find((e) => e.id === get().coreId)
    const child   = emotion.children[get().secIdx]
    set({
      terIdx: idx,
      step: 'done',
      selectedEmotion: { id: child.children[idx].id, label: child.children[idx].label },
    })
  },

  goBack: () => {
    const { step, coreId, secIdx } = get()
    if (step === 'done') {
      const emotion = EMOTIONS.find((e) => e.id === coreId)
      const child   = emotion.children[secIdx]
      set({ terIdx: null, step: 'tertiary', selectedEmotion: { id: child.id, label: child.label } })
    }
    if (step === 'tertiary') {
      const emotion = EMOTIONS.find((e) => e.id === coreId)
      set({ secIdx: null, step: 'secondary', selectedEmotion: { id: emotion.id, label: emotion.label } })
    }
    if (step === 'secondary') {
      set({ coreId: null, step: 'core', selectedEmotion: null })
    }
  },

  jumpTo: (emIdx, ciIdx, giIdx) => {
    const em = EMOTIONS[emIdx]
    if (giIdx !== null && giIdx !== undefined) {
      const child = em.children[ciIdx]
      set({ coreId: em.id, secIdx: ciIdx, terIdx: giIdx, step: 'done',
        selectedEmotion: { id: child.children[giIdx].id, label: child.children[giIdx].label } })
    } else if (ciIdx !== null && ciIdx !== undefined) {
      set({ coreId: em.id, secIdx: ciIdx, terIdx: null, step: 'tertiary',
        selectedEmotion: { id: em.children[ciIdx].id, label: em.children[ciIdx].label } })
    } else {
      set({ coreId: em.id, secIdx: null, terIdx: null, step: 'secondary',
        selectedEmotion: { id: em.id, label: em.label } })
    }
  },

  addEmotion: ({ emotion, intensity }) => set({
    savedEmotions:   [...get().savedEmotions, { emotion, intensity }],
    coreId: null,
    secIdx: null,
    terIdx: null,
    step: 'core',
    selectedEmotion: null,
  }),

  removeEmotion: (idx) => set({
    savedEmotions: get().savedEmotions.filter((_, i) => i !== idx),
  }),

}))

export default useEmotionsStore
