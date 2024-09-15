import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from './../../auth/utils.mjs'
import { updateTodoLogic } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)

    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)
    const userId = getUserId(event.headers.Authorization)
    try {
      await updateTodoLogic(userId, todoId, updatedTodo)
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `TODO item ${todoId} updated successfully`,
        })
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: `Could not update TODO item ${todoId}`
        })
      }
    }
  })
