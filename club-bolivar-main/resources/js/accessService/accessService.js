import axios from 'axios';

export const procesarQR = (data) =>
    axios.post('/api/accesos/qr', data);

export const reconocimientoFacial = (formData) =>
    axios.post(route('accesos.reconocer'), formData);