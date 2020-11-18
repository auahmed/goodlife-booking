import axios from 'axios'

export default async (req, res) => {
  const { method, query: { clubId } } = req
  switch (method) {
    case 'GET':
      console.log(`Getting club times for club ${clubId}`)
      try {
        const resp = await axios({
          method: 'get',
          url: `https://www.goodlifefitness.com/content/goodlife/en/book-workout/jcr:content/root/responsivegrid/workoutbooking.GetWorkoutSlots.${clubId}.2020-11-18.json`
        })
        console.log(`Got club times for club ${clubId} successfully`)
        return res.json(resp.data)
      } catch (err) {
        console.error(`Error - club times for club ${clubId} unsuccessful. ${err.response.data}`)
        return res.status(err.response.status).send(err.response.data)
      }
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
