import Message from '../../models/Message'
import db from '../../utils/db'
import Conversation from '../../models/Conversation'

const handler=async(req,res)=>{
    await db.connect()
    await Message.deleteMany({})
    await Conversation.deleteMany({})
    await db.disconnect()
    res.send("deleted")
}

export default handler