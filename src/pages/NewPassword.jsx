import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import clientAxios from '../config/clientAxios';
import Alert from '../components/Alert';

const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [alert, setAlert] = useState({});
  const [changedPassword, setChangedPassword] = useState(false);

  const {token} = useParams();

  useEffect(() => {
    const checkToken = async() => {
      try {
        await clientAxios(`/users/forgot-password/${token}`);
        setTokenValid(true);
      } catch (err) {
        setAlert({
          msg: err.response.data.msg,
          err: true
        });
      }
    }
    checkToken();
  }, []);

  const {msg} = alert;

  const handleSubmit = async e => {
    e.preventDefault();

    if (password.length < 6) {
      setAlert({
        msg: 'The password must be at least 6 characters long',
        err: true
      });
      return;
    }

    try {
      const url = `/users/forgot-password/${token}`;
      const {data} = await clientAxios.post(url, {password});

      setAlert({
        msg: data.msg,
        err: false
      });

      setChangedPassword(true);
    } catch (err) {
      setAlert({
        msg: err.response.data.msg,
        err: true
      });
    }
  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl">Reset your password and don't lose access to your {''}
      <span className="text-slate-700">projects</span></h1>

      {msg && <Alert alert={alert} />}

      {tokenValid && (
        <form
          className="my-10 bg-white shadow rounded-lg p-10"
          onSubmit={handleSubmit}
        >
          <div className="my-5">
            <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              placeholder="Type your new password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <input
            type="submit"
            value="Set new password"
            className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
        </form>
      )}

      {changedPassword && (
          <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            to="/"
          >Sign up</Link>
        )}
    </>
  )
}

export default NewPassword;