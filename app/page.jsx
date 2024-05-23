import React from 'react'
import Start from './components/Start'
import Card from './components/Card'

const page = () => {
  return (
    <div>
      <Start />
      <div className='contenido'>
        <Card />
      </div>
    </div>
  )
}

export default page

