import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { PolicyReport } from '../../types';

import { Entities } from '../constants';

export function createAccountEntity(results: PolicyReport): Entity {
  return createIntegrationEntity({
    entityData: {
      source: 'account',
      assign: {
        _key: 'unique-account-id',
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        policy: results.results.policy,
        message: results.results.message,
        result: results.results.result,
      },
    },
  });
}
