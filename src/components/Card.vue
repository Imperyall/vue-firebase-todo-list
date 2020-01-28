<template>
  <v-card
    :loading="loading && 'secondary'"
    class="main mx-auto"
    color="blue-grey lighten-4"
  >
    <v-card-title>Задачи</v-card-title>
    <v-card-text class="px-4 py-0">
      <v-textarea
        v-if="!loading"
        v-model="text"
        @keypress.enter.prevent="add"
        class="pb-3"
        color="secondary"
        clearable
        clear-icon="fas fa-times"
        auto-grow
        solo
        rows="3"
        hide-details="auto"
        placeholder="Enter a title for this card..."
      ></v-textarea>
      <v-text-field
        v-for="(todo, idx) in todos"
        v-model="todo.title"
        @change="edit(todo)"
        :readonly="todo.complete"
        :key="idx"
        :class="!loading && todos.length - 1 !== idx && 'mb-3'"
        class="field"
        :title="getTitle(todo)"
        solo
        dense
        hide-details
      >
        <!-- <v-icon small slot="append">fas fa-pen</v-icon> -->
        <v-btn v-if="!todo.complete" @click="complete(todo)" icon slot="append">
          <v-icon small>fas fa-check</v-icon>
        </v-btn>
        <v-btn @click="remove(todo.id)" icon slot="append">
          <v-icon small>fas fa-times</v-icon>
        </v-btn>
      </v-text-field>
    </v-card-text>
    <v-card-actions class="d-flex flex-column pa-4">
      <v-pagination
        v-if="pages > 1"
        @input="changePage"
        :value="page"
        :length="pages"
      ></v-pagination>
      <div class="d-flex mt-3 w-100">
        <v-btn
          @click="add"
          :disabled="!text || !text.length"
          color="green darken-2 white--text"
        >
          Add Card
        </v-btn>
      </div>
      <!-- <v-btn icon>
        <v-icon>fas fa-ellipsis-h</v-icon>
      </v-btn> -->
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import { COLLECTION, DEFAULT_PAGE } from '../helpers/constants'

export default {
  name: 'card',
  data: () => ({
    text: ''
  }),
  computed: {
    page() {
      const { id = 1 } = this.$route.params

      return isNaN(id) || id <= 0 ? 1 : +id
    },
    ...mapState([COLLECTION, 'loading', 'pages'])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$store.dispatch('bindTodos', this.page)
    },
    add() {
      if (this.text.trim() === '') {
        return
      }

      this.$store.dispatch('addTodo', this.text)
      this.text = ''

      // Редирект на главную при каждом добавлении записи
      if (this.page !== 1) {
        this.push()
      }
    },
    edit(todo) {
      // Удаление записи, если текст отсутствует
      if (todo.title && todo.title.trim() === '') {
        return this.remove(todo.id)
      }

      this.$store.dispatch('updateTodo', todo)
    },
    complete(todo) {
      // id не является перечисляемым свойством, поэтому задано явно
      this.edit({ ...todo, id: todo.id, complete: true })
    },
    remove(id) {
      this.$store.dispatch('removeTodo', id)
    },
    changePage(page) {
      if (page !== this.page && page <= this.pages) {
        this.push(page)
      }
    },
    push(page) {
      page = !page ? DEFAULT_PAGE : `/page/${page}`

      this.$store.dispatch('loading')
      this.$router.push(page)
    },
    // Всплывающее окно с заголовком, датой создания и датой выполнения
    getTitle: ({ title, createdAt, completedAt }) =>
      `${title}\n\nСоздано: ${createdAt.toDate().toLocaleString()}${
        completedAt
          ? `\nЗавершено: ${completedAt.toDate().toLocaleString()}`
          : ''
      }`
  },
  watch: {
    $route() {
      // Смещение списка согласно странице
      this.init()
    },
    pages(pages) {
      // Редирект на главную, если изменилось количество страниц и текущая вышла за границы
      if (this.page > pages) {
        this.push()
      }
    }
  }
}
</script>

<style>
.main {
  max-width: 420px !important;
}
.w-100 {
  width: 100%;
}
</style>
