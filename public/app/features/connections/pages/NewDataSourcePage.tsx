import { Page } from 'app/core/components/Page/Page';
import { t } from 'app/core/internationalization';
import { NewDataSource } from 'app/features/datasources/components/NewDataSource';

export function NewDataSourcePage() {
  return (
    <Page
      navId={'connections-datasources'}
      pageNav={{
        text: t('ablestack-wall.connections.add-datasource', 'Add data source'),
        subTitle: t('ablestack-wall.connections.add-datasource-description', 'Choose a data source type'),
        active: true,
      }}
    >
      <Page.Contents>
        <NewDataSource />
      </Page.Contents>
    </Page>
  );
}
