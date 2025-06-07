interface TranslationResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
}

class GoogleTranslateService {
  private static baseUrl = 'https://translation.googleapis.com/language/translate/v2';
  
  /**
   * Get API key from environment variables
   */
  private static getApiKey(): string {
    // For Vite (if using Vite)
    const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY
    
    if (!apiKey) {
      throw new Error('Google Translate API key is not configured');
    }
    
    return apiKey;
  }

  /**
   * Translate text using Google Translate API
   */
  static async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<TranslationResponse> {
    try {
      const apiKey = this.getApiKey();
      
      const params = new URLSearchParams({
        key: apiKey,
        q: text,
        target: targetLanguage,
        format: 'text'
      });

      if (sourceLanguage) {
        params.append('source', sourceLanguage);
      }

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const translation = data.data.translations[0];
      
      return {
        translatedText: translation.translatedText,
        detectedSourceLanguage: translation.detectedSourceLanguage
      };
    } catch (error) {
      console.error('Google Translate API error:', error);
      throw error;
    }
  }

  /**
   * Batch translate multiple texts
   */
  static async batchTranslate(texts: string[], targetLanguage: string, sourceLanguage?: string): Promise<string[]> {
    try {
      const promises = texts.map(text => this.translateText(text, targetLanguage, sourceLanguage));
      const results = await Promise.all(promises);
      return results.map(result => result.translatedText);
    } catch (error) {
      console.error('Batch translation error:', error);
      throw error;
    }
  }
}

// Export types
export type { TranslationResponse };
export { GoogleTranslateService };