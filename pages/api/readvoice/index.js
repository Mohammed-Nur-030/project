import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const baseUrl = 'https://api.elevenlabs.io/v1/text-to-speech';
    const headers = {
      'Content-Type': 'application/json',
      'xi-api-key': '97ea84f39840ab0ac448400c4f33e9a1',
    }

    const reqbody = JSON.parse(req.body);

    // console.log('reqbody text', reqbody.voiceId)

    const requestBody = {
      text: reqbody.text,
      model_id: 'eleven_multilingual_v1',
      voice_settings: {
        stability: 0,
        similarity_boost: 0,
        style: 0.5,
        use_speaker_boost: true,
      },
    };

    const response = await fetch(`${baseUrl}/${reqbody.voiceId}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      responseType: 'blob',
    });

    // console.log('response', response)

    if (response.status === 200) {
      const audioBlob = await response.blob();
      const audioBuffer = await audioBlob.arrayBuffer();
      res.status(200).send(Buffer.from(audioBuffer));
    } else {
      res.status(405).json({ message: 'Some error occurred' });
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Error occurred', error });
  }
}
