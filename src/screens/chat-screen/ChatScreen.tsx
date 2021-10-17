import { useParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useEffect, useState } from 'react';
import { useSocket } from '../../providers/socket';
import axios from 'axios';
import qrcodeSvg from 'qrcode-svg';
import { ChatContext, ChatProvider } from './ChatContext';

export function ChatScreen() {
  const { chat_id = null } = useParams<{ chat_id: string }>();
  const [qrcode, setQrcode] = useState('');
  const [status, setStatus] = useState('PENDENTE');

  const { socket } = useSocket();
  useEffect(() => {
    
    socket?.on('status', handlerStatusChange);
    socket?.on('qr', handlerQrCode);
    socket?.on('auth', handlerAuth);

    return () => {
      socket?.off('auth', handlerAuth);
      socket?.off('qr', handlerQrCode);
      socket?.off('status', handlerStatusChange);
    };
  }, [socket, status, qrcode]);

  useEffect(() => {
    
    loadStatus();
  }, [])

  async function handlerAuth() {
    loadStatus()
  }

  async function handlerQrCode(qr: string) {
    setQrcode(qr);
    setStatus('QRCODE');
  }

  function handlerStatusChange(status: string) {
    setStatus(status);
  }

  async function loadStatus() {
    try {
      const { data } = await axios.get<{ status: string }>('suportes/status');

      setStatus(data.status);
    } catch (error) {
      setStatus('PENDENTE');
    }
  }

  if (status === 'PENDENTE') {
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        <span className='text-gray-400'>Api Desconectada</span>
      </div>
    );
  }

  if (status === 'QRCODE') {
    const svg = new qrcodeSvg({
      content: !!qrcode ? qrcode : 'empty',
      padding: 0,
    }).svg();
    return (
      <div className='h-screen relative w-screen bg-gray-100 flex flex-col items-center justify-center'>
        <div
          className={`bg-white p-3 ${
            !qrcode ? 'opacity-10' : ''
          } shadow rounded-lg`}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <p className='text-gray-400'>Leia o QR code</p>
        {!qrcode && (
          <div className='absolute'>
            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900'></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <ChatProvider>
      <div className='absolute left-0 top-0 right-0 bottom-0 bg-gray-100'>
        <Sidebar />
        <div className='absolute right-0 top-0 bottom-0 left-80 flex-col flex'>
          {chat_id ? (
            <>
              <ChatHeader id={chat_id} />
              <ChatMessages id={chat_id} />
              <ChatInput id={chat_id} />
            </>
          ) : (
            <div className='h-full flex flex-col justify-center items-center bg-gray-50'>
              <p className='text-gray-800 text-2xl font-light'>
                Selecione um suporte
              </p>
              <p className='text-sm text-gray-400'>
                Verifique se há novos suportes
              </p>
            </div>
          )}
        </div>
      </div>
    </ChatProvider>
  );
}
