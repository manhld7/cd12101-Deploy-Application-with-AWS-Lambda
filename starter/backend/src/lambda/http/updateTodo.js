import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { getUserId } from '../auth/utils.mjs'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.GROUPS_TABLE

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const userId = getUserId(event.headers.Authorization)
  try {
    const result = await dynamoDbClient.get({
      TableName: todosTable,
      Key: {
        userId,
        todoId
      }
    })

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'TODO item not found'
        })
      }
    }

    await dynamoDbClient.update({
      TableName: todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':dueDate': updatedTodo.dueDate,
        ':done': updatedTodo.done
      }
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'TODO item updated successfully'
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Could not update TODO item'
      })
    }
  }
}
