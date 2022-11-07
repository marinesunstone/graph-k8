import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { PolicyReport } from '../../types';

import { Entities } from '../constants';

export function createReportEntity(results: PolicyReport): Entity {
  return createIntegrationEntity({
    entityData: {
      source: results,
      assign: {
        _key: 'unique-report-id',
        _type: Entities.REPORT._type,
        _class: Entities.REPORT._class,
        name: 'policy report',
        policyReport: results,
      },
    },
  });
}
