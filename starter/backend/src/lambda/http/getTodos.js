import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { getUserId } from '../utils.mjs'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.GROUPS_TABLE

export async function handler(event) {
  console.log('Processing event: ', event)

  const authorization = event.headers.Authorization
  const userId = getUserId(authorization)

  const scanCommand = {
    TableName: todosTable,
    FilterExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }
  const result = await dynamoDbClient.scan(scanCommand)
  const todos = result.Items

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todos
    })
  }
}
