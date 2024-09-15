import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from './../../auth/utils.mjs'
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
    const userId = getUserId(event.headers.Authorization)
    await deleteTodoLogic(userId, todoId)

    return {
      statusCode: 202,
      body: JSON.stringify({
        message: `TODO item ${todoId} deleted successfully`,
      })
     
    }
  })



