import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { Loading } from '../../components/Loading';
import { PaperClipIcon, MicrophoneIcon } from '@heroicons/react/outline';
import { FaPaperPlane, FaStopCircle, FaTrash } from 'react-icons/fa'

export function ChatInput({ id }: any) {
  const [inputRef, setInputRef] = useState<any>();
  const [status, setStatus] = useState('');
  const [text, setText] = useState('');
  const [lines, setLines] = useState(1);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const length = text.split('\n').length;
    setLines(length > 3 ? 3 : length);
  }, [text]);

  async function sendMessage(ev: any) {
    setStatus('loading');
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      try {
        const { data } = await axios.post(`suportes/${id}/send`, {
          message: text,
        });

        setText('');
      } catch (error) {}
    }
    setStatus('');
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
    } catch (error) {}
  }

  async function handlerPasteImage(ev: any) {
    const file = ev.clipboardData.files[0];

    if (file) {
      upload(file);
    }
  }

  return (
    <div className='bg-white flex items-center shadow-sm h-16 px-5'>
      {recording && (
        <div className="flex ml-auto">
          <button onClick={() => setRecording(false)} className="w-8 h-8">
            <FaTrash className="h-5 text-gray-500" />
          </button>
          <div className="h-8 mr-3 px-5 rounded-full border w-60">
            <span className="text-red-500 text-xs">Gravando...</span>
          </div>
          <button className="w-8 h-8">
            <FaStopCircle className="h-5 text-red-500" />
          </button>
          <button className="w-8 h-8">
            <FaPaperPlane className="h-5 text-green-500" />
          </button>
        </div>
      )}
      {!recording && (
        <>
          <input
            onChange={handleChangeFile}
            className='hidden'
            ref={setInputRef}
            type='file'
            name=''
            id=''
          />
          <div className='mr-3'>
            <button className='w-8 h-8' onClick={handleClickFile}>
              <PaperClipIcon className='w-5 mx-auto text-gray-600' />
            </button>
            <button onClick={() => setRecording(true)} className='w-8 h-8'>
              <MicrophoneIcon className='w-5 mx-auto text-gray-600' />
            </button>
          </div>
          <textarea
            style={{ maxHeight: 45 * lines, resize: 'none' }}
            onPaste={handlerPasteImage}
            onKeyPress={sendMessage}
            value={text}
            onChange={(ev) => setText(ev.target.value)}
            className='bg-gray-200 transition-all focus:outline-none overflow-y-hidden px-5 py-2 rounded-3xl flex-1'
            placeholder='Digite uma mensagem'
          />

          {status === 'loading' && (
            <div className='ml-3 loading w-6 h-6 border-green-500'></div>
          )}
        </>
      )}
    </div>
  );
}
