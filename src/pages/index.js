import React, { useState } from 'react'
import {
  Button,
  Container
} from '@material-ui/core'

import { useUser } from '../context/userContext'
import Login from '../components/Login'
import TimeTable from '../components/TimeTable'

import config from '../config'
import initLocationsFile from '../utils/locations'

const index = ({ initLocations }) => {
  const { user, userWorkouts, logout } = useUser()
  const [locations, setLocations] = useState(initLocations)

  console.log('### userWorkouts', userWorkouts)
  return (
    <Container>
      {
        user
          ? (
            <section className='logged-in'>
              <p>Hello {user.FirstName}</p>
              <Button variant='contained' onClick={() => logout()}>
                Sign Out
              </Button>
            </section>
          )
          : <Login />
      }
      <TimeTable locations={locations} />
    </Container>
  )
}

export const getServerSideProps = async ({ req }) => {
  const date = new Date()
  const initLocations = []
  let i = 0
  for (i; i < initLocationsFile.length; i += 1) {
    const locationTimes = await fetch(config.host + `/api/getTimes?clubId=${initLocationsFile[i].ClubId}&date=${date.toISOString().split('T')[0]}`)
    const data = await locationTimes.json()
    initLocations.push({
      ...initLocationsFile[i],
      data
    })
  }

  return {
    props: {
      initLocations,
    }
  }
}

export default index
