const { Configuration, OpenAIApi } = require('openai');
import fs from 'fs';
const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAIKEY,
});
const openai = new OpenAIApi(configuration);

const transcriptAudio=async(audio)=>{
try {
    const resp = await openai.createTranscription(
      fs.createReadStream(audio),
      'whisper-1'
    );
    
    return {msg:resp.data.text};

} catch (error) {
    return {msg:error.message}
}
}


export default transcriptAudio
