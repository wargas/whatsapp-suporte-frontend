import axios from 'axios';
import { useEffect, useState } from 'react';
import { Message } from '../../interfaces';

export function ChatMessages({ id }: any) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([]);
    loadMessages();
  }, [id]);

  async function loadMessages() {
    try {
      const { data } = await axios.get(`suportes/${id}/messages`);

      setMessages(data);
    } catch (error) {}
  }

  return (
    <div
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'white' }}
      className='flex-1 overflow-y-scroll'>
      <div className='flex h-screen flex-col justify-end '>
        {messages.map((message:any) => (
          <div key={message.id._serialized} className='flex'>
            <div
              className={`p-3 text-sm max-w-sm ${
                message.fromMe ? 'ml-auto bg-green-50' : 'mr-auto bg-white'
              } mx-5 my-1 rounded-t-lg rounded-l-lg  shadow-sm`}>
              {message.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
