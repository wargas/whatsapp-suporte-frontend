import axios from 'axios';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MessageItem } from '../../components/MessageItem';
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

    scrollBottom();
  }

  return (
    <div
      ref={setContainerRef}
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'white' }}
      className='flex-1 overflow-y-scroll'>
      <div className='flex flex-col justify-end '>
        {messages.map((message: any, index) => {
          let changedDate = true
          if(index > 0) {
            const lastMsg = messages[index - 1];

            const lastDate = DateTime.fromMillis(lastMsg.timestamp*1000).toSQLDate()
            const currDate = DateTime.fromMillis(message.timestamp*1000).toSQLDate()

            changedDate = lastDate !== currDate

          }
          const lastMessage = messages[index - 1]

          return <MessageItem changedDate={changedDate} message={message} key={message.id._serialized} />;
        })}
      </div>
    </div>
  );
}
