import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useProjects from '../hooks/useProjects';
import Alert from './Alert';

const FormProject = () => {
  const [id, setId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [client, setClient] = useState('');

  const params = useParams();

  const { showAlert, alert, submitProject, project } = useProjects();

  useEffect(() => {
    if (params.id) {
      setId(project._id);
      setName(project.name);
      setDescription(project.description);
      setDeliveryDate(project.deliveryDate?.split('T')[0]);
      setClient(project.client);
    }
  }, [params]);

  const handleSubmit = async e => {
    e.preventDefault();

    if ([name, description, deliveryDate, client].includes('')) {
      showAlert({
        msg: 'All fields are required',
        err: true
      });

      return
    }

    await submitProject({id, name, description, deliveryDate, client});

    setId(null);
    setName('');
    setDescription('');
    setDeliveryDate('');
    setClient('');
  }

  const { msg } = alert;

  return (
    <form
      className="bg-white py-10 px-5 md:1/2 rounded-lg shadow"
      onSubmit={handleSubmit}
    >

      {msg && <Alert alert={alert} />}

      <div className='mb-5'>
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="name"
        >Name project</label>

        <input
          id="name"
          type="text"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Name of project"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className='mb-5'>
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="description"
        >Description</label>

        <textarea
          id="description"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Description of project"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className='mb-5'>
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="deliver-date"
        >Deadline</label>

        <input
          id="deliver-date"
          type="date"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          value={deliveryDate}
          onChange={e => setDeliveryDate(e.target.value)}
        />
      </div>

      <div className='mb-5'>
        <label
          className="text-gray-700 uppercase font-bold text-sm"
          htmlFor="client"
        >Name client</label>

        <input
          id="client"
          type="text"
          className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Name of project"
          value={client}
          onChange={e => setClient(e.target.value)}
        />
      </div>

      <input
        type="submit"
        value={id ? 'Update project' : 'Create project'}
        className="bg-sky-600 w-full p-3 uppercase font-bold text-white cursor-pointer hover:bg-sky-700 transition-colors"
      />
    </form>
  )
}

export default FormProject;