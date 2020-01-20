import React, { useState, useEffect } from 'react';
import { ThemeProvider, createGlobalStyle} from 'styled-components';
import storage from 'local-storage-fallback';

import api from './services/api';
import DevItem from './components/DevItem';
import DevForm from './components/DevForm';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

const GlobalStyle = createGlobalStyle`
  body{
    background-color: ${props => props.theme.mode === 'dark' ? '#222222' : '#e5e6f0'}
  }
  .user-info strong{
    color: ${props => props.theme.mode === 'dark' ? '#dfe6e9' : '#333'}
  }
  .dev-item{
    background: ${props => props.theme.mode === 'dark' ? '#292929' : '#fff'};
    border: ${props => props.theme.mode === 'dark' ? 'solid 1px #8854d0' : 'solid 1px #fff'};
  }
  .dev-item a{
    color: ${props => props.theme.mode === 'dark' ? '#B57BED' : '#8e4dff'}
  }
  aside {
    background: ${props => props.theme.mode === 'dark' ? '#292929' : '#fff'};
    border: ${props => props.theme.mode === 'dark' ? 'solid 1px #8854d0' : 'solid 1px #fff'};
  }
  aside strong{
    color: ${props => props.theme.mode === 'dark' ? '#B1BFC6' : '#333'}
  }
  label {
    color: ${props => props.theme.mode === 'dark' ? '#B1BFC6' : '#8D8D8D'}
  }
  input {
    color: ${props => props.theme.mode === 'dark' ? '#B1BFC6' : '#000'}
  }
  aside form button[type=submit] {
    color: ${props => props.theme.mode === 'dark' ? '#dfe6e9' : '#fff'}
  }
  li.dev-item p {
    color: ${props => props.theme.mode === 'dark' ? '#dfe6e9' : '#333'}
  }
  .change-theme{
    background-color: ${props => props.theme.mode === 'dark' ? '#292929' : '#fff'};
    color: ${props => props.theme.mode === 'dark' ? '#dfe6e9' : '#333'};
    border: ${props => props.theme.mode === 'dark' ? 'solid 2px #8854d0' : 'solid 1px #fff'};
  }
`

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  useEffect(() => {
    storage.setItem('theme', JSON.stringify(theme))
  }, [theme])
  const [devs, setDevs] = useState([]);
  
  useEffect(() => {
    async function loadDevs(){
      const response = await api.get('/devs');

      setDevs(response.data)
    }

    loadDevs();
  }, []);

  function getInitialTheme() {
    const savedTheme = storage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : {mode :'light'}
  }

  async function handleAddDev(data){
    const response = await api.post('/devs', data)

    setDevs([...devs, response.data])
  }

  return (
    <ThemeProvider theme={theme}>
      <div id="app">
        <GlobalStyle />
        <button className="change-theme" onClick={e=>setTheme(theme.mode === 'dark' ? {mode: 'light'} : {mode: 'dark'})}>Change theme</button>
        <aside>
          <strong>Cadastrar</strong>
          <DevForm onSubmit={handleAddDev}/>
        </aside>
        <main>
          <ul>
            {devs.map(dev => (
              <DevItem key={dev._id} dev={dev}/>
            ))}
          </ul>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
