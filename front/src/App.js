import { useContext, useEffect, useState } from "react";
import LoginForm from "./components/loginForm";
import { Context } from ".";
import { observer } from "mobx-react";
import UserService from "./services/UserService";

function App() {
  const {store} = useContext(Context)
  const [users,setUsers] = useState([])

  useEffect(()=> {
    if(localStorage.getItem('token')) {
      store.chechAuth();
    }
  }, [])


 async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(error);
      
    }
  }

  if(store.isLoading) {
    return <div>Загрузка...</div>
  }


  if(!store.isAuth) {
    return (
      <LoginForm />
    )
  }
  return (
    <div className="App h-full ">
      <header className="App-header ">
      <div className="max-w-screen-lg mx-auto text-center">

        <div className=""></div>
        <h1 className="font-bold border-b-2 p-2">{store.isAuth ? "Користувач авторизований": "Користувач не авторизований"}</h1>
        <h1 className="font-bold text-red-600 my-5">{store.user.isActivated ? "Акаунт пітверджений по почті": "Акаунт не активований"} </h1>
      </div>
        
        </header>
        <main >
          <div className="max-w-screen-lg mx-auto  flex justify-end gap-4 ">

            <button className="bg-blue-400 p-2 rounded-2xl text-white uppercase" onClick={() => store.logout()}>Вихід</button>
            <div>
                <button className="bg-slate-400 p-2 rounded-2xl text-white uppercase" onClick={getUsers}>Отримати користувачів</button>
            </div>
          
           </div>
        </main>
        <section>
        <div className="max-w-screen-lg mx-auto   gap-4 ">
          <ul className="divide-y divide-gray-200">
            {users.map(user => {
              return  <li className="p-4  " key={user.email}>{user.email}</li>
            })}
          </ul>
          </div>
        </section>
    
    </div>
  );
}

export default observer(App);
