import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/outline';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { ChatContext } from './ChatContext';
import { useOffCanvas } from './OffCanvas';

export function FinalizarSuporte() {
  const [message, setMessage] = useState(
    'A BITMAX agradece seu contato, tenha um bom dia!'
  );
  const [status, setStatus] = useState('');
  const { loadSuportes } = useContext(ChatContext);

  const { push } = useHistory();
  const { chat_id: id } = useParams<{ chat_id: string }>();

  async function handlerFinalizarChamado() {
    setStatus('loading');
    try {
      const { data } = await axios.post(`suportes/${id}/finalizar`, {
        message,
      });
      await loadSuportes();
      toast.success('Suporte finalizado');
      close(true);
      push('/chat');

    } catch (error) {
      toast.error('Ocorreu um erro');
    }
    setStatus('');
  }

  const { close } = useOffCanvas();
  return (
    <div className='h-screen w-full flex flex-col'>
      <div className='border-b border-gray-50 bg-green-600'>
        <div className='flex h-16 items-center px-2 '>
          <button
            onClick={() => close(null)}
            className='text-white w-10 h-10 flex justify-center items-center transition-all rounded-full hover:bg-green-500'>
            <ChevronLeftIcon className='w-4' />
          </button>
          <span className='font-bold text-white  uppercase ml-5'>
            Finalizar Suporte
          </span>
        </div>
      </div>
      <div className='flex-1 mt-3 flex flex-col w-full'>
        {status === 'loading' && (
          <div className='loading w-6 h-6 border-green-500 mx-auto mt-16'></div>
        )}
        {status !== 'loading' && (
          <>
            <p className='mx-5 text-sm text-gray-400'>
              Informe que será enviada ao finalizar o suporte
            </p>
            <textarea
              onChange={(ev) => setMessage(ev.target.value)}
              value={message}
              className='flex text-sm bg-gray-50 mx-5 p-2 mt-2 rounded border resize-none focus:outline-none'
              name=''
              id=''></textarea>
          </>
        )}
      </div>
      <div className='p-3'>
        <button
          onClick={handlerFinalizarChamado}
          className='bg-green-600 shadow rounded-full h-10 items-center justify-center text-white flex w-full'>
          <CheckIcon className='w-4 mr-2' />
          <span>FINALIZAR</span>
        </button>
      </div>
    </div>
  );
}
