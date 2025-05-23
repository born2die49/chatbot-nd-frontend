import { getCookie } from "cookies-next";

const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const token = getCookie('session_access_token');
    return typeof token === 'string' ? token : null;
}

const apiService = {
  get: async function(url: string, params?: Record<string, any>): Promise<any> {
    const headers = await this.prepareHeaders();
    let queryString = '';
    if (params) {
      queryString = '?' + new URLSearchParams(params).toString();
    }
    console.log('GET Request:', `${process.env.NEXT_PUBLIC_API_HOST}${url}${queryString}`);
    return fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}${queryString}`, {
      method: 'GET',
      headers: headers,
    })
    .then(this.handleResponse)
    .catch(this.handleError);
  },

  post: async function(url: string, data: any, isFormData: boolean = false): Promise<any> {
    const headers = await this.prepareHeaders(isFormData);
    console.log('POST Request:', `${process.env.NEXT_PUBLIC_API_HOST}${url}`, data);
    return fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      headers: headers,
    })
    .then(this.handleResponse)
    .catch(this.handleError);
  },

  postFormData: async function(url: string, formData: FormData): Promise<any> {
    const headers = await this.prepareHeaders(true);
    console.log('POST Request:', `${process.env.NEXT_PUBLIC_API_HOST}${url}`, formData);
    return fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: 'POST',
      body: formData,
      headers: headers,
    })
    .then(this.handleResponse)
    .catch(this.handleError);
  },

  put: async function(url: string, data: any, isFormData: boolean = false): Promise<any> {
    const headers = await this.prepareHeaders(isFormData);
    console.log('PUT Request:', `${process.env.NEXT_PUBLIC_API_HOST}${url}`, data);
    return fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
      headers: headers,
    })
    .then(this.handleResponse)
    .catch(this.handleError);
  },

  patch: async function(url: string, data: any, isFormData: boolean = false): Promise<any> {
  const headers = await this.prepareHeaders(isFormData);
  console.log('PATCH Request:', `${process.env.NEXT_PUBLIC_API_HOST}${url}`, data);
  return fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
    method: 'PATCH',
    body: isFormData ? data : JSON.stringify(data),
    headers: headers,
  })
  .then(this.handleResponse)
  .catch(this.handleError);
},

  delete: async function(url: string): Promise<any> {
    const headers = await this.prepareHeaders();
    console.log('DELETE Request:', `${process.env.NEXT_PUBLIC_API_HOST}${url}`);
    return fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: 'DELETE',
      headers: headers,
    })
    .then(this.handleResponse)
    .catch(this.handleError);
  },

  prepareHeaders: async function(isFormData: boolean = false): Promise<HeadersInit> {
    const accessToken = getAccessToken();
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return headers;
  },

  handleResponse: async function(response: Response) {
    if (response.status === 204) { // No Content
      return null;
    }
    const responseData = await response.json();
    if (!response.ok) {
      console.error('API Error Response:', response.status, responseData);
      const error: any = new Error(responseData.detail || responseData.message || response.statusText || 'API request failed');
      error.response = response;
      error.data = responseData; // Attach full response data
      error.status = response.status;
      return Promise.reject(error);
    }
    return responseData;
  },

  handleError: function(error: any) {
    console.error('API Service Error:', error);
    
    return Promise.reject(error.data || error);
  }
}

export default apiService;



// const apiService = {
//   post: async function(url: string, data: any): Promise<any> {
//     console.log('post', url, data);

//     return new Promise((resolve, reject) => {
//         fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
//             method:'POST',
//             body: data,
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-type':'application/json'
//             }
//         })
//         .then(response => response.json())
//         .then((json) => {
//             console.log('Response', json);

//             resolve(json);
//         })
//         .catch((error) => {
//             reject(error);
//         })
//     })
//   }
// }

// export default apiService;