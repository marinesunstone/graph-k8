import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ASSESSMENT: 'fetch-assessment',
  REPORT: 'fetch-report',
  ASSESSMENT_FINDING_RELATIONSHIP: 'build-assessment-finding-relationships',
};

export const Entities: Record<'ASSESSMENT' | 'REPORT', StepEntityMetadata> = {
  ASSESSMENT: {
    resourceName: 'KubernetesPolicyReportAssessment',
    _type: 'KubernetesPolicyReportAssessment',
    _class: ['Assessment'],
  },
  REPORT: {
    resourceName: 'KubernetesPolicyReportFindings',
    _type: 'KubernetesPolicyReportFindings',
    _class: ['Finding'],
  },
};

export const Relationships: Record<
  'ASSESSMENT_HAS_FINDING',
  StepRelationshipMetadata
> = {
  ASSESSMENT_HAS_FINDING: {
    _type:
      'KubernetesPolicyReportAssessment_has_KubernetesPolicyReportFindings',
    sourceType: Entities.ASSESSMENT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.REPORT._type,
  },
};
