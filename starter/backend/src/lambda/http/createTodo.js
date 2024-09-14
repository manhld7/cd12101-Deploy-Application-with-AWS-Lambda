import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { getUserId } from '../auth/utils.mjs'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.GROUPS_TABLE

export async function handler(event) {
  console.log('Processing event: ', event)
  const newTodo = JSON.parse(event.body)

  const todoId = uuidv4()
  const userId = getUserId(event.headers.Authorization)

  newTodo = {
    todoId,
    userId,
    attachmentUrl: '',
    createdAt: new Date().toISOString(),
    done: false,
    ...newTodo
  }

  await dynamoDbClient.put({
    TableName: todosTable,
    Item: newTodo
  })

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newTodo
    })
  }
}

