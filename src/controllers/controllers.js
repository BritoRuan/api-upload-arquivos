const s3  = require('../conections/aws')

const getFiles = async (req, res) => {
  try {
    const archive = await s3.listObjects({
      Bucket: process.env.BACKBLACK_BUCKET
    }).promise()

    const files = archive.Contents.map((file) => {
      return {
        url: `https://${process.env.BACKBLACK_BUCKET}.${process.env.ENDPOINT_S3}/${file.Key}`,
        path: file.Key,
      }
    })

    return res.status(200).json(files)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const uploadFile = async (req, res) => {
  const { file } = req
  try {
    const upload = await s3.upload({
      Bucket: process.env.BACKBLACK_BUCKET,
      Key: `imagens/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype
    }).promise()

    return res.status(200).json({
    url: upload.Location,
    path: upload.Key
  })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const uploadFileMultiple = async (req, res) => {
  const { files } = req
  try {
    const result = []
    for (const file of files) {
      const upload = await s3.upload({
        Bucket: process.env.BACKBLACK_BUCKET,
        Key: `imagens/multiplas/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype
      }).promise()

      result.push({
        url: upload.Location,
        path: upload.Key
      })
    }
    return res.status(200).json(result)

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const deleteFiles = async (req, res) => {
  const { file } = req.query
  try {
    await s3.deleteObject({
      Bucket: process.env.BACKBLACK_BUCKET,
      Key: file
    }).promise() 

    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getFiles,
  uploadFile,
  uploadFileMultiple,
  deleteFiles
}