import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.query.method as string; // Extract the method from the query
  let url: string;
//atualizando proxy
  // The URL is the same for GET, POST, and PUT in this case
  url = 'https://script.google.com/macros/s/AKfycbw142rSpzBE6hrMu_SdnvC-LMAcNa99h8cU3e3W1UF3aqZ4MHjSVLpOZzBihtahuZpb/exec';

  try {
    // Determine the HTTP method to use based on the 'method' query parameter
    let httpMethod;
    switch (method) {
      case 'update':
        httpMethod = 'PUT';
        break;
      case 'get':
        httpMethod = 'GET';
        break;
      default:
        httpMethod = 'POST';
    }

    // Make the request to the Google Apps Script
    console.log(`method: ${httpMethod}, url: ${url}, data: ${JSON.stringify(req.body)}`);
    const response = await axios({
      method: httpMethod,
      url,
      data: httpMethod === 'GET' ? null : req.body, // Only send data for non-GET requests
      headers: {
        'Content-Type': 'application/json'
      },
    });

    // Return the response from the Google Apps Script
    res.status(200).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while making the request to the Google Apps Script.' });
  }
}

export default handler;
