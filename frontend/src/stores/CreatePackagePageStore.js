import { create } from 'zustand';

const useCreatePackage = create((set) => ({
  packageTitle: '',
  questions: [],
  currentQuestion: '',
  currentTime: '',

  setPackageTitle: (title) => set({ packageTitle: title }),

  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setCurrentTime: (time) => set({ currentTime: time }),

  addQuestion: () => set((state) => ({
    questions: [
      ...state.questions,
      { id: state.questions.length + 1, content: state.currentQuestion, time: state.currentTime },
    ],
    currentQuestion: '',
    currentTime: '',
  })),

  removeQuestion: (id) => set((state) => ({
    questions: state.questions.filter((q) => q.id !== id),
  })),

  resetPackage: () => set({ packageTitle: '', questions: [], currentQuestion: '', currentTime: '' }),
}));

export default useCreatePackage;
