import React, { PureComponent, useContext, useState } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react';


function LoginForm() {

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const {store} = useContext(Context)

    return (  
        <div className='max-w-4xl h-full mx-auto flex justify-center items-center'>
            <div className='w-2/4 p-2 m-auto rounded-2xl text-center border border-gray-600'>

                <input 
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    type='text'
                    className='bg-gray-100 mb-4 block w-2/3 m-auto focus:bg-white border focus:outline-none rounded-md py-2 px-2 focus:border-blue-300 border-gray-300'
                    placeholder='Email'
                    />
                    <input 
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    className='bg-gray-100 block w-2/3 m-auto focus:bg-white border focus:outline-none rounded-md py-2 px-2 focus:border-blue-300 border-gray-300'
                    type='password'
                    placeholder='Пароль'
                    />
                    <div className='mt-2 flex justify-center gap-5'>

                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600' onClick={() => {store.login(email, password)}}>Логін</button>
                        <button className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600' onClick={() => {store.registration(email, password)}} >Реєстрація</button>
                    </div>
            </div>
            
        </div>

    );
}

export default observer(LoginForm);