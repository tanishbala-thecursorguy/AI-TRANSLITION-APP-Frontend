/**
 * Mock page detection for uploaded files
 * In a real application, this would use libraries like pdf.js or mammoth.js
 * to actually parse and count pages in PDF/DOCX files
 */

export async function detectPageCount(file: File): Promise<number> {
  return new Promise((resolve) => {
    // Simulate async page detection
    setTimeout(() => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      // Mock page detection based on file size
      // In reality, you'd parse the actual file
      const fileSizeMB = file.size / (1024 * 1024);
      
      let estimatedPages = 1;
      
      if (extension === 'pdf' || extension === 'docx') {
        // Rough estimation: 100KB per page
        estimatedPages = Math.max(1, Math.ceil(fileSizeMB / 0.1));
        
        // Ensure reasonable page counts for testing
        // Small files (< 0.5MB) = 1-3 pages
        // Medium files (0.5-2MB) = 3-10 pages
        // Large files (> 2MB) = 10-20 pages
        if (fileSizeMB < 0.5) {
          estimatedPages = Math.max(1, Math.min(estimatedPages, 3));
        } else if (fileSizeMB < 2) {
          estimatedPages = Math.max(3, Math.min(estimatedPages, 10));
        } else {
          estimatedPages = Math.max(10, Math.min(estimatedPages, 20));
        }
      } else if (extension === 'txt') {
        // Text files - estimate by characters (assuming ~2000 chars per page)
        estimatedPages = Math.max(1, Math.ceil(fileSizeMB * 1024 * 1024 / 2000));
        estimatedPages = Math.max(1, Math.min(estimatedPages, 10));
      } else {
        // Images count as 1 page
        estimatedPages = 1;
      }
      
      resolve(estimatedPages);
    }, 500); // Simulate processing time
  });
}

/**
 * Interface for page statistics
 */
export interface PageStats {
  pageNumber: number;
  characterCount: number;
  wordCount: number;
}

/**
 * Detect characters and words per page
 * Returns an array of stats for each page
 */
export async function detectPageStats(file: File, pageCount: number, textContent?: string): Promise<PageStats[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: PageStats[] = [];
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      // If we have actual text content, analyze it
      if (textContent && textContent.trim().length > 0) {
        const lines = textContent.split('\n').filter(line => line.trim());
        const totalLines = lines.length;
        const linesPerPage = Math.ceil(totalLines / pageCount);
        
        for (let i = 0; i < pageCount; i++) {
          const startLine = i * linesPerPage;
          const endLine = Math.min(startLine + linesPerPage, totalLines);
          const pageLines = lines.slice(startLine, endLine);
          const pageText = pageLines.join('\n');
          
          const charCount = pageText.length;
          const wordCount = pageText.trim() ? pageText.trim().split(/\s+/).length : 0;
          
          stats.push({
            pageNumber: i + 1,
            characterCount: charCount,
            wordCount: wordCount
          });
        }
      } else {
        // Estimate based on file type and size
        const fileSizeMB = file.size / (1024 * 1024);
        const avgCharsPerPage = extension === 'txt' ? 2000 : 1500;
        const avgWordsPerPage = extension === 'txt' ? 300 : 250;
        
        for (let i = 0; i < pageCount; i++) {
          // Add some variation to make it realistic
          const variation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
          const charCount = Math.round(avgCharsPerPage * variation);
          const wordCount = Math.round(avgWordsPerPage * variation);
          
          stats.push({
            pageNumber: i + 1,
            characterCount: charCount,
            wordCount: wordCount
          });
        }
      }
      
      resolve(stats);
    }, 600); // Slightly longer than page detection
  });
}

export const CREDITS_PER_PAGE = 1200;

export const FREE_TRIAL_CREDITS = 3600;
export const FREE_TRIAL_MAX_PAGES = 2; // Free trial can only process 2 pages at once

export function calculateRequiredCredits(pageCount: number): number {
  return pageCount * CREDITS_PER_PAGE;
}

export function formatCredits(credits: number): string {
  return credits.toLocaleString();
}