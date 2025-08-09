import { Timeline, User, ChatMessage, Contribution, Outcome } from '@/types/timeline';

// Offline-first storage utility functions
export class OfflineStorage {
  private static readonly STORAGE_KEYS = {
    TIMELINES: 'primetimelines_timelines',
    USER: 'primetimelines_user',
    CHAT_MESSAGES: 'primetimelines_chat_messages',
    CONTRIBUTIONS: 'primetimelines_contributions',
    OUTCOMES: 'primetimelines_outcomes',
    DRAFTS: 'primetimelines_drafts',
  } as const;

  // Timeline CRUD operations
  static getTimelines(): Timeline[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.TIMELINES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting timelines:', error);
      return [];
    }
  }

  static saveTimeline(timeline: Timeline): void {
    try {
      const timelines = this.getTimelines();
      const existingIndex = timelines.findIndex(t => t.id === timeline.id);
      
      if (existingIndex >= 0) {
        timelines[existingIndex] = { ...timeline, updatedAt: new Date().toISOString() };
      } else {
        timelines.push({ ...timeline, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
      
      localStorage.setItem(this.STORAGE_KEYS.TIMELINES, JSON.stringify(timelines));
    } catch (error) {
      console.error('Error saving timeline:', error);
      throw new Error('Failed to save timeline');
    }
  }

  static deleteTimeline(id: string): void {
    try {
      const timelines = this.getTimelines().filter(t => t.id !== id);
      localStorage.setItem(this.STORAGE_KEYS.TIMELINES, JSON.stringify(timelines));
    } catch (error) {
      console.error('Error deleting timeline:', error);
      throw new Error('Failed to delete timeline');
    }
  }

  static getTimelineById(id: string): Timeline | null {
    const timelines = this.getTimelines();
    return timelines.find(t => t.id === id) || null;
  }

  // User operations
  static getUser(): User | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  static saveUser(user: User): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw new Error('Failed to save user');
    }
  }

  // Chat messages
  static getChatMessages(timelineId: string): ChatMessage[] {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEYS.CHAT_MESSAGES}_${timelineId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return [];
    }
  }

  static saveChatMessage(timelineId: string, message: ChatMessage): void {
    try {
      const messages = this.getChatMessages(timelineId);
      messages.push(message);
      localStorage.setItem(`${this.STORAGE_KEYS.CHAT_MESSAGES}_${timelineId}`, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat message:', error);
      throw new Error('Failed to save chat message');
    }
  }

  // Contributions
  static getContributions(timelineId: string): Contribution[] {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEYS.CONTRIBUTIONS}_${timelineId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting contributions:', error);
      return [];
    }
  }

  static saveContribution(timelineId: string, contribution: Contribution): void {
    try {
      const contributions = this.getContributions(timelineId);
      const existingIndex = contributions.findIndex(c => c.id === contribution.id);
      
      if (existingIndex >= 0) {
        contributions[existingIndex] = contribution;
      } else {
        contributions.push(contribution);
      }
      
      localStorage.setItem(`${this.STORAGE_KEYS.CONTRIBUTIONS}_${timelineId}`, JSON.stringify(contributions));
    } catch (error) {
      console.error('Error saving contribution:', error);
      throw new Error('Failed to save contribution');
    }
  }

  // Outcomes
  static getOutcomes(timelineId: string): Outcome[] {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEYS.OUTCOMES}_${timelineId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting outcomes:', error);
      return [];
    }
  }

  static saveOutcome(timelineId: string, outcome: Outcome): void {
    try {
      const outcomes = this.getOutcomes(timelineId);
      outcomes.push(outcome);
      localStorage.setItem(`${this.STORAGE_KEYS.OUTCOMES}_${timelineId}`, JSON.stringify(outcomes));
    } catch (error) {
      console.error('Error saving outcome:', error);
      throw new Error('Failed to save outcome');
    }
  }

  // Draft operations for timeline creation
  static saveDraft(draft: Partial<Timeline>): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.DRAFTS, JSON.stringify(draft));
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  }

  static getDraft(): Partial<Timeline> | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.DRAFTS);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting draft:', error);
      return null;
    }
  }

  static clearDraft(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.DRAFTS);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }

  // Bulk operations
  static exportData(): any {
    return {
      timelines: this.getTimelines(),
      user: this.getUser(),
      timestamp: new Date().toISOString(),
    };
  }

  static importData(data: any): void {
    try {
      if (data.timelines) {
        localStorage.setItem(this.STORAGE_KEYS.TIMELINES, JSON.stringify(data.timelines));
      }
      if (data.user) {
        localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }

  // Search functionality
  static searchTimelines(query: string): Timeline[] {
    const timelines = this.getTimelines();
    const searchLower = query.toLowerCase();
    
    return timelines.filter(timeline => 
      timeline.title.toLowerCase().includes(searchLower) ||
      timeline.description.toLowerCase().includes(searchLower) ||
      timeline.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Analytics helpers
  static getPortfolioStats(): any {
    const timelines = this.getTimelines();
    const user = this.getUser();
    
    const totalValue = timelines.reduce((sum, t) => sum + t.value, 0);
    const totalInvested = timelines.reduce((sum, t) => sum + (t.investedAmount || 0), 0);
    const activeCount = timelines.filter(t => t.status === 'active').length;
    
    return {
      totalValue,
      totalInvested,
      totalGains: totalValue - totalInvested,
      activeTimelines: activeCount,
      portfolioBalance: user?.portfolioValue || 0,
    };
  }
}