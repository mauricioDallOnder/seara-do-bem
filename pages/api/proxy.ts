import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const mode = String(req.query.method || "post").toLowerCase();

  const url =
    "https://script.google.com/macros/s/AKfycbwPtusYugIept4aEoRqpGsSAW07rl6mbIctHo7J_TiAnAZyOexKExOBqF9sSr9NIaBrbQ/exec";

  // Apps Script WebApp normalmente trabalha com doGet/doPost
  const httpMethod = mode === "get" ? "GET" : "POST";

  try {
    console.log(`proxy -> method: ${httpMethod}, url: ${url}`);

    const response = await axios({
      method: httpMethod,
      url,
      data: httpMethod === "GET" ? undefined : req.body,
      headers: { "Content-Type": "application/json" },
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while making the request to the Google Apps Script.",
    });
  }
};

export default handler;
