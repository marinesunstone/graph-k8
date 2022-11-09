import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import { PolicyReport } from '../../types';

import { Entities } from '../constants';

export function createAssessmentEntity(assessment: PolicyReport): Entity {
  return createIntegrationEntity({
    entityData: {
      source: assessment,
      assign: {
        _key: 'unique-report-id',
        _type: Entities.ASSESSMENT._type,
        _class: Entities.ASSESSMENT._class,
        category: 'kubernetes policy report',
        summary:
          assessment.items[0].metadata.annotations.category +
          ' ' +
          assessment.items[0].metadata.annotations.name +
          ' ' +
          assessment.items[0].metadata.annotations.version,
        internal: true,
        name:
          assessment.items[0].metadata.annotations.category +
          ' ' +
          assessment.items[0].metadata.annotations.name +
          ' ' +
          assessment.items[0].metadata.annotations.version,
        createdOn: assessment.items[0].metadata.creationTimeStamp,
      },
    },
  });
}

export function createReportEntity(report: PolicyReport): Entity {
  return createIntegrationEntity({
    entityData: {
      source: report,
      assign: {
        _key: report.message,
        _type: Entities.REPORT._type,
        _class: Entities.REPORT._class,
        category: Entities.REPORT._type,
        severity: report.result,
        numericSeverity: parseInt(report.properties.index),
        open: true,
        name: report.message,
        policy: report.policy,
        result: report.result,
        scored: report.scored,
      },
    },
  });
}

export function createAssessmentFindingRelationships(
  assessment: Entity,
  finding: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: assessment,
    to: finding,
  });
}
