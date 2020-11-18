import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core'

import config from '../config'
import initLocationsFile from '../utils/locations'

const index = ({ initLocations }) => {
  const [locations, setLocations] = useState(initLocations)

  const dateStrings = []
  for (let i = 0; i < locations[0].data.map.response.length; i += 1) {
    const date = new Date(locations[0].data.map.response[i].weekday)
    dateStrings.push(date.toDateString())
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Club Name</TableCell>
              <TableCell>Club Id</TableCell>
              <TableCell>{dateStrings[0]}</TableCell>
              <TableCell>{dateStrings[1]}</TableCell>
              <TableCell>{dateStrings[2]}</TableCell>
              <TableCell>{dateStrings[3]}</TableCell>
              <TableCell>{dateStrings[4]}</TableCell>
              <TableCell>{dateStrings[5]}</TableCell>
              <TableCell>{dateStrings[6]}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location) => {
              const times = [{}, {}, {}, {}, {}, {}, {}]
              for (let i = 0; i < location.data.map.response.length; i += 1) {
                const locDate = location.data.map.response[i]
                for (let j = 0; j < locDate.workouts.length; j += 1) {
                  if (locDate.workouts[j].availableSlots > 0 && locDate.workouts[j].gymArea === 'Gym Floor') {
                    if (locDate.workouts[j].startAt.split('T')[1] === '00:00:00'
                      || locDate.workouts[j].startAt.split('T')[1] === '01:30:00') {
                      break;
                    }
                    let timeString = locDate.workouts[j].startAt.split('T')[1]
                    const H = +timeString.substr(0, 2)
                    const h = H % 12 || 12
                    const ampm = (H < 12 || H === 24) ? "AM" : "PM"
                    timeString = h + timeString.substr(2, 3) + ampm
                    times[i].available = `${times[i].available ? `${times[i].available}; ` : ''}${timeString}`
                  }
                }
              }

              return (
                <TableRow key={location.ClubName}>
                  <TableCell align="left">{location.data ? location.data.map.statusCode : 'N/A'}</TableCell>
                  <TableCell component="th" scope="row">
                    {location.ClubName}
                  </TableCell>
                  <TableCell align="left">{location.ClubId}</TableCell>
                  <TableCell align="left">{times[0].available ? times[0].available : 'X'}</TableCell>
                  <TableCell align="left">{times[1].available ? times[1].available : 'X'}</TableCell>
                  <TableCell align="left">{times[2].available ? times[2].available : 'X'}</TableCell>
                  <TableCell align="left">{times[3].available ? times[3].available : 'X'}</TableCell>
                  <TableCell align="left">{times[4].available ? times[4].available : 'X'}</TableCell>
                  <TableCell align="left">{times[5].available ? times[5].available : 'X'}</TableCell>
                  <TableCell align="left">{times[6].available ? times[6].available : 'X'}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export const getServerSideProps = async ({ req }) => {
  const initLocations = []
  let i = 0
  for (i; i < initLocationsFile.length; i += 1) {
    const locationTimes = await fetch(config.host + `/api/getTimes?clubId=${initLocationsFile[i].ClubId}&date=2020-11-18`)
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
