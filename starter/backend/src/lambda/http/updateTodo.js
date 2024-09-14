import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { parseUserId as getUserId } from './../../auth/utils.mjs'
import { getTodoLogic, updateTodoLogic } from '../../businessLogic/todos.mjs'

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
      const checkTodo = await getTodoLogic(userId)
      if (!checkTodo.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                error: `TODO item ${todoId} not found`
            })
        }
      }

      const result = await updateTodoLogic(userId, updatedTodo)
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `TODO item ${todoId} updated successfully`,
          items: result
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
