import React, { useState, useEffect, useRef  } from 'react';
import { ChatServerClient } from '../../proto/msg_grpc_web_pb';
import { ChatMessage, Empty } from '../../proto/msg_pb';
// import { AiOutlineSend } from "react-icons/ai";

import HotelChat from '../HotelChat';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(''); // Selected hotel ID

  const messageContainerRef = useRef(null); // Reference to the message container


  const client = new ChatServerClient('http://localhost:8080', null, null);

  // Define a list of available hotels and their IDs
  const availableHotels = [
    { id: 'hotel1', name: 'Hotel 1' },
    { id: 'hotel2', name: 'Hotel 2' },
    { id: 'hotel3', name: 'Hotel 3' },
    // Add more hotels as needed
  ];

  useEffect(() => {
    if (!userName) {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName);
      } else {
        const name = prompt('Please enter your name:');
        if (name) {
          setUserName(name);
          localStorage.setItem('userName', name);
        }
      }
    }
  }, [userName]);

  useEffect(() => {
    if (userName) {
      startChat();
    }
  }, [userName]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const startChat = () => {
    const stream = client.chatStream(new Empty());
    console.log('start chat on app.js')

    stream.on('data', response => {
      console.log('streaming')
      setMessages(prevMessages => [...prevMessages, response]);
    });

    stream.on('error', error => {
      console.error('Error in gRPC stream:', error);
    });

  };


  const sendMessage = () => {
    if (!userName) {
      alert('Please enter your name first.');
      return;
    }

    if (!selectedHotel) {
      alert('Please select a hotel from the dropdown.');
      return;
    }

    const timestampParts = getCurrentTimestamp();
    const chatMessage = new ChatMessage();
    chatMessage.setFromUserId(userName);
    chatMessage.setToUserId(selectedHotel); // User can select a hotel from the dropdown
    chatMessage.setHotelId(selectedHotel); // Set the hotel's ID
    chatMessage.setContent(messageText);
    chatMessage.setContentType('text');
    // chatMessage.setTimestamp(timestampParts.date + ' ' + timestampParts.time);
    chatMessage.setTimestamp(timestampParts.date);

    client.sendChatMessage(chatMessage, {}, (err, response) => {
      if (err) {
        console.error('Error sending message:', err);
      } else {
        setMessages(prevMessages => [...prevMessages, chatMessage]);
      }
    });
    console.log(messageText)
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
      <div style={{ height: '500px' }} className=' border bg-gradient-to-l from-purple-300 to-purple-100 w-4/12 m-auto mt-5 p-8 rounded-3xl relative'>
        <h1 className='text-center text-2xl pb-5'>Chat App</h1>
        <div>

          <div className='pb-5'>
            <label >Select a Hotel:</label>
            <select
              className='border text-xs ml-2'
              value={selectedHotel}
              onChange={e => setSelectedHotel(e.target.value)}
            >
              <option value="">Select a Hotel</option>

              {availableHotels.map(hotel => (
                <option className='text-sm' key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}

            </select>
          </div>

          {/* {JSON.stringify(messages.length)} */}
          <div ref={messageContainerRef} style={{ maxHeight: "320px" }} className='overflow-y-auto '>
            {messages.map((msg, index) => (
              <div key={index} className={`py-1 ${userName !== msg.getFromUserId() ? "" :"text-end" }`}>
                <div className={`${msg.getFromUserId() === "Server" ? "bg-green-500 text-white" : userName !== msg.getFromUserId() ? "bg-white text-black" : "bg-blue-600 text-white "}  inline-block px-2 rounded`}>
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
            style={{ paddingLeft: messageText ? '10px' : '0' , paddingRight: messageText ?'10px' : '0'}}
            onChange={e => {
              setMessageText(e.target.value);
            }

            }
          />
          {/* <i className='my-auto' onClick={sendMessage}><AiOutlineSend size={20} color='blue'/></i> */}

          <button onClick={sendMessage} className='bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-800'>Send</button>
        </div>

      </div>

      {selectedHotel && (
                <HotelChat hotelId={selectedHotel} userId={userName} />
            )}

    </div>

  );
}

export default ChatBot;
