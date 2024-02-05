import speech from '@google-cloud/speech';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const credentials = process.env.NEXT_PUBLIC_GCLOUD_SERVICE_KEYS;
const c = JSON.parse(credentials);

const client = new speech.SpeechClient({ credentials: c }); // Changed from { c } to { credentials: c }

export const gcloudSpeech = async () => {
  const targetSampleRate = 16000;

const outputFilePath = join(__dirname,  'resampled_audio.wav');
console.log('output',outputFilePath)


  const resampledBuffer = fs.readFileSync(outputFilePath);

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: targetSampleRate,
    languageCode: 'ur-IN',
  };

  const audio = {
    content: resampledBuffer.toString('base64'),
  };

  const request = {
    audio,
    config,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join('\n');

  return transcription;
};
