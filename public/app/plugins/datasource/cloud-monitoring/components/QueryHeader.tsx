import { EditorHeader, FlexItem, InlineSelect } from '@grafana/experimental';

import { t } from '../../../../../../public/app/core/internationalization';
import { QUERY_TYPES } from '../constants';
import { CloudMonitoringQuery } from '../types/query';

export interface QueryEditorHeaderProps {
  query: CloudMonitoringQuery;
  onChange: (value: CloudMonitoringQuery) => void;
  onRunQuery: () => void;
}

export const QueryHeader = (props: QueryEditorHeaderProps) => {
  const { query, onChange, onRunQuery } = props;
  const { queryType } = query;

  return (
    <EditorHeader>
      <InlineSelect
        label={t('ablestack-wall.dashboard.query-type', 'Query type')}
        options={QUERY_TYPES}
        value={queryType}
        onChange={({ value }) => {
          onChange({ ...query, queryType: value! });
          onRunQuery();
        }}
      />
      <FlexItem grow={1} />
    </EditorHeader>
  );
};
