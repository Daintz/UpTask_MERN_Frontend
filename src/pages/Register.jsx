import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import clientAxios from '../config/clientAxios';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [alert, setAlert] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();

    if ([name, email, password, repeatPassword].includes('')) {
      setAlert({
        msg: 'All fields are required',
        err: true
      });
      return;
    }

    if (password !== repeatPassword) {
      setAlert({
        msg: 'Passwords are not the same',
        err: true
      });
      return;
    }

    if (password.length < 6) {
      setAlert({
        msg: 'The password is very short, add at least 6 characters',
        err: true
      });
      return;
    }

    setAlert({});

    try {
      const {data} = await clientAxios.post(`/users`, { name, email, password });

      setAlert({
        msg: data.msg,
        err: false
      });

      setName('');
      setEmail('');
      setPassword('');
      setRepeatPassword('');
    } catch (err) {
      setAlert({
        msg: err.response.data.msg,
        err: true
      });
    }
  }

  const {msg} = alert;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl">Create your account and manage your {''}
      <span className="text-slate-700">projects</span></h1>

      {msg && <Alert alert={alert} />}

      <form
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="name">Name</label>
          <input
            id="name"
            type="name"
            placeholder="Your name"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Registration email"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Registration password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="my-5">
          <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="password2">Repeat your password</label>
          <input
            id="password2"
            type="password"
            placeholder="Repeat your password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Create Account"
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between mb-20">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >You have an account? sign up</Link>
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/forgot-password"
        >I forgot my password</Link>
      </nav>
    </>
  )
}

export default Register;