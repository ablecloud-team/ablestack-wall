import { Tooltip, Button, Stack } from '@grafana/ui';
import { t } from 'app/core/internationalization';

type VersionsButtonsType = {
  hasMore: boolean;
  canCompare: boolean;
  getVersions: (append: boolean) => void;
  getDiff: () => void;
  isLastPage: boolean;
};
export const VersionsHistoryButtons = ({
  hasMore,
  canCompare,
  getVersions,
  getDiff,
  isLastPage,
}: VersionsButtonsType) => (
  <Stack>
    {hasMore && (
      <Button type="button" onClick={() => getVersions(true)} variant="secondary" disabled={isLastPage}>
        {t('ablestack-wall.dashboard.show-more-versions', 'Show more versions')}
      </Button>
    )}
    <Tooltip content="Select two versions to start comparing" placement="bottom">
      <Button type="button" disabled={!canCompare} onClick={getDiff} icon="code-branch">
        {t('ablestack-wall.dashboard.compare-versions', 'Compare versions')}
      </Button>
    </Tooltip>
  </Stack>
);
