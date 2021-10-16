import { PaperClipIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { ChangeEvent, useState } from 'react';

export function ChatInput({ id }: any) {
  const [inputRef, setInputRef] = useState<any>();

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

  async function handleClickFile() {
    if (inputRef) {
      inputRef.click();
    }
  }

  async function handleChangeFile(ev: ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.item(0);

    if (file) {
      upload(file);
    }
  }

  async function upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', file.type);

    try {
      const { data } = await axios.post(`suportes/${id}/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('data', data);
    } catch (error) {}
  }

  async function handlerPasteImage(ev: any) {
    const file = ev.clipboardData.files[0];

    if (file) {
      upload(file);
    }
  }

  return (
    <div className='bg-white flex items-center shadow-sm py-2 px-5'>
      <input
        onChange={handleChangeFile}
        className='hidden'
        ref={setInputRef}
        type='file'
        name=''
        id=''
      />
      <div className='p-3 cursor-pointer' onClick={handleClickFile}>
        <PaperClipIcon className='w-4' />
      </div>
      <input
        onPaste={handlerPasteImage}
        onKeyPress={sendMessage}
        className='bg-gray-200 px-5 py-2 rounded-full flex-1'
        placeholder='Digite uma mensagem'
        type='text'
      />
    </div>
  );
}
