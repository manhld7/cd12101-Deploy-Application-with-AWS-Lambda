import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { parseUserId as getUserId } from './../../auth/utils.mjs'
import { createTodoLogic } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing event: ', event)

    const newTodo = JSON.parse(event.body)
    const userId = getUserId(event.headers.Authorization)
    const result = await createTodoLogic(userId, newTodo)

    return {
      statusCode: 201,
      body: JSON.stringify({
        items: result
      })
    }
  })

// export async function handler(event) {
//   console.log('Processing event: ', event)
//   const newTodo = JSON.parse(event.body)

//   const todoId = uuidv4()
//   const userId = getUserId(event.headers.Authorization)

//   newTodo = {
//     todoId,
//     userId,
//     attachmentUrl: '',
//     createdAt: new Date().toISOString(),
//     done: false,
//     ...newTodo
//   }

//   await dynamoDbClient.put({
//     TableName: todosTable,
//     Item: newTodo
//   })

//   return {
//     statusCode: 201,
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//       newTodo
//     })
//   }
// }

