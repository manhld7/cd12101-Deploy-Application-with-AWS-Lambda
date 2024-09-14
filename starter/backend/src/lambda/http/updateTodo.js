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

// export async function handler(event) {
//   const todoId = event.pathParameters.todoId
//   const updatedTodo = JSON.parse(event.body)
  
//   const userId = getUserId(event.headers.Authorization)
//   try {
//     const result = await dynamoDbClient.get({
//       TableName: todosTable,
//       Key: {
//         userId,
//         todoId
//       }
//     })

//     if (!result.Item) {
//       return {
//         statusCode: 404,
//         body: JSON.stringify({
//           error: 'TODO item not found'
//         })
//       }
//     }

//     await dynamoDbClient.update({
//       TableName: todosTable,
//       Key: {
//         userId,
//         todoId
//       },
//       UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
//       ExpressionAttributeNames: {
//         '#name': 'name'
//       },
//       ExpressionAttributeValues: {
//         ':name': updatedTodo.name,
//         ':dueDate': updatedTodo.dueDate,
//         ':done': updatedTodo.done
//       }
//     })

//     return {
//       statusCode: 200,
//       body: JSON.stringify({
//         message: 'TODO item updated successfully'
//       })
//     }
//   } catch (error) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({
//         error: 'Could not update TODO item'
//       })
//     }
//   }
// }
