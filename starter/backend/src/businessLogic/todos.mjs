import { v4 as uuidv4 } from 'uuid'
import { getTodos, getTodo, createTodo, updateTodo, deleteTodo, saveImgUrl } from '../dataLayer/todosAccess.mjs'

export const getTodosLogic = async (userId) => {
    return getTodos(userId)
}

export const getTodoLogic = async (userId, todoId) => {
    return getTodo(userId, todoId)
}

export const createTodoLogic = async (userId, todo) => {
    const todoId = uuidv4()
    return createTodo({
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false,
        ...todo
    })
}

export const updateTodoLogic = async (userId, todoId, todo) => {
    return updateTodo(userId, todoId, todo)
}

export const deleteTodoLogic = async (userId, todoId) => {
    return deleteTodo(userId, todoId)
}

export const saveImgUrlLogic = async (userId, todoId, attachmentUrl) => {
    return saveImgUrl(userId, todoId, attachmentUrl)
}
