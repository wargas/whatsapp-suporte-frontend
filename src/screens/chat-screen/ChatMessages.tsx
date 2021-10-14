import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Message } from '../../interfaces';
import { useSocket } from '../../providers/socket';

export function ChatMessages({ id }: any) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [containerRef, setContainerRef] = useState<any>(null);

  const { socket } = useSocket();

  useEffect(() => {
    socket?.on('message', handlerNewMessage);

    return () => {
      socket?.off('message', handlerNewMessage);
    };
  }, [id]);

  useEffect(() => {
    setMessages([]);
    loadMessages();
  }, [id]);

  useEffect(() => {
    scrollBottom();
  }, [containerRef]);

  function scrollBottom() {
    if (containerRef) {
      console.log(containerRef.scrollHeight, containerRef.scrollTop);
      containerRef.scrollTop = containerRef.scrollHeight;
    }
  }

  async function handlerNewMessage(message: any) {
    if (!message.fromMe) {
      toast.info(`${message.chat.name} ${message.body}`, { theme: 'light' });
    }
    loadMessages();
  }

  async function loadMessages() {
    try {
      const { data } = await axios.get(`suportes/${id}/messages`);

      setMessages(data);
    } catch (error) {}

    scrollBottom()
  }

  return (
    <div
      ref={setContainerRef}
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'white' }}
      className='flex-1 overflow-y-scroll'>
      <div className='flex flex-col justify-end '>
        {messages.map((message: any) => (
          <div key={message.id._serialized} className='flex'>
            <div
              className={`p-3 text-sm max-w-sm ${
                message.fromMe ? 'ml-auto bg-green-50' : 'mr-auto bg-white'
              } mx-5 my-1 rounded-t-lg rounded-l-lg  shadow-sm`}>
              {message.hasMedia && message.type === 'image' && (
                <img
                  className='rounded-lg cursor-pointer'
                  src={`http://${process.env.REACT_APP_API}/api/v1/media/${message.id._serialized}`}
                  alt=''
                />
              )}
              {message.hasMedia && message.type === 'ptt' && (
                <audio controls>
                  <source
                    src={`http://${process.env.REACT_APP_API}/api/v1/media/${message.id._serialized}`}
                  />
                </audio>
              )}
              {message.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
