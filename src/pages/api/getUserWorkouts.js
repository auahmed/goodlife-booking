import axios from 'axios'

export default async (req, res) => {
  const { method, query: { date }, headers: { secureLoginToken } } = req
  switch (method) {
    case 'GET':
      console.log('Getting user workout schedule')
      try {
        const resp = await axios({
          method: 'get',
          url: `https://www.goodlifefitness.com/content/goodlife/en/member-details/jcr:content/root/responsivegrid/myaccount/myclasses/myworkouts.GetMemberWorkoutBookings.${date}.json`,
          headers: {
            cookie: `secureLoginToken=${secureLoginToken}`
          }
        })
        console.log(`Got user workout schedule successfully`)
        return res.json(resp.data)
      } catch (err) {
        console.error(`Error - getting user workout schedule unsuccessful. ${JSON.stringify(err.response.data)}`)
        return res.status(err.response.status).send(err.response.data)
      }
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
