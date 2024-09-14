import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { parseUserId as getUserId } from './../../auth/utils.mjs'
import { generateUploadUrl } from '../../fileStorage/attachmentUtils.mjs'

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

    await saveImgUrl(userId, todoId, uploadUrl)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  })