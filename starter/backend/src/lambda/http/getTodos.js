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

// export async function handler(event) {
//   console.log('Processing event: ', event)

//   const authorization = event.headers.Authorization
//   const userId = getUserId(authorization)

//   const scanCommand = {
//     TableName: todosTable,
//     FilterExpression: 'userId = :userId',
//     ExpressionAttributeValues: {
//       ':userId': userId
//     }
//   }
//   const result = await dynamoDbClient.scan(scanCommand)
//   const todos = result.Items

//   return {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//       items: todos
//     })
//   }
// }
