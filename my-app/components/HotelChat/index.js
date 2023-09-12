// HotelChat.js

import React, { useState, useEffect, useRef  } from 'react';
import { ChatServerClient } from '../../proto/msg_grpc_web_pb';
import { ChatMessage, Empty } from '../../proto/msg_pb';

function HotelChat({ hotelId, userId}) {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');

    const messageContainerRef = useRef(null); // Reference to the message container


    const client = new ChatServerClient('http://localhost:8080', null, null);

    useEffect(() => {
        startChat();
    }, []);

    useEffect(() => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
      }, [messages]);

    const startChat = () => {
        const stream = client.chatStream(new Empty());
        stream.on('data', response => {
            // console.log('recieved response', response)
            if (response.getToUserId() === hotelId) {
                setMessages(prevMessages => [...prevMessages, response]);
            }
        });

        stream.on('error', error => {
            console.error('Error in gRPC hotel stream:', error);
        });
    };

    const sendMessage = () => {

        if (!hotelId) {
            alert('Invalid hotel ID.');
            return;
        }

        const timestampParts = getCurrentTimestamp();

        const chatMessage = new ChatMessage();
        chatMessage.setFromUserId(hotelId);
        chatMessage.setToUserId(userId); // Send back to the user who initiated the chat
        chatMessage.setHotelId(hotelId);
        chatMessage.setContent(messageText);
        chatMessage.setContentType('text');
        // chatMessage.setTimestamp(timestampParts.date + ' ' + timestampParts.time);
        chatMessage.setTimestamp(timestampParts.now);

        client.sendChatMessage(chatMessage, {}, (err, response) => {
            if (err) {
                console.error('Error sending message:', err);
            } else {
                setMessages(prevMessages => [...prevMessages, chatMessage]);
            }
        });
        setMessageText('');
    };

    const getCurrentTimestamp = () => {
        const now = new Date();
        const isoTimestamp = now.toISOString();
        const [datePart, timePart] = isoTimestamp.split('T');
        const [dateYear, dateMonth, dateDay] = datePart.split('-');
        // const [timeHour, timeMinute, timeSecond] = timePart.split(':');
        return {
            date: `${dateDay}-${dateMonth}-${dateYear}`,
            // time: `${timeHour}:${timeMinute}:${timeSecond}`,
        };
    };

    return (
       
        <div className='relative'>
        <div style={{ height: '500px' }} className=' border bg-gradient-to-l from-purple-300 to-purple-100 w-4/12 m-auto my-5 p-8 rounded-3xl relative'>
          <h1 className='text-center text-2xl pb-5'>Hotel App</h1>
          <div>
  
            {/* {JSON.stringify(messages.length)} */}
            <div ref={messageContainerRef} style={{ maxHeight: "360px" }} className='overflow-y-auto'>
              {messages.map((msg, index) => (
                <div key={index} className={`py-1 ${userId !== msg.getFromUserId() ? "text-end" :"" }`}>
                  <div className={`${msg.getFromUserId() === "Server" ? "bg-green-500" : userId !== msg.getFromUserId() ? " bg-blue-600 text-white" : "bg-white text-black"}  inline-block px-2 rounded`}>
                    <span className='text-sm pr-2'>{msg.getFromUserId()}:</span>
                    <span className='text-sm'>{msg.getContent()}</span>
  
                  </div>
  
                </div>
              ))}
            </div>
  
          </div>
  
          {/* Absolutely positioned div at the bottom */}
          <div className='my-2 absolute bottom-0 w-full'>
            <input
              className='border mr-2 h-8 rounded-lg w-8/12'
              type="text"
              value={messageText}
              style={{ paddingLeft: messageText ? '10px' : '0', paddingRight: messageText ?'10px' : '0' }}
              onChange={e => {
                setMessageText(e.target.value);
              }
  
              }
            />
            {/* <i className='my-auto' onClick={sendMessage}><AiOutlineSend size={20} color='blue'/></i> */}
  
            <button onClick={sendMessage} className='bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-800'>Send</button>
          </div>
  
        </div>
  
      </div>
    );
}



export default HotelChat;
