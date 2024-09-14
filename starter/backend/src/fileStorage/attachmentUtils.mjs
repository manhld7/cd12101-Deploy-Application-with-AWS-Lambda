import { createLogger } from '../../utils/logger.mjs'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const logger = createLogger('generateUploadUrl')
const bucketName = process.env.S3_BUCKET
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION)
const region = Number(process.env.REGION)
const client = new S3Client({ region });

export const getAttachmentUrl = (todoId) => {
    return `https://${bucketName}.s3.amazonaws.com/${todoId}`
}

export const generateUploadUrl = async (todoId) => {
    logger.info('Generating upload URL:', {
        todoId,
        bucketName
    })

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: todoId
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: urlExpiration })
    logger.info('Generating upload URL:', {
        todoId,
        uploadUrl
    })
    return uploadUrl

}