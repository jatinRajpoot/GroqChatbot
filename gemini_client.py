import os
from typing import List, Dict

import google.generativeai as genai


class GeminiClient:
    """Client for interacting with Google Gemini API using google-generativeai."""

    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError(
                "Gemini API key is required. Set GEMINI_API_KEY or GOOGLE_API_KEY environment variable."
            )

        genai.configure(api_key=self.api_key)

    def list_models(self, include_all: bool = False) -> List[Dict[str, object]]:
        """Return Gemini models.

        If include_all is False (default), only return models that support text generation.
        """
        try:
            models: List[Dict[str, object]] = []
            for model in genai.list_models():
                if not include_all:
                    supported = getattr(model, "supported_generation_methods", []) or []
                    if (
                        "generateContent" not in supported
                        and "createContent" not in supported
                        and "streamGenerateContent" not in supported
                    ):
                        # Skip embedding or non-generative models for chat usage
                        continue

                # model.name looks like "models/gemini-1.5-pro-latest"; trim prefix for id
                name: str = getattr(model, "name", "")
                model_id = name.split("/")[-1] if name else name
                display_name = getattr(model, "display_name", None) or model_id

                models.append(
                    {
                        "id": model_id,
                        "name": display_name,
                        "owned_by": "google",
                        "active": True,
                    }
                )

            # Sort alphabetically by id for consistency
            models.sort(key=lambda m: m["id"])  # type: ignore[index]
            return models
        except Exception:
            # Provide a sensible fallback list if API fails
            return [
                {"id": "gemini-2.0-flash-exp", "name": "Gemini 2.0 Flash (exp)", "owned_by": "google", "active": True},
                {"id": "gemini-1.5-flash", "name": "Gemini 1.5 Flash", "owned_by": "google", "active": True},
                {"id": "gemini-1.5-pro", "name": "Gemini 1.5 Pro", "owned_by": "google", "active": True},
            ]

    def chat(
        self,
        messages: List[Dict[str, str]],
        model: str = "gemini-1.5-flash",
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        """Send chat messages and return the assistant response text.

        messages: List of {"role": "user"|"assistant", "content": str}
        """
        # Build a chat with history for better context following
        try:
            # Prepare history excluding the last user message (which we'll send as the new turn)
            history: List[Dict[str, object]] = []
            if messages:
                # Map roles: our "assistant" -> Gemini "model"
                for msg in messages[:-1]:
                    role = "model" if msg.get("role") == "assistant" else "user"
                    history.append({"role": role, "parts": [msg.get("content", "")]})

            # Determine the latest user message; if last isn't user, just treat last as prompt
            last = messages[-1] if messages else {"role": "user", "content": ""}
            prompt_text = last.get("content", "")

            gemini = genai.GenerativeModel(model)
            chat = gemini.start_chat(history=history)
            response = chat.send_message(
                prompt_text,
                generation_config={
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                },
            )

            # google-generativeai returns candidates; use text convenience accessor if present
            if hasattr(response, "text") and isinstance(response.text, str):
                return response.text

            # Fallback: serialize parts
            if getattr(response, "candidates", None):
                candidate = response.candidates[0]
                if getattr(candidate, "content", None) and getattr(candidate.content, "parts", None):
                    parts = candidate.content.parts
                    combined = "\n".join(
                        [getattr(p, "text", str(p)) for p in parts if getattr(p, "text", None) or str(p)]
                    )
                    return combined.strip()

            return ""  # Empty response fallback
        except Exception as exc:
            raise Exception(f"Error getting Gemini chat response: {exc}")
