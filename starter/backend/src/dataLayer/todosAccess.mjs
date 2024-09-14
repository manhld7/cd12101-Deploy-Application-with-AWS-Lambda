import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('todoAccess')
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const todosTable = process.env.TODOS_TABLE;

export const getTodos = async (userId) => {
    logger.info('Getting all todo items')

    const command = new QueryCommand({
        TableName: todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    })
    const result = await docClient.send(command)
    return result.Items
}

export const getTodo = async (userId, todoId) => {
    logger.info(`Getting todo item: ${todoId}`)

    const command = new QueryCommand({
        TableName: todosTable,
        KeyConditionExpression: 'userId = :userId, todoId = :todoId',
        ExpressionAttributeValues: {
            ':userId': userId,
            ':todoId': todoId
        }
    })
    const result = await docClient.send(command)
    return result.Items
}

export const createTodo = async (newTodo) => {
    logger.info(`Creating new todo item: ${newTodo.todoId}`)
    const command = new PutCommand({
        TableName: todosTable,
        Item: newTodo
    })
    await docClient.send(command)
    return newTodo
}

export const updateTodo = async (userId, todoId, updatedTodo) => {
    logger.info(`Updating a todo item: ${todoId}`)
    const command = new UpdateCommand({
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
    await docClient.send(command);
}

export const deleteTodo = async (userId, todoId) => {
    const command = new DeleteCommand ({
        TableName: todosTable,
        Key: { userId, todoId }
    });
    await docClient.send(command);
}

export const saveImgUrl = async (userId, todoId, attachmentUrl) => {
    try {
        const command = new UpdateCommand({
            TableName: todosTable,
            Key: { userId, todoId },
            ConditionExpression: 'attribute_exists(todoId)',
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl,
            }
        })
        logger.info(`Updating image url for a todo item: ${attachmentUrl}`)
        await docClient.send(command);
    } catch (error) {
        logger.error(error)
    }
}