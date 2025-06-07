interface TranslationResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
}

class GoogleTranslateService {
  private static apiKey: string;
  private static baseUrl = 'https://translation.googleapis.com/language/translate/v2';
  /**
   * Translate text using Google Translate API
   */
  static async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<TranslationResponse> {
    try {
      const params = new URLSearchParams({
        key: this.apiKey,
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

// Create singleton instance
let translateService: GoogleTranslateService | null = null;

/**
 * Get Google Translate service instance
 */
export const getTranslateService = (): GoogleTranslateService => {
  if (!translateService) {
    throw new Error('Google Translate service not initialized. Call initializeTranslateService first.');
  }
  return translateService;
};

// Export types
export type { TranslationResponse };
export { GoogleTranslateService };