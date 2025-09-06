    /** Case management service for API interactions. */

import { Case } from '../types/trial';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface CaseFilters {
  category?: string;
  search?: string;
}

export class CaseService {
  /**
   * Fetch all available cases
   */
  static async getAllCases(): Promise<Case[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cases/`);
      if (!response.ok) {
        throw new Error(`Failed to fetch cases: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching cases:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific case by ID
   */
  static async getCaseById(caseId: string): Promise<Case> {
    try {
      const response = await fetch(`${API_BASE_URL}/cases/${caseId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch case: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching case:', error);
      throw error;
    }
  }

  /**
   * Search cases by query
   */
  static async searchCases(query: string): Promise<Case[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cases/search/${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Failed to search cases: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching cases:', error);
      throw error;
    }
  }

  /**
   * Get cases by category
   */
  static async getCasesByCategory(category: string): Promise<Case[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cases/category/${encodeURIComponent(category)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch cases by category: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching cases by category:', error);
      throw error;
    }
  }

  /**
   * Get case categories
   */
  static getCaseCategories(): string[] {
    return [
      'white-collar',
      'violent',
      'drug',
      'property',
      'cybercrime'
    ];
  }

  /**
   * Get category display name
   */
  static getCategoryDisplayName(category: string): string {
    const categoryMap: Record<string, string> = {
      'white-collar': 'White-Collar Crime',
      'violent': 'Violent Crime',
      'drug': 'Drug-Related Crime',
      'property': 'Property Crime',
      'cybercrime': 'Cybercrime'
    };
    return categoryMap[category] || category;
  }
}
