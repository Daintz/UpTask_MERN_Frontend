import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useProjects from '../hooks/useProjects';
import useAdmin from '../hooks/useAdmin';
import ModalFormTask from '../components/ModalFormTask';
import ModalDeleteTask from '../components/ModalDeleteTask';
import Task from '../components/Task';
import Alert from '../components/Alert';
import Collaborator from '../components/Collaborator';
import ModalDeleteCollaborator from '../components/ModalDeleteCollaborator';
import io from 'socket.io-client';

let socket;

const Project = () => {
  const params = useParams();
  const { getProject, project, loading, handleModalTask, alert, submitTaskProject, deleteTaskProject, updateTaskProject, changeStateTask } = useProjects();

  const admin = useAdmin();

  useEffect(() => {
    getProject(params.id);
  }, [])

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit('open project', params.id)
  }, [])

  useEffect(() => {
    socket.on('task add', taskNew => {
      if (taskNew.project === project._id) {
        submitTaskProject(taskNew);
      }
    });

    socket.on('task deleted', taskDeleted => {
      if (taskDeleted.project === project._id) {
        deleteTaskProject(taskDeleted);
      }
    });

    socket.on('task updated', taskUpdated => {
      if (taskUpdated.project._id === project._id) {
        updateTaskProject(taskUpdated);
      }
    });

    socket.on('new state', newStateTask => {
      if (newStateTask.project._id === project._id) {
        changeStateTask(newStateTask);
      }
    })
  }, [])

  const { name } = project;

  if (loading) return 'Loading...';

  const { msg } = alert;

  return (
    <>
      <div className='flex justify-between'>
        <h1 className='font-black text-4xl'>{name}</h1>

        {admin && (
          <div className='flex items-center gap-2 text-gray-400 hover:text-black'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>

            <Link
              to={`/projects/edit/${params.id}`}
              className="uppercase font-bold"
            >Edit</Link>
          </div>
        )}
      </div>

      {admin && (
        <button
          onClick={handleModalTask}
          type="button"
          className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center"
        >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
        </svg>
        New Task</button>
      )}

      <p className="font-bold text-xl mt-10">Project tasks</p>

      <div className="bg-white shadow mt-10 rounded-lg">
        {project.tasks?.length ?
          project.tasks?.map(task => (
            <Task
              key={task._id}
              task={task}
            />
          )) :
          <p className="text-center my-5 p-10">There are no tasks in this project</p>}
      </div>

      {admin && (
        <>
          <div className="flex items-center justify-between mt-10">
            <p className="font-bold text-xl">Partners</p>
            <Link
              to={`/projects/new-collaborator/${project._id}`}
              className="text-gray-400 hover:text-black uppercase font-bold"
            >Add</Link>
          </div>

          <div className="bg-white shadow mt-10 rounded-lg">
            {project.collaborators?.length ?
              project.collaborators?.map(collaborator => (
                <Collaborator
                  key={collaborator._id}
                  collaborator={collaborator}
                />
              )) :
              <p className="text-center my-5 p-10">There are no collaborators in this project</p>}
          </div>
        </>
      )}

      <ModalFormTask />
      <ModalDeleteTask />
      <ModalDeleteCollaborator />
    </>
    )
}

export default Project