import axios from 'axios';
import { useHistory } from 'react-router';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useAuth } from '../../providers/auth';
import { useEffect } from 'react';

export function LoginScreen() {
  const { push } = useHistory();
  const { login, logout } = useAuth()

  useEffect(() => {
    logout()
  }, [])

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      toast.loading('carregando...', { toastId: 'loading' });
      try {
        const { data } = await axios.post<any>('auth/login', values);

        if(data?.token) {
          login(data.token)
        }

        toast.success('Logado com sucesso!');
      } catch (err: any) {
        const msg = err?.response?.data?.errors[0]?.message || '';
        toast.error(`Erro ao tentar fazer login: ${msg}`);
      }
      toast.dismiss('loading');
    },
  });

  return (
    <div className='w-screen flex items-center justify-center h-screen bg-gray-200'>
      <div className='px-5 w-11/12 md:w-7/12 lg:w-4/12 bg-white rounded shadow flex flex-col'>
        <form onSubmit={formik.handleSubmit}>
          <div className='border-b border-gray-100 py-3'>
            <h1 className='text-3xl text-green-600 font-bold text-center'>
              SUPORTE
            </h1>
            <p className='text-sm text-gray-400 text-center'>
              Informe suas crendenciais
            </p>
          </div>
          <div className='p-3'>
            <div className='flex mb-3'>
              <input
                name='email'
                onChange={formik.handleChange}
                value={formik.values.email}
                className='bg-gray-100 focus:outline-none focus:bg-gray-200 text-gray-600  transition-color text-sm h-12 px-5 rounded-md flex-1'
                placeholder='Email'
                type='text'
              />
            </div>
            <div className='flex mb-5'>
              <input
                name='password'
                onChange={formik.handleChange}
                value={formik.values.password}
                className='bg-gray-100 focus:outline-none focus:bg-gray-200 text-gray-600  transition-color text-sm h-12 px-5 rounded-md flex-1'
                placeholder='Email'
                type='password'
              />
            </div>
            <div className='flex mb-5'>
              <button
                type='submit'
                className='flex-1 transition-all hover:bg-green-500 bg-green-600 rounded-md shadow text-white h-12'>
                Entrar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
