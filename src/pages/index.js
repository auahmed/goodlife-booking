import React, { useState } from 'react'
import {
  Button,
  Container,
  TextField
} from '@material-ui/core'

import TimeTable from '../components/TimeTable'

import config from '../config'
import initLocationsFile from '../utils/locations'

const index = ({ initLocations }) => {
  const [locations, setLocations] = useState(initLocations)
  const [secureLoginToken, setSecureLoginToken] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorLogin, setErrorLogin] = useState(null)
  const [loadingLogin, setLoadingLogin] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoadingLogin(true)
    setErrorLogin(null)
    try {
      const loginResp = await fetch(`${config.host}/api/login`, { method: 'POST', body: JSON.stringify({ login: email, passwordParameter: password }) })
      const loginRespJson = await loginResp.json()
      if (!loginResp.ok) {
        setErrorLogin(loginRespJson.map.response.message)
      } else {
        setSecureLoginToken(loginRespJson.secureLoginToken)
      }
    } catch (err) {
      setErrorLogin(err.message)
    }
    setLoadingLogin(false)
  }

  return (
    <Container>
      <section className='login'>
        <form onSubmit={handleLogin}>
          <TextField fullWidth required label='Email' type='email' value={email} onChange={e => setEmail(e.target.value)} autoComplete='username' />
          <TextField fullWidth required label='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} autoComplete='current-password' />
          {errorLogin && <p>{errorLogin}</p>}
          <Button variant='contained' disabled={loadingLogin} type='submit'>
            Sign In
          </Button>
        </form>
      </section>
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
