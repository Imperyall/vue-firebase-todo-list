import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { db, Timestamp } from '../db'
import { COLLECTION, TODO_PER_PAGE } from '../helpers/constants'
import { getPageCount, getStartAt } from '../helpers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    todos: [],
    pages: 0,
    loading: true
  },
  mutations: {
    loading: (state, payload) => (state.loading = payload),
    pages: (state, payload) => (state.pages = payload),
    ...vuexfireMutations
  },
  actions: {
    bindTodos: firestoreAction(({ commit, bindFirestoreRef }, page) =>
      // Получаем список всех записей
      db
        .collection(COLLECTION)
        .orderBy('createdAt', 'desc')
        .get()
        .then(snapshot => {
          let ref = db
            .collection(COLLECTION)
            .orderBy('createdAt', 'desc')
            .limit(TODO_PER_PAGE)

          // Считаем количество страниц
          const pages = getPageCount(snapshot.size)

          // Делаем смещение, если страница не первая
          if (page !== 1 && pages > 1) {
            const last = snapshot.docs[getStartAt(page, pages)].data()

            ref = ref.startAt(last.createdAt)
          }

          commit('pages', pages)
          bindFirestoreRef('todos', ref)
        })
        // Окончание загрузки
        .then(() => commit('loading', false))
    ),
    addTodo: firestoreAction(({ commit }, title) =>
      db
        .collection(COLLECTION)
        .add({
          title,
          complete: false,
          createdAt: Timestamp.now()
        })
        // Обновление количества страниц
        .then(() => db.collection(COLLECTION).get())
        .then(snapshot => commit('pages', getPageCount(snapshot.size)))
    ),
    updateTodo: firestoreAction((_, { id, ...rest }) => {
      if (rest.complete) {
        rest.completedAt = Timestamp.now()
      }

      db.collection(COLLECTION)
        .doc(id)
        .update({ ...rest })
    }),
    removeTodo: firestoreAction(({ commit }, id) =>
      db
        .collection(COLLECTION)
        .doc(id)
        .delete()
        // Обновление количества страниц
        .then(() => db.collection(COLLECTION).get())
        .then(snapshot => commit('pages', getPageCount(snapshot.size)))
    ),
    loading: firestoreAction(({ commit, unbindFirestoreRef }) => {
      unbindFirestoreRef('todos')
      commit('loading', true)
    })
  },
  getters: {
    todos: state => state.todos,
    pages: state => state.pages,
    loading: state => state.loading
  }
})
