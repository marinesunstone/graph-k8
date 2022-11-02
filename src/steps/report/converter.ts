import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { PolicyReport } from '../../types';

import { Entities } from '../constants';

export function createReportEntity(results: PolicyReport): Entity {
  return createIntegrationEntity({
    entityData: {
      source: 'report',
      assign: {
        _key: 'unique-report-id',
        _type: Entities.REPORT._type,
        _class: Entities.REPORT._class,
        policy: results.results.policy,
        message: results.results.message,
        result: results.results.result,
      },
    },
  });
}
