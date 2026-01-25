/**
 * Bible API Client
 * A simple TypeScript client for fetching Bible verses from bible-api.com
 */

interface BibleVerse {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

interface BibleResponse {
  reference: string;
  verses: BibleVerse[];
  text: string;
  translationId: string;
  translationName: string;
  translationNote: string;
}

type Translation = "kjv" | "web" | "oeb-us" | "clementine" | "almeida" | string;

const bibleClient = {
  baseUrl: "https://bible-api.com" as const,

  /**
   * Fetches a Bible verse or passage
   * @param {string} reference - Bible reference (e.g., "John 3:16", "Genesis 1:1-10", "Psalm 23")
   * @param {Translation} translation - Bible translation (optional, defaults to KJV)
   * @returns {Promise<BibleResponse>} Verse data
   */
  async getVerse(
    reference: string,
    translation: Translation | null = null,
  ): Promise<BibleResponse> {
    try {
      const encodedRef = encodeURIComponent(reference);
      const url = translation
        ? `${this.baseUrl}/${encodedRef}?translation=${translation}`
        : `${this.baseUrl}/${encodedRef}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BibleResponse =
        (await response.json()) as unknown as BibleResponse;
      return data;
    } catch (error) {
      console.error("Error fetching verse:", error);
      throw error;
    }
  },

  /**
   * Fetches multiple verses
   * @param {string[]} references - Array of Bible references
   * @param {Translation} translation - Bible translation (optional)
   * @returns {Promise<BibleResponse[]>} Array of verse data
   */
  async getMultipleVerses(
    references: string[],
    translation: Translation | null = null,
  ): Promise<BibleResponse[]> {
    try {
      const promises = references.map((ref) => this.getVerse(ref, translation));
      return await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching multiple verses:", error);
      throw error;
    }
  },

  /**
   * Formats verse data into readable text
   * @param {BibleResponse} verseData - Data returned from API
   * @returns {string} Formatted verse text
   */
  formatVerse(verseData: BibleResponse | null): string {
    if (!verseData) return "";

    return `${verseData.reference}\n${verseData.text.trim()}\n(${verseData.translationName})`;
  },
};

// Usage Examples:

// Example 1: Get a single verse
bibleClient
  .getVerse("John 3:16")
  .then((data) => {
    console.log(bibleClient.formatVerse(data));
  })
  .catch((err) => console.error(err));

// Example 2: Get a passage
bibleClient
  .getVerse("Genesis 1:1-3")
  .then((data) => {
    console.log(bibleClient.formatVerse(data));
  })
  .catch((err) => console.error(err));

// Example 3: Get verse with specific translation
bibleClient
  .getVerse("Psalm 23:1", "web")
  .then((data) => {
    console.log(bibleClient.formatVerse(data));
  })
  .catch((err) => console.error(err));

// Example 4: Get multiple verses
bibleClient
  .getMultipleVerses(["John 3:16", "Romans 8:28", "Philippians 4:13"])
  .then((verses) => {
    verses.forEach((verse) => {
      console.log(bibleClient.formatVerse(verse));
      console.log("---");
    });
  })
  .catch((err) => console.error(err));

// Export for use in modules
export default bibleClient;
export type { BibleResponse, BibleVerse, Translation };
