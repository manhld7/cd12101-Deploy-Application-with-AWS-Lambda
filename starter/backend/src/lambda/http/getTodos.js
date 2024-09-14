import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { parseUserId as getUserId } from './../../auth/utils.mjs'
import { getTodoLogic } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)

    const userId = getUserId(event.headers.Authorization)
    const result = await getTodoLogic(userId)
    if (!result.Item) {
      return {
          statusCode: 404,
          body: JSON.stringify({
              error: `TODO item ${todoId} not found`
          })
      }
    }
  
    return {
      statusCode: 201,
      body: JSON.stringify({
        items: result
      })
    }
  })
