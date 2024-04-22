import React, {useEffect} from 'react'
import { Outlet } from 'react-router-dom'

export default function SampleRequest() {
  useEffect(() => { 
    return () => { };
  }, []);  
  return (<div className='sr-layout'><Outlet /></div>)
}
