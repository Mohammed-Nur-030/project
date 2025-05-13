import CloudConvert from 'cloudconvert'
import fs from 'fs'
import formidable from 'formidable'
import axios from 'axios'

const cloudConvert = new CloudConvert(
  process.env.NEXT_PUBLIC_CLOUD_CONVERT_APIKEY
)

const targetSampleRate = 16000 // Change this to your desired rate

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    // Handle preflight request
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.status(200).end()
    return
  }
  try {
    const form = formidable({})
    const formFields = await new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          reject(err)
          return
        }
        resolve({
          files,
        })
      })
    })

    const file = formFields.files.file[0]

    const job = await cloudConvert.jobs.create({
      tasks: {
        'import-1': {
          operation: 'import/upload',
        },
        'task-1': {
          operation: 'convert',
          input_format: 'wav',
          output_format: 'wav',
          engine: 'ffmpeg',
          input: ['import-1'],
          audio_codec: 'pcm_s16le',
          audio_bitrate: 128,
          sample_rate: 16000,
        },
        'export-1': {
          operation: 'export/url',
          input: ['task-1'],
          inline: true,
          archive_multiple_files: true,
        },
      },
    })

    const uploadTask = job.tasks.find((task) => task.name === 'import-1')

    // Use fs.createReadStream to create a readable stream from the file
    const audioStream = fs.createReadStream(file.filepath)

    // Pass the audio stream directly to the cloudConvert.tasks.upload method
    await cloudConvert.tasks.upload(uploadTask, audioStream, 'audio.wav')

    let jobCompleted = await cloudConvert.jobs.wait(job.id)

    let resampledFileUrl
    if (jobCompleted.status == 'finished') {
      const exportUrls = cloudConvert.jobs.getExportUrls(jobCompleted)
      if (!exportUrls.length) {
        throw new Error('Export URLs not found in CloudConvert job')
      }
      resampledFileUrl = exportUrls[0].url
    }

    const { data: resampledBuffer } = await axios.get(resampledFileUrl, {
      responseType: 'arraybuffer',
    })

    console.log(resampledFileUrl)

    console.log(resampledBuffer)

    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: targetSampleRate,
      languageCode: 'UR-IN',
    }

    const audio = {
      content: Buffer.from(resampledBuffer).toString('base64'),
    }

    const request = {
      audio: audio,
      config: config,
    }

    let apiKey = process.env.NEXT_PUBLIC_GCLOUD_API_KEY

    // Specify the endpoint URL for the Google Cloud Speech API
    const endpointUrl = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`

    // Send a POST request to the endpoint URL with the JSON object in the body
    const response = await axios.post(endpointUrl, request) 
    console.log(response)// Use axios instead of requests

    // Get the transcription from the response
    const text = response.data.results // Use response.data instead of response.json()
      .map((result) => result.alternatives[0].transcript)
      .join('\n')
    return res.json({ text })
  } catch (error) {
    return res.status(500).json({ error: error })
  }
}
