import { MessageModel } from "../models/message.model.js";
import { ConversationModel } from "../models/conversation.model.js";
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const senderId = req.id;
        const receiverId = req.params.id;
        let conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        });
        if (!conversation) {
            ConversationModel.create({
                participants: [senderId, receiverId],
            });
        }
        const newMessage = await MessageModel.create({
            senderId,
            receiverId,
            message
        });
        if (newMessage)
            conversation?.messages.push(newMessage._id);
        await Promise.all([conversation?.save(), newMessage.save()]);
        // implement socket io for real time data transfer
        return res.status(201).json({
            success: true,
            newMessage
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to send message",
            error: error.message,
            success: false
        });
    }
};
export const getConversation = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await ConversationModel.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');
        if (!conversation)
            return res.status(200).json({ success: true, messages: [] });
        return res.status(201).json({
            messages: conversation?.messages,
            success: true
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(401).json({
            message: "Unable to send message",
            error: error.message,
            success: false
        });
    }
};
