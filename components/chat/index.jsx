'use client'
import React, { useEffect, useState } from 'react'
import ChatButton from './chat-button'
import Header from './header'
import Input from './input'
import Body from './body'
import axios from 'axios'

import Cookies from 'js-cookie'
import useAudioRecorder from '../../utils/recordAudio'

// const base = 'https://chatbot-backend-beta.vercel.app'
const base = 'http://localhost:3000'
var viewportWidth;
var viewportHeight;

const ChatWidget = ({ siteURL, lang, apiKey, mail }) => {

  const [verified, setVerified] = useState(true)


  let content =`I am an AI Assistant of ${siteURL}  here to help you with your queries. You can ask me anything about our products and services.`
  let defaultContextSchema = {
    role: 'system',
    content: content,
  }
  const [chatOpen, setChatOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [prompt, setPrompt] = useState('')

  const [messagesArray, setMessagesArray] = useState([defaultContextSchema])

  const toggleChat = () => {
    setChatOpen(!chatOpen)
  }
  useEffect(() => {
    console.log(chatOpen)
  }, [chatOpen])

  const {
    startRecording,
    stopRecording,
    togglePauseResume,

    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
  } = useAudioRecorder()

  const handleStartRecording = () => {
    startRecording()
  }

  const handleStopRecording = async () => {
    stopRecording()
  }

  useEffect(() => {
    handleAudioRecordingComplete(recordingBlob)
  }, [recordingBlob])

  const handleAudioRecordingComplete = async (audioBlob) => {
    const userMsg = {
      role: 'user',
      content: 'typing...',
    }
    setMessagesArray((prevState) => [...prevState, userMsg])

    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.wav')
      // formData.append('model', 'whisper-1')
      formData.append('language', 'en')

      let suffixURL = '/api/gcloud/speech2text'
      // lang == 'urdu' ? '/api/gcloud/speech2text' : '/api/voicechat'
      let voiceapi = base + suffixURL
      // let voiceapi = newbase + '/api/gcloud/speech2text'

      const response = await fetch(voiceapi, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { text } = await response.json()
        const filterMsgs = messagesArray.filter(
          (msg) => msg.content !== 'typing...'
        )
        setMessagesArray((prevState) => [...filterMsgs])
        updateMessagesArray(text)
      } else {
        console.error('Failed to send audio to the API.')
      }
    } catch (error) {
      // const { text } = await response.json()
      const filterMsgs = messagesArray.filter(
        (msg) => msg.content !== 'typing...'
      )
      setMessagesArray((prevState) => [...filterMsgs])

    }
  }

  const requestVoice = async (textInput) => {
    const url = base + '/api/readvoice'

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          text: textInput,
          voiceId:
            lang == 'urdu' ? 'ITzfpLru3rmUwQ0HH5ko' : 'EXAVITQu4vr4xnSDxMaL',
        }),
      })

      if (res.status === 200) {
        const audioBuffer = await res.arrayBuffer()
        const audioContext = new AudioContext()
        const audioBufferSource = audioContext.createBufferSource()
        audioContext.decodeAudioData(audioBuffer, (buffer) => {
          audioBufferSource.buffer = buffer
          audioBufferSource.connect(audioContext.destination)
          audioBufferSource.start()
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    if (
      messagesArray.length > 1 &&
      messagesArray[messagesArray.length - 1].role === 'user' &&
      messagesArray[messagesArray.length - 1].content !== 'typing...'
    ) {
      handleChatRequest()
    }
  }, [messagesArray, products])

  const updateMessagesArray = (newMessage) => {
    const newMessageSchema = {
      role: 'user',
      content: newMessage,
    }
    setMessagesArray((prevState) => [...prevState, newMessageSchema])
  }

  const handleChatRequest = async () => {
    const systemsmsg = {
      role: 'system',
      content: 'typing...',
    }
    setMessagesArray((prevState) => [...prevState, systemsmsg])
    console.log('Messages:-', messagesArray)
    const key = 'chat_memory'
    let convoSummary = Cookies.get(key) ? JSON.parse(Cookies.get(key)) : ''
    const aisummary = {
      role: 'system',
      content: 'this is the summary of conversation i know ' + convoSummary,
    }
    console.log('aisummary', aisummary)

    try {
      let obj = {
        conversationId: Cookies.get('convoId')
          ? Cookies.get('convoId')
          : '1234',
        textInput: messagesArray[messagesArray.length - 1].content,
        siteURL: siteURL,
      }

      // const apiUrl = base + '/api/chatgpt/streamai'
      const apiUrl = base + '/api/chatgpt/openai'

      const response = await axios.post(apiUrl, {
        input: obj,
        summary: aisummary,
      })
      console.log("RESPONSE FROM INDEX: ",response)

      let { result, summary, convoId } = await response.data
      console.log("YAAA got response")
      if (obj.conversationId.length < 5) {
        Cookies.set('convoId', convoId)
      }

      console.log('result', result)

      if (result.content?.length > 0) {
        // setMessagesArray((prevState) => [...prevState, result])
        // deleting loading msg and adding new msg
        let newMessagesArray = messagesArray.filter(
          (msg) => msg.content !== 'typing...'
        )

        setMessagesArray((prevState) => [...newMessagesArray, result])
        await requestVoice(result.content)

        Cookies.remove(key)
        Cookies.set(key, JSON.stringify(summary))
      } else if (result.funcResult.length > 0) {
        let newMessagesArray = messagesArray.filter(
          (msg) => msg.content !== 'typing...'
        )
        console.log('heyyyyyyyy')
        setMessagesArray((prevState) => [...newMessagesArray, result])
        console.log('result')

        Cookies.remove(key)
        Cookies.set(key, JSON.stringify(summary))
      } else {
        setProducts(result.result)

        let newMessagesArray = messagesArray.filter(
          (msg) => msg.content !== 'typing...'
        )
        setMessagesArray((prevState) => [...newMessagesArray, result])
        Cookies.remove(key)
        Cookies.set(key, JSON.stringify(summary))
      }
    } catch (error) {
      let urdu =
        'معذرت، میں آپ کے سوال کو سمجھنے کے قابل نہیں ہوں۔ دوبارہ کوشش کریں.'
      const result = {
        role: 'system',
        content:
          lang == 'en'
            ? 'Sorry, I am not able to understand your query. Please try again.'
            : urdu,
      }

      let newMessagesArray = messagesArray.filter(
        (msg) => msg.content !== 'typing...'
      )
      setMessagesArray((prevState) => [...newMessagesArray, result])
      await requestVoice(result.content)

      console.error('Error:', error)
    }
  }

  const handleTextSubmit = (prompt) => {
    if (prompt == '') {
      alert('no input')
      return
    } else {
      updateMessagesArray(prompt)
      setPrompt('')
    }
  }
  console.log("messages",messagesArray)

  return (
    <div className="justvoice__widget relative  ">
      {chatOpen && (
        // <div className="character-element absolute bottom-0 left-[-90%] transition-all duration-500 ">
        <div className="character-element absolute bottom-0 left-0 transform translate-x-[-90%] transition-transform duration-500 ">
          <img
            style={{
              width: '400px',
              height: '500px',
            }}
            src={'/images/nani_pk.svg'}
            alt="Nani"
          />
        </div>
      )}

      <div className={`justvoice__chatBtn  ${
          chatOpen ? 'justvoice__chatBtn__open' : 'justvoice__chatBtn__close'
        } `}>
        <ChatButton
          prompt={prompt}
          handleTextSubmit={handleTextSubmit}
          toggleChat={toggleChat}
          chatOpen={chatOpen}
        />
      </div>
      <div
        className={`${
          chatOpen
            ? 'justvoice__chat__size__open border-2'
            : 'justvoice__chat__size__close '
        } justvoice__chat__main 
        `}
        
      >
        <Header toggleChat={toggleChat} />

        <div className="justvoice__chat__x2b3f5h9c8 relative ">
          <Body messages={messagesArray} />
        </div>
       
        <Input
          prompt={prompt}
          setPrompt={setPrompt}
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
          isRecording={isRecording}
          />
        
      </div>
    </div>
  )
}

export default ChatWidget
