import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { parseUserId as getUserId } from './../../auth/utils.mjs'
import { deleteTodoLogic } from '../../businessLogic/todos.mjs'

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
    const userId = getUserId(event)

    await deleteTodoLogic(userId, todoId)

    return {
      statusCode: 202,
      message: `TODO item ${todoId} deleted successfully`
    }
  })



