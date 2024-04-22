import React, {useEffect} from 'react'
import { Outlet } from 'react-router-dom'

export default function SamplePreparation() {
  useEffect(() => { 
    return () => { };
  }, []); 
  return (<div className='sp-layout'><Outlet /></div>)
}
