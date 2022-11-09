import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  IntegrationMissingKeyError,
  getRawData,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { createAPIClient } from '../../client';
import { Entities, Steps, Relationships } from '../constants';
import { PolicyReport } from '../../types';
import {
  createAssessmentEntity,
  createReportEntity,
  createAssessmentFindingRelationships,
} from './converter';

export async function fetchAssessment({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createAPIClient(instance.config, logger);
  const assessment = await client.getPolicyReport();

  const assessmentEntity = createAssessmentEntity(assessment);
  await jobState.addEntity(assessmentEntity);
}

export async function fetchReport({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createAPIClient(instance.config, logger);
  await jobState.iterateEntities(
    { _type: Entities.ASSESSMENT._type },
    async (assessmentEntity) => {
      const assessment = getRawData<PolicyReport>(assessmentEntity);

      const findings = assessment.items;
      const items = assessment.items;
      await client.iterateFindings(items, async (findings) => {
        const reportEntity = await jobState.addEntity(
          createReportEntity(findings),
        );
        await jobState.addRelationship(
          createAssessmentFindingRelationships(assessmentEntity, reportEntity),
        );
      });
    },
  );
}

export async function buildAssessmentFindingRelationships({
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  await jobState.iterateEntities(
    { _type: Entities.ASSESSMENT._type },
    async (assessmentEntity) => {
      const assessment = getRawData<PolicyReport>(assessmentEntity);

      if (!assessment) {
        logger.warn(
          { _key: assessmentEntity._key },
          'Could not get raw data for assessment entity',
        );
        return;
      }

      for (const finding of assessment.items.results || []) {
        const findingEntity = await jobState.findEntity(finding.id);

        if (!findingEntity) {
          throw new IntegrationMissingKeyError(
            `Expected user with key to exist (key=${finding.id})`,
          );
        }

        await jobState.addRelationship(
          createAssessmentFindingRelationships(assessmentEntity, findingEntity),
        );
      }
    },
  );
}

export const reportSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ASSESSMENT,
    name: 'Fetch Assessment Details',
    entities: [Entities.ASSESSMENT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAssessment,
  },
  {
    id: Steps.REPORT,
    name: 'Fetch Report Details',
    entities: [Entities.REPORT],
    relationships: [Relationships.ASSESSMENT_HAS_FINDING],
    dependsOn: [Steps.ASSESSMENT],
    executionHandler: fetchReport,
  },
  {
    id: Steps.ASSESSMENT_FINDING_RELATIONSHIP,
    name: 'Build Assessment -> Finding Relationships',
    entities: [],
    relationships: [Relationships.ASSESSMENT_HAS_FINDING],
    dependsOn: [Steps.ASSESSMENT, Steps.REPORT],
    executionHandler: buildAssessmentFindingRelationships,
  },
];
