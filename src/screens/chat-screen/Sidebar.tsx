import {
  ChatAlt2Icon,
  DotsVerticalIcon,
  PaperClipIcon,
} from '@heroicons/react/outline';
import { Popover, Menu } from '@headlessui/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../providers/auth';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ChatContext } from './ChatContext';
import { DateTime } from 'luxon';
import { useOffCanvas } from './OffCanvas';
import { ListContatos } from './ListContatos';

export function Sidebar() {
  const { loadSuportes, suportes, fila, suporte } = useContext(ChatContext);

  const { push } = useHistory();
  const { user } = useAuth();
  const { open } = useOffCanvas()

  async function getNextSuport() {
    try {
      const { data } = await axios.get<any>('suportes/next');
      if (!data.error) {
        toast.success(
          `Você foi adicionado como responsável pelo suporte de ${data.name}`
        );
      } else {
        toast.warning(data.error);
      }
      loadSuportes();
    } catch (error) {
      toast.error('Ocorreu um erro');
    }
  }

  

  return (
    <div className='absolute w-80 left-0 top-0 bottom-0 flex flex-col bg-white shadow-sm'>
      <div className='shadow-sm h-16 items-center flex px-3'>
        <div>
          <svg viewBox='0 0 212 212' width='40' height='40' className=''>
            <path
              fill='#DFE5E7'
              className='background'
              d='M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z'></path>
            <path
              fill='#FFF'
              className='primary'
              d='M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z'></path>
          </svg>
        </div>
        <div className='ml-3 flex flex-col'>
          <span className='text-sm text-gray-800 font-bold'>{user?.name}</span>
          <span className='text-xs text-gray-400'>{user?.email}</span>
        </div>
        <div className='ml-auto'>
          <button 
            onClick={() => open(ListContatos)}
            className="p-3 transition-all hover:bg-gray-100 rounded-full"> 
            <ChatAlt2Icon className='w-5 text-gray-900' />
          </button>
        </div>
        <div className='ml-0'>
          <Menu>
            <Menu.Button className='p-3 transition-all hover:bg-gray-100 rounded-full'>
              <DotsVerticalIcon className='w-5' />
            </Menu.Button>
            <Menu.Items className='absolute z-10'>
              <div className='bg-white shadow w-44 rounded'>
                <Menu.Item>
                  <div
                    onClick={() => push('/login')}
                    className='cursor-pointer border-b border-gray-50 text-sm text-gray-600 px-5 p-3 hover:bg-gray-50 transition-all'>
                    Desconectar
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div className='cursor-pointer text-sm text-gray-600 px-5 p-3 hover:bg-gray-50 transition-all'>
                    Perfil
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    onClick={loadSuportes}
                    className='cursor-pointer text-sm text-gray-600 px-5 p-3 hover:bg-gray-50 transition-all'>
                    Atualizar
                  </div>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <div className='flex w-full p-3 border-b'>
        <input
          className='bg-gray-100 text-sm rounded-full py-2 px-5 flex-1'
          type='text'
          placeholder='Pesquisa conversa'
        />
      </div>
      <div
        style={{ scrollbarWidth: 'thin' }}
        className='flex-1 overflow-y-auto'>
        {suportes.map((item: any) => (
          <div
            key={item.id}
            onClick={() => push(`/chat/${item.id}`)}
            className={`${
              item.id === suporte.id ? 'bg-gray-50' : ''
            } p-2 py-3 text-sm flex border-b border-gray-50 cursor-pointer hover:bg-gray-50`}>
            <div>
              {item.image_url ? (
                <img
                  className='w-10 rounded-full'
                  src={item.image_url}
                  alt=''
                />
              ) : (
                <svg viewBox='0 0 212 212' width='40' height='40' className=''>
                  <path
                    fill='#DFE5E7'
                    className='background'
                    d='M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z'></path>
                  <path
                    fill='#FFF'
                    className='primary'
                    d='M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z'></path>
                </svg>
              )}
            </div>
            <div className='ml-3'>
              <span>{item.pushname || item.name || item.contact_id}</span>{' '}
              <br />
              <span className='text-xs text-gray-500'>
                {item.setor || 'PADRAO'}
              </span>
            </div>
            <div className='ml-auto flex flex-col'>
              <div className='text-xs text-gray-400'>
                {/* {DateTime.fromMillis(item.timestamp * 1000).toFormat('HH:mm')} */}
              </div>
              <div className='flex'>
                <span className='text-xs ml-auto bg-green-600 text-white rounded-full shadow-sm px-2'>
                  {/* {item.unreadCount || ''} */}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='h-12 flex px-2 pb-2'>
        {fila > 0 && (
          <button
            onClick={getNextSuport}
            className='bg-green-600 hover:bg-green-700 transition-all uppercase text-sm shadow rounded-full w-full text-white'>
            Iniciar Suporte ({fila})
          </button>
        )}
      </div>
    </div>
  );
}
