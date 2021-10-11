import { useParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

export function ChatScreen() {
  const { chat_id = null } = useParams<{ chat_id: string }>();

  return (
    <div className='absolute left-0 top-0 right-0 bottom-0 bg-gray-100'>
      <Sidebar />
      <div className='absolute right-0 top-0 bottom-0 left-80 flex-col flex'>
        <ChatHeader id={chat_id} />
        <ChatMessages id={chat_id} />
        <ChatInput id={chat_id} />
      </div>
    </div>
  );
}
