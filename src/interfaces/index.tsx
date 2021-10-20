export type User = {
  name: string;
  email: string;
  id: number;
};

export type AuthContextProps = {
  login: (token: string) => void;
  logout: () => void;
  user: User | null;
};

export type Suporte = {
  id: number;
  name: string;
  pushname: string;
  image_url: string;
  contact_id: string;
  chat_id: string;
  status: string;
  setor: string;
  messages: Message[]
  unreads: Number;
  updated_at: string;
};

export type Contato = {
  id: {
    id: string,
    _serialized: string
  },
  name: string;
  pushname: string;
  shortname: string;
  number: string;
  isGroup: boolean
}

export type Message = {
  mediaKey: String;
  id: {
    fromMe: Boolean;
    remote: {
      server: String;
      user: String;
      _serialized: String;
    };
    id: String;
    _serialized: String;
  };
  ack: number;
  hasMedia: Boolean;
  body: String;
  type: String;
  timestamp: number;
  from: String;
  to: String;
  deviceType: String;
  isForwarded: Boolean;
  forwardingScore: number;
  isStatus: Boolean;
  isStarred: Boolean;
  fromMe: Boolean;
  hasQuotedMsg: Boolean;
  location: {
    latitude: number;
    longitude: number;
    description: string;
  };
  vCards: any[];
  mentionedIds: any[];
  links: any[];
};
