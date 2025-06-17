import express from 'express'
import axios from 'axios'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.post('/api/send-at', async (req, res) => {
  try {
    const response = await axios.post(
      'http://192.168.1.11/boafrm/formAtcmdProcess',
      new URLSearchParams({
        FormAtcmd_Param_Atcmd: 'AT^DRPR=2',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'http://192.168.1.11/index.asp',
        },
        auth: {
          username: 'admin123',
          password: 'admin123',
        },
        responseType: 'text',
      }
    )

    res.status(200).send(response.data)
  } catch (error) {
    console.error('Proxy error:', error.message)
    res.status(500).send({ error: 'Device error', details: error.message })
  }
})

app.listen(5001, () => {
  console.log('✅ Proxy running at http://localhost:5001')
})
