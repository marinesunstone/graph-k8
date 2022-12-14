import http from 'http';

import { IntegrationProviderAuthenticationError } from '@jupiterone/integration-sdk-core';
import fetch from 'node-fetch';
import { IntegrationConfig } from './config';
import { PolicyReport } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  private BASE_URL =
    'https://api.github.com/repos/SunStone-Secure-LLC/compliance';
  constructor(
    readonly config: IntegrationConfig,
    readonly logger: IntegrationLogger,
  ) {}

  public async getPolicyReport(): Promise<PolicyReport> {
    const res = await fetch(
      this.BASE_URL + '/contents/templates/policy-report/res.json',
      {
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
        },
      },
    );
    // If the response is not ok, we should handle the error
    if (!res.ok) {
      this.handleApiError(
        res,
        this.BASE_URL + '/contents/templates/policy-report/res.json',
      );
    }
    const file = await res.json();
    const content = file.content;
    const decodedFile = atob(content);
    const jsonFile = JSON.parse(decodedFile);
    return jsonFile as PolicyReport;
  }

  private handleApiError(err: any, endpoint: string): void {
    if (err.status === 401) {
      throw new IntegrationProviderAuthenticationError({
        endpoint: endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    } else if (err.status === 403) {
      throw new IntegrationProviderAuthorizationError({
        endpoint: endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    } else {
      throw new IntegrationProviderAPIError({
        endpoint: endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateFindings(
    items,
    iteratee: ResourceIteratee<PolicyReport>,
  ): Promise<void> {
    const results = items[0].results;
    for (const result of results) {
      await iteratee(result);
    }
  }
}

export function createAPIClient(
  config: IntegrationConfig,
  logger: IntegrationLogger,
): APIClient {
  return new APIClient(config, logger);
}
