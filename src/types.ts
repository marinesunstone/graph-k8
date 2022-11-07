// Providers often supply types with their API libraries.

export interface PolicyReport {
  apiVersion: string;
  items: [
    {
      apiVersion: string;
      kind: string;
      metadata: {
        annotations: {
          category: string;
          name: string;
          version: string;
        };
        creationTimeStamp: string;
        generation: number;
        labels: {
          'wgpolicyk8s.io/engine': string;
        };
        name: string;
        namespace: string;
        resourceVersion: string;
        uid: string;
      };
      results: [
        {
          policy: string;
          message: string;
          properties: {
            category: string;
            index: string;
          };
          result: string;
          scored: boolean;
        },
      ];
      summary: {
        error: number;
        fail: number;
        pass: number;
        skip: number;
        warn: number;
      };
    },
  ];
  kind: string;
  metadata: {
    resourceVersion: string;
  };
}
