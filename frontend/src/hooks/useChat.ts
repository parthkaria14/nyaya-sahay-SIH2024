import { useState, useCallback } from 'react';
import { ChatMessage, QueryType } from '@/types/chat';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

// Define the endpoint configuration type
type ApiEndpointConfig = {
  url: string;
  endpoint: string;
};

// Define the API endpoints type - excluding caseStatus for now
type ApiEndpoints = {
  [K in Exclude<QueryType, 'caseStatus'>]: ApiEndpointConfig;
};

// API endpoints with different IP addresses
const API_ENDPOINTS: ApiEndpoints = {
  normal: {
     url: 'http://13.201.2.214', // Full URL
    endpoint: '/query'
  },
  templates: {
    url: import.meta.env.VITE_TEMPLATES_API_URL || 'http://3.7.57.183',
    endpoint: '/get-documents'
  }
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeQueryType, setActiveQueryType] = useState<QueryType>('normal');
  const [captchaImage, setCaptchaImage] = useState<string>('');
  const [cnrNumber, setCnrNumber] = useState<string>('');
  const [captchaInput, setCaptchaInput] = useState<string>('');
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);

  // Generate a truly unique ID for messages
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleQueryTypeSelect = useCallback(async (type: QueryType) => {
    setActiveQueryType(type);
    
    if (type === 'caseStatus') {
      await fetchCaptcha(); // Fetch captcha when switching to case status
    }
    
    const systemMessage: ChatMessage = {
      id: generateUniqueId(),
      content: type === 'caseStatus' 
        ? 'Please enter your CNR number and the captcha to check case status.'
        : `Switched to ${type} mode. How can I help you?`,
      sender: 'bot',
      timestamp: new Date(),
      type: type
    };
    
    setMessages([systemMessage]);
  }, []);

  const fetchCaptcha = useCallback(async () => {
    try {
      setIsCaptchaLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/`);
      if (response.data.captcha_base64) {
        setCaptchaImage(response.data.captcha_base64);
      } else {
        throw new Error('No captcha received');
      }
    } catch (error) {
      console.error('Error fetching captcha:', error);
      toast.error('Failed to load captcha');
    } finally {
      setIsCaptchaLoading(false);
    }
  }, []);

  const submitCaseStatus = useCallback(async () => {
    try {
      if (!cnrNumber || !captchaInput) {
        toast.error('Please enter CNR number and captcha');
        return;
      }
  
      const userMessage: ChatMessage = {
        id: generateUniqueId(),
        content: `Checking case status for CNR: ${cnrNumber}`,
        sender: 'user',
        timestamp: new Date(),
        type: 'caseStatus'
      };
      setMessages(prev => [...prev, userMessage]);
  
      const response = await axios.post<CaseStatusResponse>(
        `${import.meta.env.VITE_API_URL}/`,
        {
          cino: cnrNumber,
          captcha: captchaInput
        }
      );
  
      if (response.data.success) {
        const botMessage: ChatMessage = {
          id: generateUniqueId(),
          content: response.data.result,
          sender: 'bot',
          timestamp: new Date(),
          type: 'caseStatus',
          caseStatus: {
            cnrNumber,
            result: response.data.result
          }
        };
  
        setMessages(prev => [...prev, botMessage]);
        
        // Clear inputs after successful submission
        setCnrNumber('');
        setCaptchaInput('');
      }
    } catch (error) {
      console.error('Error submitting case status:', error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.error('Invalid captcha. Please try again.');
        fetchCaptcha(); // Regenerate captcha on invalid input
        setCaptchaInput(''); // Clear captcha input
      } else {
        toast.error('Failed to fetch case status');
      }
    }
  }, [cnrNumber, captchaInput]);

  const downloadDocument = useCallback(async (url: string) => {
    try {
      if (!url || typeof url !== 'string') {
        console.error('Invalid URL:', url);
        throw new Error('Invalid download URL');
      }

      console.log('Downloading document from:', url);

      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', ''); // Force download
      link.style.display = 'none';
      
      // Add to document, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    try {
      setIsLoading(true);
  
      const userMessage: ChatMessage = {
        id: generateUniqueId(),
        content,
        sender: 'user',
        timestamp: new Date(),
        type: activeQueryType
      };
      setMessages((prev) => [...prev, userMessage]);
  
      const apiConfig = API_ENDPOINTS[activeQueryType as Exclude<QueryType, 'caseStatus'>];
      const api = createApiInstance(apiConfig.url);
  
      // Log the request URL
      console.log('Sending request to:', `${apiConfig.url}${apiConfig.endpoint}`);
  
      const response = await api.post(apiConfig.endpoint, {
        query: content,
        ...(activeQueryType === 'templates' && {
          type: 'template_search',
          language: 'en'
        }),
        prompt:content,
        ...(activeQueryType === 'normal' && {
          type:'normal',
          language:'en'
        })

        
      });
  
      // Log the response
      console.log('API Response:', response.data);
  
      let responseContent = '';
      let templates = undefined;
  
      if (activeQueryType === 'templates') {
        if (response.data.documents && Array.isArray(response.data.documents)) {
          responseContent = 'Here are the relevant documents:';
          templates = response.data.documents.map((doc: any) => {
            const docUrl = typeof doc === 'string' ? doc : (doc.download_url || doc.url || doc.link);
            const docName = typeof doc === 'string' ? 
              docUrl.split('/').pop() || 'Document' : 
              (doc.name || doc.title || 'Document');
            
            return {
              id: generateUniqueId(),
              name: docName,
              url: docUrl
            };
          });
          console.log('Processed templates:', templates);
        }
      } else {
        responseContent = response.data.answer || 
                         response.data.response || 
                         response.data.message || 
                         response.data.content ||
                         (typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
      }
  
      const botMessage: ChatMessage = {
        id: generateUniqueId(),
        content: responseContent,
        sender: 'bot',
        timestamp: new Date(),
        type: activeQueryType,
        templates: templates
      };
  
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('API Error:', error);
      let errorMessage = 'Failed to send message';
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.code === 'ERR_NETWORK') {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (axiosError.response) {
          errorMessage = axiosError.response.data.message || 
                        axiosError.response.data.error || 
                        'Failed to process your request';
        } else if (axiosError.request) {
          errorMessage = 'No response received from the server. Please check your network connection.';
        } else {
          errorMessage = 'An unknown error occurred. Please try again.';
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [activeQueryType]);

  return {
    messages,
    isLoading,
    sendMessage,
    activeQueryType,
    handleQueryTypeSelect,
    downloadDocument,
    captchaImage,
    cnrNumber,
    setCnrNumber,
    captchaInput,
    setCaptchaInput,
    submitCaseStatus,
    fetchCaptcha,
    isCaptchaLoading
  };
}

// Update the axios instance to include better error handling
const createApiInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 60000, // Increase timeout to 60 seconds
  });

  // Add request interceptor for debugging
  instance.interceptors.request.use(
    (config) => {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        data: config.data
      });
      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  return instance;
};