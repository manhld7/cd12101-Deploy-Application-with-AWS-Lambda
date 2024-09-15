import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from './../../auth/utils.mjs'
import { getAttachmentUrl, generateUploadUrl } from '../../fileStorage/attachmentUtils.mjs'
import { saveImgUrlLogic } from '../../businessLogic/todos.mjs'

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
    const todoId = event.pathParameters.todoId
    const uploadUrl = await generateUploadUrl(todoId)
    const attachmentUrl = getAttachmentUrl(todoId)
    await saveImgUrlLogic(userId, todoId, attachmentUrl)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  })