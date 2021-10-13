import { useParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useEffect, useState } from 'react';
import { useSocket } from '../../providers/socket';
import axios from 'axios';
import { ChatContext, ChatProvider } from './ChatContext';

export function ChatScreen() {
  const { chat_id = null } = useParams<{ chat_id: string }>();
  const [status, setStatus] = useState('PENDENTE')

  const { socket } = useSocket();
  useEffect(() => {
    socket?.on('status', handlerStatusChange);
    loadStatus()

    return () => {
      socket?.off('status', handlerStatusChange);
    };
  }, [socket]);

  function handlerStatusChange(status: string) {
    setStatus(status)
  }

  async function loadStatus() {
    try {
      const { data } = await axios.get<{status: string}>('suportes/status');

      setStatus(data.status)
    } catch (error) {
      
    }
  }

  // if(status === 'PENDENTE') {
  //   return 'Cliente Whatsapp desconectado'
  // }

  return (
    <ChatProvider>
    <div className='absolute left-0 top-0 right-0 bottom-0 bg-gray-100'>
      <Sidebar />
      <div className='absolute right-0 top-0 bottom-0 left-80 flex-col flex'>
        <ChatHeader id={chat_id} />
        <ChatMessages id={chat_id} />
        <ChatInput id={chat_id} />
      </div>
    </div>
    </ChatProvider>
  );
}
