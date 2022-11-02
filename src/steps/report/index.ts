import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAPIClient } from '../../client';
import { Steps, Entities } from '../constants';
import { createReportEntity } from './converter';

export const REPORT_ENTITY_KEY = 'entity:report';

export async function fetchReportDetails({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createAPIClient(instance.config, logger);
  const report = await client.getPolicyReport();

  const reportEntity = createReportEntity(report);
  await jobState.addEntity(reportEntity);
}

export const reportSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.REPORT,
    name: 'Fetch Report Details',
    entities: [Entities.REPORT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchReportDetails,
  },
];
