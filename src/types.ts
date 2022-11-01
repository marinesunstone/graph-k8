// Providers often supply types with their API libraries.

export interface PolicyReport {
  results: {
    policy: string;
    message: string;
    result: string;
  }
}
