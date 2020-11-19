import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core'

import { useUser } from '../context/userContext'

const TimeTable = ({ locations }) => {
  const { userWorkouts } = useUser()
  const dateStrings = []
  for (let i = 0; i < locations[0].data.map.response.length; i += 1) {
    const date = new Date(locations[0].data.map.response[i].weekday)
    dateStrings.push(date.toDateString())
  }

  const MultiTableCell = ({ available, booked }) => {
    let empty = true
    if (available.length || booked.length) empty = false
    return (
      <TableCell align="left">
        {empty && '-'}
        {
          available.map(element => <span className='available'>{element}</span>)
        }
        {
          booked.map(element => <span className='booked'>{element}</span>)
        }
      </TableCell>
    )
  }

  return (
    <section className='timetable'>
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
              let workoutsAtClub = null
              if (userWorkouts) {
                workoutsAtClub = userWorkouts.map.response.filter(workout => workout.ClubId === location.ClubId)
              }

              const times = [{ available: [], booked: [] }, { available: [], booked: [] }, { available: [], booked: [] }, { available: [], booked: [] }, { available: [], booked: [] }, { available: [], booked: [] }, { available: [], booked: [] }]
              for (let i = 0; i < location.data.map.response.length; i += 1) {
                const locDate = location.data.map.response[i]
                const date = location.data.map.response[i].weekday.split('T')[0]

                if (userWorkouts) {
                  const found = workoutsAtClub.filter(workout => workout.date === date)
                  found.forEach(element => {
                    let timeString = element.startAt.split('T')[1]
                    const H = +timeString.substr(0, 2)
                    const h = H % 12 || 12
                    const ampm = (H < 12 || H === 24) ? "AM" : "PM"
                    timeString = h + timeString.substr(2, 3) + ampm
                    times[i].booked.push(timeString)
                  });
                }

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
                    times[i].available.push(timeString)
                  }
                }
              }

              return (
                <TableRow key={location.ClubName} className='club-row'>
                  <TableCell align="left">{location.data ? location.data.map.statusCode : 'N/A'}</TableCell>
                  <TableCell component="th" scope="row">
                    {location.ClubName}
                  </TableCell>
                  <TableCell align="left">{location.ClubId}</TableCell>
                  <MultiTableCell available={times[0].available} booked={times[0].booked} />
                  <MultiTableCell available={times[1].available} booked={times[1].booked} />
                  <MultiTableCell available={times[2].available} booked={times[2].booked} />
                  <MultiTableCell available={times[3].available} booked={times[3].booked} />
                  <MultiTableCell available={times[4].available} booked={times[4].booked} />
                  <MultiTableCell available={times[5].available} booked={times[5].booked} />
                  <MultiTableCell available={times[6].available} booked={times[6].booked} />
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  )
}

export default TimeTable
