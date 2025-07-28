import * as functions from 'firebase-functions';
import axios from 'axios';

const SPOONACULAR_API_KEY = functions.config().spoonacular.key;

export const spoonacularProxy = functions.https.onRequest(async (req, res) => {
  try {
    const { endpoint, ...params } = req.query as { [key: string]: string };
    if (!endpoint) {
      res.status(400).json({ error: 'Missing endpoint parameter' });
      return;
    }
    const response = await axios.get(`https://api.spoonacular.com/${endpoint}`, {
      params: { ...params, apiKey: SPOONACULAR_API_KEY },
    });
    res.json(response.data);
  } catch (error) {
    console.error('spoonacularProxy error', error);
    res.status(500).json({ error: 'Failed to fetch from Spoonacular' });
  }
});
