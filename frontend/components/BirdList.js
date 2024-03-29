'use client';

import { useEffect, useState } from 'react'
import styles from './list.css';
import axios from 'axios';
import { Trash, Info, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BirdList({searchTerm}) {

  const [isClient, setIsClient] = useState(false)

  const [data, setData] = useState();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_ORIGIN}/api/v1/birds/findAllBirds`);
      const data = response.data.data.allBirds;
      const tempData = data.filter((bird) => bird.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setData(tempData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
    fetchData();
  }, [searchTerm]);
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  if(!isClient){
    return null;
  }

  async function deleteBird(id){
    console.log(`Bird ID: ${id}`);
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_ORIGIN}/api/v1/birds/${id}`);
      console.log(response);
      location.reload();
      alert('Delete success')
    } catch (error) {
      console.error('Error deleting bird:', error);
    }
  }

  return (
    <div className='table-cover'>
      <table>
        <tr>
          <th>Leg Tag</th>
          <th>Name</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
        {data && data.map((bird, index) => {
          const dateOnly = bird.createdAt.split('T')[0];
          return (
            <tr key={index}>
              <td>{bird.leg_tag.leg_tag}</td>
              <td>{bird.name}</td>
              <td>{dateOnly}</td>
              <td className='action-row'>
                <Trash
                  size={32} 
                  className='icon' 
                  onClick={() => deleteBird(bird.bird_id)}
                />

                <Info 
                  size={32} 
                  className='icon'
                  onClick={() => router.push(`/Bird_Details/${bird.bird_id}`)}
                /> 
                <Pencil 
                  size={32} 
                  className='icon' 
                  onClick={() => router.push(`/Bird_Tracker/${bird.bird_id}`)}
                  />
              </td>
            </tr>
          )
        }
        )}
      </table>
    </div>
  )
}
