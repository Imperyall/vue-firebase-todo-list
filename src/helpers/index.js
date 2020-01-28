import { TODO_PER_PAGE } from './constants'

export const getPageCount = size =>
  size <= TODO_PER_PAGE ? 1 : Math.ceil(size / TODO_PER_PAGE)

export const getStartAt = (page, pages) =>
  (Math.min(page, pages) - 1) * TODO_PER_PAGE
