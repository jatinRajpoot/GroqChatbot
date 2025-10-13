import os
from groq import Groq
import httpx

class GroqClient:
    """Client for interacting with Groq API"""
    
    def __init__(self, api_key=None):
        """Initialize Groq client with API key"""
        self.api_key = api_key or os.getenv('GROQ_API_KEY')
        if not self.api_key:
            raise ValueError("Groq API key is required. Set GROQ_API_KEY environment variable.")
        
        self.client = Groq(api_key=self.api_key)
    
    def list_models(self):
        """List all available Groq models"""
        try:
            models_response = self.client.models.list()
            models = []
            
            for model in models_response.data:
                models.append({
                    'id': model.id,
                    'name': model.id,
                    'owned_by': model.owned_by,
                    'active': model.active if hasattr(model, 'active') else True
                })
            
            # Sort by name
            models.sort(key=lambda x: x['id'])
            
            return models
        except Exception as e:
            print(f"Error listing models: {e}")
            # Return default models if API call fails
            return [
                {'id': 'mixtral-8x7b-32768', 'name': 'Mixtral 8x7B', 'owned_by': 'mistralai', 'active': True},
                {'id': 'llama2-70b-4096', 'name': 'LLaMA2 70B', 'owned_by': 'meta', 'active': True},
                {'id': 'gemma-7b-it', 'name': 'Gemma 7B', 'owned_by': 'google', 'active': True},
                {'id': 'llama3-70b-8192', 'name': 'LLaMA3 70B', 'owned_by': 'meta', 'active': True},
                {'id': 'llama3-8b-8192', 'name': 'LLaMA3 8B', 'owned_by': 'meta', 'active': True}
            ]
    
    def chat(self, messages, model='mixtral-8x7b-32768', temperature=0.7, max_tokens=1024):
        """
        Send chat messages and get response
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
            model: Model ID to use
            temperature: Sampling temperature (0-2)
            max_tokens: Maximum tokens in response
        
        Returns:
            Assistant's response text
        """
        try:
            chat_completion = self.client.chat.completions.create(
                messages=messages,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=1,
                stream=False
            )
            
            return chat_completion.choices[0].message.content
        
        except Exception as e:
            raise Exception(f"Error getting chat response: {str(e)}")
    
    def chat_stream(self, messages, model='mixtral-8x7b-32768', temperature=0.7, max_tokens=1024):
        """
        Send chat messages and get streaming response
        
        Args:
            messages: List of message dictionaries with 'role' and 'content'
            model: Model ID to use
            temperature: Sampling temperature (0-2)
            max_tokens: Maximum tokens in response
        
        Yields:
            Chunks of the response
        """
        try:
            stream = self.client.chat.completions.create(
                messages=messages,
                model=model,
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=1,
                stream=True
            )
            
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content
        
        except Exception as e:
            raise Exception(f"Error getting streaming chat response: {str(e)}")
    
    def text_to_speech(self, text, model='playai-tts', voice='Fritz-PlayAI', response_format='wav'):
        """
        Convert text to speech using Groq TTS API
        
        Args:
            text: Text to convert to speech (max 10K characters)
            model: TTS model to use ('playai-tts' or 'playai-tts-arabic')
            voice: Voice to use for audio generation
            response_format: Format of response audio file (default 'wav')
        
        Returns:
            Audio content as bytes
        """
        try:
            # Use direct HTTP request since SDK doesn't support TTS yet
            url = 'https://api.groq.com/openai/v1/audio/speech'
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json'
            }
            payload = {
                'model': model,
                'voice': voice,
                'input': text,
                'response_format': response_format
            }
            
            with httpx.Client(timeout=30.0) as client:
                response = client.post(url, headers=headers, json=payload)
                
                # Check for errors
                if response.status_code != 200:
                    error_data = response.json()
                    error_message = error_data.get('error', {}).get('message', 'Unknown error')
                    raise Exception(f"TTS API error: {error_message}")
                
                return response.content
        
        except httpx.HTTPError as e:
            raise Exception(f"Network error generating speech: {str(e)}")
        except Exception as e:
            raise Exception(f"Error generating speech: {str(e)}")
