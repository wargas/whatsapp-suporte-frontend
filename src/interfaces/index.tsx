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
  id: Number;
  name: string;
  pushname: string;
  image_url: string;
  contact_id: string;
  chat_id: string;
  status: string;
  setor: string;
};

export type Message = {
    body: string,
    id: string,
    fromMe: boolean
}
