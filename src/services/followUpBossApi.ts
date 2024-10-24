import axios from 'axios';

const FUB_API_KEY = import.meta.env.VITE_FUB_API_KEY;
const FUB_BASE_URL = 'https://api.followupboss.com/v1';

const fubApi = axios.create({
  baseURL: FUB_BASE_URL,
  auth: {
    username: FUB_API_KEY,
    password: ''
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

export const syncClientsFromFUB = async () => {
  console.log('FUB_API_KEY:', FUB_API_KEY ? 'Set' : 'Not set');
  
  if (!FUB_API_KEY) {
    console.error('Follow Up Boss API key is not set');
    throw new Error('Follow Up Boss API key is not set');
  }

  try {
    console.log('Attempting to fetch clients from Follow Up Boss API...');
    const response = await fubApi.get('/people');

    console.log('Response received:', response.status, response.statusText);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (!response.data || !Array.isArray(response.data.people)) {
      console.error('Unexpected response format:', response.data);
      throw new Error('Unexpected response format from Follow Up Boss API');
    }

    return response.data.people.map((client: any) => ({
      id: client.id,
      firstName: client.firstName || '',
      lastName: client.lastName || '',
      email: client.email || '',
      phone: client.phone || '',
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });
      throw new Error(`Failed to sync clients: ${error.response?.data?.errorMessage || error.message}`);
    } else {
      console.error('Error syncing clients:', error);
      throw new Error('Failed to sync clients from Follow Up Boss');
    }
  }
};

// Rest of the file remains the same