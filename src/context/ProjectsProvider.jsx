import { createContext, useEffect, useState } from 'react';
import clientAxios from '../config/clientAxios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import io from 'socket.io-client';

let socket;

const ProjectsContext = createContext();

const ProjectsProvider = ({children}) => {

  const [projects, setProjects] = useState([]);
  const [alert, setAlert] = useState({});
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalFormTask, setModalFormTask] = useState(false);
  const [task, setTask] = useState({});
  const [modalDeleteTask, setModalDeleteTask] = useState(false);
  const [collaborator, setCollaborator] = useState({});
  const [modalDeleteCollaborator, setModalDeleteCollaborator] = useState(false);
  const [search, setSearch] = useState(false);

  const navigate = useNavigate();
  const {auth} = useAuth();

  useEffect(() => {
    const getProjects = async() => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        };

        const { data } = await clientAxios('/projects', config);

        setProjects(data);
      } catch (err) {
        console.log(err);
      }
    }
    getProjects();
  }, [])

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
  }, []);

  const showAlert = alert => {
    setAlert(alert);

    setTimeout(() => {
      setAlert({});
    }, 5000);
  }

  const submitProject = async project => {

    if (project.id) {
      await editProject(project);
    } else {
      await newProject(project);
    }
  }

  const editProject = async project => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      const { data } = await clientAxios.put(`/projects/${project.id}`, project, config);

      const projectsUpdated = projects.map(projectState => projectState._id === data._id ? data : projectState);
      setProjects(projectsUpdated);

      setAlert({
        msg: 'Project updated correctly',
        err: false
      });

      setTimeout(() => {
        setAlert({});
        navigate('/projects');
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  }

  const newProject = async project => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      const {data} = await clientAxios.post(`/projects`, project, config);
      setProjects([...projects, data]);

      setAlert({
        msg: 'Project created correctly',
        err: false
      });

      setTimeout(() => {
        setAlert({});
        navigate('/projects');
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  }

  const getProject = async id => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      const { data } = await clientAxios(`/projects/${id}`, config);

      setProject(data);
      setAlert({});
    } catch (err) {
      navigate('/projects');
      setAlert({
        msg: err.response.data.msg,
        err: true
      });
      setTimeout(() => {
        setAlert({});
      }, 3000);
    } finally {
      setLoading(false);
    }
  }

  const deleteProject = async id => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      const {data} = await clientAxios.delete(`/projects/${id}`, config);

      const projectsUpdated = projects.filter(projectState => projectState._id !== id);
      setProjects(projectsUpdated);

      setAlert({
        msg: data.msg,
        err: false
      });

      setTimeout(() => {
        setAlert({});
        navigate('/projects');
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  }

  const handleModalTask = () => {
    setModalFormTask(!modalFormTask);
    setTask({});
  }

  const submitTask = async task => {

    if (task?.id) {
      await editTask(task);
    } else {
      await createTask(task);
    }
  }

  const editTask = async task => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      const { data } = await clientAxios.put(`/tasks/${task.id}`, task, config);

      setAlert({});
      setModalFormTask(false);

      socket.emit('update task', data);
    } catch (err) {
      console.log(err);
    }
  }

  const createTask = async task => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      const {data} = await clientAxios.post('/tasks', task, config);
      console.log(data);

      setAlert({});
      setModalFormTask(false);

      //SOCKET IO
      socket.emit('new task', data);
    } catch (err) {
      console.log(err);
    }
  }

  const handleModalEditTask = task => {
    setTask(task);
    setModalFormTask(true);
  }

  const handleModalDeleteTask = task => {
    setTask(task);
    setModalDeleteTask(!modalDeleteTask);
  }

  const deleteTask = async() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      const { data } = await clientAxios.delete(`/tasks/${task._id}`, config);
      setAlert({
        msg: data.msg,
        err: false
      });

      setModalDeleteTask(false);

      socket.emit('delete task', task)

      setTask({});
      setTimeout(() => {
        setAlert({});
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  }

  const submitCollaborator = async email => {

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      const {data} = await clientAxios.post('/projects/collaborators', {email}, config);

      setCollaborator(data);
      setAlert({});
    } catch (err) {
      setAlert({
        msg: err.response.data.msg,
        err: true
      })
    } finally {
      setLoading(false);
    }
  }

  const addCollaborator = async email => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      const {data} = await clientAxios.post(`/projects/collaborators/${project._id}`, email, config);

      setAlert({
        msg: data.msg,
        err: false
      });
      setCollaborator({});

      setTimeout(() => {
        setAlert({});
      }, 3000);
    } catch (err) {
      setAlert({
        msg: err.response.data.msg,
        err: true
      })
    }
  }

  const handleModalDeleteCollaborator = (collaborator) => {
    setModalDeleteCollaborator(!modalDeleteCollaborator);
    setCollaborator(collaborator);
  }

  const deleteCollaborator = async() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      const {data} = await clientAxios.post(`/projects/delete-collaborator/${project._id}`, {id: collaborator._id}, config);

      const projectUpdated = {...project};

      projectUpdated.collaborators = projectUpdated.collaborators.filter(collaboratorState => collaboratorState._id !== collaborator._id);

      setProject(projectUpdated)

      setAlert({
        msg: data.msg,
        err: false
      });

      setCollaborator({});
      setModalDeleteCollaborator(false);

      setTimeout(() => {
        setAlert({});
      }, 3000);
    } catch (err) {
      console.log(err.response);
    }
  }

  const completeTask = async id => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };

      const {data} = await clientAxios.post(`/tasks/state/${id}`, {}, config);
      setTask({});
      setAlert({});

      socket.emit('change state', data);
    } catch (err) {
      console.log(err.response);
    }
  }

  const handleSearch = () => {
    setSearch(!search);
  }

  const submitTaskProject = (task) => {
    const projectUpdated = {...project}
    projectUpdated.tasks = [...project.tasks, task];
    setProject(projectUpdated);
  }

  const deleteTaskProject = (task) => {
    const projectUpdated = {...project};
    projectUpdated.tasks = projectUpdated.tasks.filter(taskState => taskState._id !== task._id)
    setProject(projectUpdated);
  }

  const updateTaskProject = (task) => {
    const projectUpdated = {...project};
    projectUpdated.tasks = projectUpdated.tasks.map(taskState => taskState._id === task._id ? task : taskState);
    setProject(projectUpdated);
  }

  const changeStateTask = (task) => {
    const projectUpdated = {...project};
    projectUpdated.tasks = projectUpdated.tasks.map(taskState => taskState._id === task._id ? task : taskState);
    setProject(projectUpdated);
  }

  const closeSessionProjects = () => {
    setProjects({});
    setProject({});
    setAlert({});
  }

  return(
    <ProjectsContext.Provider
        value={{
          projects,
          showAlert,
          alert,
          submitProject,
          getProject,
          project,
          loading,
          deleteProject,
          modalFormTask,
          handleModalTask,
          submitTask,
          handleModalEditTask,
          task,
          modalDeleteTask,
          handleModalDeleteTask,
          deleteTask,
          submitCollaborator,
          collaborator,
          addCollaborator,
          modalDeleteCollaborator,
          handleModalDeleteCollaborator,
          deleteCollaborator,
          completeTask,
          search,
          handleSearch,
          submitTaskProject,
          deleteTaskProject,
          updateTaskProject,
          changeStateTask,
          closeSessionProjects
        }}
    >
        {children}
    </ProjectsContext.Provider>
  )
}

export {
    ProjectsProvider
}

export default ProjectsContext;