import React, { FC, memo, useState } from 'react';
import { css } from '@emotion/css';
import { stylesFactory, useTheme, Spinner } from '@grafana/ui';
import { GrafanaTheme } from '@grafana/data';
import { contextSrv } from 'app/core/services/context_srv';
import EmptyListCTA from 'app/core/components/EmptyListCTA/EmptyListCTA';
import { FilterInput } from 'app/core/components/FilterInput/FilterInput';
import { FolderDTO } from 'app/types';
import { useManageDashboards } from '../hooks/useManageDashboards';
import { SearchLayout } from '../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { MoveToFolderModal } from './MoveToFolderModal';
import { useSearchQuery } from '../hooks/useSearchQuery';
import { SearchResultsFilter } from './SearchResultsFilter';
import { SearchResults } from './SearchResults';
import { DashboardActions } from './DashboardActions';

export interface Props {
  folder?: FolderDTO;
}

const { isEditor } = contextSrv;

export const ManageDashboards: FC<Props> = memo(({ folder }) => {
  const folderId = folder?.id;
  const folderUid = folder?.uid;
  const theme = useTheme();
  const styles = getStyles(theme);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const defaultLayout = folderId ? SearchLayout.List : SearchLayout.Folders;
  const queryParamsDefaults = {
    skipRecent: true,
    skipStarred: true,
    folderIds: folderId ? [folderId] : [],
    layout: defaultLayout,
  };

  const {
    query,
    hasFilters,
    onQueryChange,
    onTagFilterChange,
    onStarredFilterChange,
    onTagAdd,
    onSortChange,
    onLayoutChange,
  } = useSearchQuery(queryParamsDefaults);

  const {
    results,
    loading,
    initialLoading,
    canSave,
    allChecked,
    hasEditPermissionInFolders,
    canMove,
    canDelete,
    onToggleSection,
    onToggleChecked,
    onToggleAllChecked,
    onDeleteItems,
    onMoveItems,
    noFolders,
  } = useManageDashboards(query, {}, folder);

  const onMoveTo = () => {
    setIsMoveModalOpen(true);
  };

  const onItemDelete = () => {
    setIsDeleteModalOpen(true);
  };

  if (initialLoading) {
    return <Spinner className={styles.spinner} />;
  }

  if (noFolders && !hasFilters) {
    return (
      <EmptyListCTA
        title="이 폴더에는 아직 대시보드가 없습니다"
        buttonIcon="plus"
        buttonTitle="대시보드 생성"
        buttonLink={`dashboard/new?folderId=${folderId}`}
        proTip="폴더에 대시보드 추가/이동 ->"
        proTipLink="dashboards"
        proTipLinkTitle="대시보드 관리"
        proTipTarget=""
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className="page-action-bar">
        <div className="gf-form gf-form--grow m-r-2">
          <FilterInput value={query.query} onChange={onQueryChange} placeholder={'이름으로 대시보드 검색'} />
        </div>
        <DashboardActions isEditor={isEditor} canEdit={hasEditPermissionInFolders || canSave} folderId={folderId} />
      </div>

      <div className={styles.results}>
        <SearchResultsFilter
          allChecked={allChecked}
          canDelete={hasEditPermissionInFolders && canDelete}
          canMove={hasEditPermissionInFolders && canMove}
          deleteItem={onItemDelete}
          moveTo={onMoveTo}
          onToggleAllChecked={onToggleAllChecked}
          onStarredFilterChange={onStarredFilterChange}
          onSortChange={onSortChange}
          onTagFilterChange={onTagFilterChange}
          query={query}
          hideLayout={!!folderUid}
          onLayoutChange={onLayoutChange}
          editable={hasEditPermissionInFolders}
        />
        <SearchResults
          loading={loading}
          results={results}
          editable={hasEditPermissionInFolders}
          onTagSelected={onTagAdd}
          onToggleSection={onToggleSection}
          onToggleChecked={onToggleChecked}
          layout={query.layout}
        />
      </div>
      <ConfirmDeleteModal
        onDeleteItems={onDeleteItems}
        results={results}
        isOpen={isDeleteModalOpen}
        onDismiss={() => setIsDeleteModalOpen(false)}
      />
      <MoveToFolderModal
        onMoveItems={onMoveItems}
        results={results}
        isOpen={isMoveModalOpen}
        onDismiss={() => setIsMoveModalOpen(false)}
      />
    </div>
  );
});

export default ManageDashboards;

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    container: css`
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
    results: css`
      display: flex;
      flex-direction: column;
      flex: 1 1 0;
      height: 100%;
      padding-top: ${theme.spacing.lg};
    `,
    spinner: css`
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    `,
  };
});
