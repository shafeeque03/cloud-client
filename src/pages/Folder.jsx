import React from 'react'
import { useParams } from 'react-router-dom'

const Folder = () => {
    const {folderId} = useParams()
  return (
    <div>Folder,{folderId}</div>
  )
}

export default Folder