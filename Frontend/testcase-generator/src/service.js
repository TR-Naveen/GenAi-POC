import axios from 'axios';

export const handleserver = async (data) => {
    try {
        const response = await axios.post('http://localhost:5000/data', { prompt: data });
        
        // Check if 'data_from_model' exists in response.data
        if (response.data && response.data.data_from_model) {
            return response.data;  // Return the response data
        } else {
            console.error('Unexpected response format:', response.data);
            return { data_from_model: 'Unexpected response from server.' };
        }
    } catch (error) {
        console.error('Failed to fetch result from server:', error);
        return { data_from_model: 'Error retrieving data from server' };
    }
};
