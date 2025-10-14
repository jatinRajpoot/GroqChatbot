import os
from typing import List, Dict
import httpx


class OpenRouterClient:
    """Client for interacting with OpenRouter API"""
    
    def __init__(self, api_key: str | None = None) -> None:
        """Initialize OpenRouter client with API key"""
        self.api_key = api_key or os.getenv('OPENROUTER_API_KEY')
        if not self.api_key:
            raise ValueError(
                "OpenRouter API key is required. Set OPENROUTER_API_KEY environment variable."
            )
        
        self.base_url = "https://openrouter.ai/api/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def list_models(self) -> List[Dict[str, object]]:
        """List all available free OpenRouter models"""
        try:
            with httpx.Client(timeout=30.0) as client:
                response = client.get(
                    f"{self.base_url}/models",
                    headers=self.headers
                )
                response.raise_for_status()
                data = response.json()
                
                models = []
                for model in data.get('data', []):
                    # Filter for free models only
                    pricing = model.get('pricing', {})
                    prompt_price = float(pricing.get('prompt', '1'))
                    completion_price = float(pricing.get('completion', '1'))
                    
                    # Only include models that are free (0 cost)
                    if prompt_price == 0 and completion_price == 0:
                        models.append({
                            'id': model.get('id', ''),
                            'name': model.get('name', model.get('id', '')),
                            'owned_by': 'openrouter',
                            'active': True,
                            'context_length': model.get('context_length', 0)
                        })
                
                # Sort by name
                models.sort(key=lambda x: x['id'])
                
                return models
        except Exception as e:
            print(f"Error listing OpenRouter models: {e}")
            # Return default free models if API call fails
            return [
                {'id': 'meta-llama/llama-3.2-3b-instruct:free', 'name': 'Llama 3.2 3B Instruct (free)', 'owned_by': 'openrouter', 'active': True},
                {'id': 'google/gemma-2-9b-it:free', 'name': 'Gemma 2 9B (free)', 'owned_by': 'openrouter', 'active': True},
                {'id': 'mistralai/mistral-7b-instruct:free', 'name': 'Mistral 7B Instruct (free)', 'owned_by': 'openrouter', 'active': True},
            ]
    
    def chat(
        self,
        messages: List[Dict[str, str]],
        model: str = 'meta-llama/llama-3.2-3b-instruct:free',
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
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
            with httpx.Client(timeout=60.0) as client:
                payload = {
                    "model": model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                }
                
                response = client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json=payload
                )
                response.raise_for_status()
                data = response.json()
                
                if 'choices' in data and len(data['choices']) > 0:
                    return data['choices'][0]['message']['content']
                else:
                    raise Exception("No response from OpenRouter API")
                    
        except httpx.HTTPError as e:
            raise Exception(f"Network error getting OpenRouter chat response: {str(e)}")
        except Exception as e:
            raise Exception(f"Error getting OpenRouter chat response: {str(e)}")
