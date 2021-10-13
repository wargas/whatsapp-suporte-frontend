import { DotsVerticalIcon, PaperClipIcon } from '@heroicons/react/outline';
import { Popover } from '@headlessui/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../providers/auth';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function Sidebar() {
  const [suportes, setSuportes] = useState([])
  const { push } = useHistory();
  const { user } = useAuth();

  useEffect(() => {
    loadSuportes()
  }, [])

  async function loadSuportes() {
    try {
      const { data } = await axios.get('suportes');

      setSuportes(data)
    } catch (error) {
      
    }
  }

  return (
    <div className='absolute w-80 left-0 top-0 bottom-0 flex flex-col bg-white shadow-sm'>
      <div className='shadow-sm h-16 items-center flex px-3'>
        <div>
          <img
            className='w-10 rounded-full'
            src={`https://i.pravatar.cc/80?u=${user?.email}`}
            alt=''
          />
        </div>
        <div className="ml-3 flex flex-col">
          <span className="text-sm text-gray-800 font-bold">{user?.name}</span> 
          <span className="text-xs text-gray-400">{user?.email}</span>
        </div>
        <div className='ml-auto'>
          <Popover>
            <Popover.Button className='p-3 transition-all hover:bg-gray-100 rounded-full'>
              <DotsVerticalIcon className='w-5' />
            </Popover.Button>
            <Popover.Panel className='absolute z-10'>
              <div className='bg-white shadow w-44 rounded'>
                <div onClick={() => push('/login')} className='cursor-pointer border-b border-gray-50 text-sm text-gray-600 px-5 p-3 hover:bg-gray-50 transition-all'>
                  Desconectar
                </div>
                <div className='cursor-pointer text-sm text-gray-600 px-5 p-3 hover:bg-gray-50 transition-all'>
                  Perfil
                </div>
              </div>
            </Popover.Panel>
          </Popover>
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
        {suportes.map((suporte: any) => (
            <div 
              key={suporte.id} 
              onClick={() => push(`/chat/${suporte.id}`)}
              className='p-2 py-3 text-sm flex items-center border-b border-gray-50 cursor-pointer hover:bg-gray-50'>
              <div>
                {suporte.image_url ? (
                <img className="w-10 rounded-full"  src={suporte.image_url} alt="" />
                ) : (
                  <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                )}
                </div>
              <div className='ml-3'>
                <span>{suporte.pushname}</span> <br />
                <span className='text-xs text-gray-500'>{suporte.setor || 'PADRAO'}</span>
              </div>
              <div className='ml-auto text-xs bg-gray-100 rounded-full shadow-sm px-2'>
                
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
