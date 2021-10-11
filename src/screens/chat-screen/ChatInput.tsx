import { PaperClipIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { KeyboardEventHandler } from 'react';

export function ChatInput({ id }: any) {
  async function sendMessage(ev: any) {
    if (ev.key === 'Enter') {
      try {
        const { data } = await axios.post(`suportes/${id}/send`, {
          message: ev.target.value,
        });

        ev.target.value = '';
      } catch (error) {}
    }
  }

  return (
    <div className='bg-white flex items-center shadow-sm py-2 px-5'>
      <div className='p-3 cursor-pointer'>
        <PaperClipIcon className='w-4' />
      </div>
      <input
        onKeyPress={sendMessage}
        className='bg-gray-200 px-5 py-2 rounded-full flex-1'
        placeholder='Digite uma mensagem'
        type='text'
      />
    </div>
  );
}
