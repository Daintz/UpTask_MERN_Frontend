import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import clientAxios from '../config/clientAxios';
import Alert from '../components/Alert';


const ConfirmAccount = () => {

  const [alert, setAlert] = useState({});
  const [accountConfirm, setAccountConfirm] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const confirmAccount = async() => {
      try {
        const url = `/users/confirmed/${id}`;
        const { data } = await clientAxios(url);

        setAlert({
          msg: data.msg,
          err: false
        });

        setAccountConfirm(true);
      } catch (err) {
        setAlert({
          msg: err.response.data.msg,
          err: true
        })
      }
    }
    confirmAccount();
  }, [])

  const { msg } = alert

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl">Start your account and start with your {''}
      <span className="text-slate-700">projects</span></h1>

      <div className='mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>
        {msg && <Alert alert={alert} />}
        {accountConfirm && (
          <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            to="/"
          >Sign up</Link>
        )}
      </div>
    </>
  )
}

export default ConfirmAccount