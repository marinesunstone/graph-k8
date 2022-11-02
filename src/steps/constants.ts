import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  REPORT: 'fetch-report',
  USERS: 'fetch-users',
  GROUPS: 'fetch-groups',
  GROUP_USER_RELATIONSHIPS: 'build-user-group-relationships',
};

export const Entities: Record<'REPORT' | 'GROUP' | 'USER', StepEntityMetadata> =
  {
    REPORT: {
      resourceName: 'Finding',
      _type: 'policyReport',
      _class: ['Finding'],
      schema: {
        properties: {
          policy: { type: 'string' },
          message: { type: 'string' },
          result: { type: 'string' },
        },
        required: ['message'],
      },
    },
    GROUP: {
      resourceName: 'UserGroup',
      _type: 'acme_group',
      _class: ['UserGroup'],
      schema: {
        properties: {
          email: { type: 'string' },
          logoLink: { type: 'string' },
        },
        required: ['email', 'logoLink'],
      },
    },
    USER: {
      resourceName: 'User',
      _type: 'acme_user',
      _class: ['User'],
      schema: {
        properties: {
          username: { type: 'string' },
          email: { type: 'string' },
          active: { type: 'boolean' },
          firstName: { type: 'string' },
        },
        required: ['username', 'email', 'active', 'firstName'],
      },
    },
  };

export const Relationships: Record<
  'ACCOUNT_HAS_USER' | 'ACCOUNT_HAS_GROUP' | 'GROUP_HAS_USER',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_USER: {
    _type: 'acme_account_has_user',
    sourceType: Entities.REPORT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_GROUP: {
    _type: 'acme_account_has_group',
    sourceType: Entities.REPORT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP._type,
  },
  GROUP_HAS_USER: {
    _type: 'acme_group_has_user',
    sourceType: Entities.GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
};
