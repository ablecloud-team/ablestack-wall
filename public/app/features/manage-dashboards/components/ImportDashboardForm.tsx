import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  Field,
  FormAPI,
  FormFieldErrors,
  FormsOnSubmit,
  HorizontalGroup,
  Input,
  InputControl,
  Legend,
} from '@grafana/ui';
import { DataSourcePicker } from '@grafana/runtime';
import { selectors } from '@grafana/e2e-selectors';

import { FolderPicker } from 'app/core/components/Select/FolderPicker';
import {
  DashboardInput,
  DashboardInputs,
  DataSourceInput,
  ImportDashboardDTO,
  LibraryPanelInputState,
} from '../state/reducers';
import { validateTitle, validateUid } from '../utils/validation';
import { ImportDashboardLibraryPanelsList } from './ImportDashboardLibraryPanelsList';

interface Props extends Pick<FormAPI<ImportDashboardDTO>, 'register' | 'errors' | 'control' | 'getValues' | 'watch'> {
  uidReset: boolean;
  inputs: DashboardInputs;
  initialFolderId: number;

  onCancel: () => void;
  onUidReset: () => void;
  onSubmit: FormsOnSubmit<ImportDashboardDTO>;
}

export const ImportDashboardForm: FC<Props> = ({
  register,
  errors,
  control,
  getValues,
  uidReset,
  inputs,
  initialFolderId,
  onUidReset,
  onCancel,
  onSubmit,
  watch,
}) => {
  const [isSubmitted, setSubmitted] = useState(false);
  const watchDataSources = watch('dataSources');
  const watchFolder = watch('folder');

  /*
    This useEffect is needed for overwriting a dashboard. It
    submits the form even if there's validation errors on title or uid.
  */
  useEffect(() => {
    if (isSubmitted && (errors.title || errors.uid)) {
      onSubmit(getValues(), {} as any);
    }
  }, [errors, getValues, isSubmitted, onSubmit]);
  const newLibraryPanels = inputs?.libraryPanels?.filter((i) => i.state === LibraryPanelInputState.New) ?? [];
  const existingLibraryPanels = inputs?.libraryPanels?.filter((i) => i.state === LibraryPanelInputState.Exits) ?? [];

  return (
    <>
      <Legend>옵션</Legend>
      <Field label="이름" invalid={!!errors.title} error={errors.title && errors.title.message}>
        <Input
          {...register('title', {
            required: '이름은 필수입니다.',
            validate: async (v: string) => await validateTitle(v, getValues().folder.id),
          })}
          type="text"
          data-testid={selectors.components.ImportDashboardForm.name}
        />
      </Field>
      <Field label="폴더">
        <InputControl
          render={({ field: { ref, ...field } }) => (
            <FolderPicker {...field} enableCreateNew initialFolderId={initialFolderId} />
          )}
          name="folder"
          control={control}
        />
      </Field>
      <Field
        label="고유 식별자 (UID)"
        description="대시보드의 고유 식별자(UID)는 여러 모니터링 대시보드를 고유하게 식별하는 데 사용할 수 있습니다.
          UID를 사용하면 대시보드에 액세스하기 위한 일관된 URL을 사용할 수 있으므로 대시보드 제목을 변경해도 해당 대시보드에 대한 책갈피 링크가 손상되지 않습니다."
        invalid={!!errors.uid}
        error={errors.uid && errors.uid.message}
      >
        <>
          {!uidReset ? (
            <Input
              disabled
              {...register('uid', { validate: async (v: string) => await validateUid(v) })}
              addonAfter={!uidReset && <Button onClick={onUidReset}>UID 변경</Button>}
            />
          ) : (
            <Input {...register('uid', { required: true, validate: async (v: string) => await validateUid(v) })} />
          )}
        </>
      </Field>
      {inputs.dataSources &&
        inputs.dataSources.map((input: DataSourceInput, index: number) => {
          const dataSourceOption = `dataSources[${index}]`;
          const current = watchDataSources ?? [];
          return (
            <Field
              label={input.label}
              key={dataSourceOption}
              invalid={errors.dataSources && !!errors.dataSources[index]}
              error={errors.dataSources && errors.dataSources[index] && '데이터 소스가 필요합니다'}
            >
              <InputControl
                name={dataSourceOption as any}
                render={({ field: { ref, ...field } }) => (
                  <DataSourcePicker
                    {...field}
                    noDefault={true}
                    placeholder={input.info}
                    pluginId={input.pluginId}
                    current={current[index]?.name}
                  />
                )}
                control={control}
                rules={{ required: true }}
              />
            </Field>
          );
        })}
      {inputs.constants &&
        inputs.constants.map((input: DashboardInput, index) => {
          const constantIndex = `constants[${index}]`;
          return (
            <Field
              label={input.label}
              error={errors.constants && errors.constants[index] && `${input.label} needs a value`}
              invalid={errors.constants && !!errors.constants[index]}
              key={constantIndex}
            >
              <Input {...register(constantIndex as any, { required: true })} defaultValue={input.value} />
            </Field>
          );
        })}
      <ImportDashboardLibraryPanelsList
        inputs={newLibraryPanels}
        label="New library panels"
        description="List of new library panels that will get imported."
        folderName={watchFolder.title}
      />
      <ImportDashboardLibraryPanelsList
        inputs={existingLibraryPanels}
        label="Existing library panels"
        description="List of existing library panels. These panels are not affected by the import."
        folderName={watchFolder.title}
      />
      <HorizontalGroup>
        <Button
          type="submit"
          data-testid={selectors.components.ImportDashboardForm.submit}
          variant={getButtonVariant(errors)}
          onClick={() => {
            setSubmitted(true);
          }}
        >
          {getButtonText(errors)}
        </Button>
        <Button type="reset" variant="secondary" onClick={onCancel}>
          취소
        </Button>
      </HorizontalGroup>
    </>
  );
};

function getButtonVariant(errors: FormFieldErrors<ImportDashboardDTO>) {
  return errors && (errors.title || errors.uid) ? 'destructive' : 'primary';
}

function getButtonText(errors: FormFieldErrors<ImportDashboardDTO>) {
  return errors && (errors.title || errors.uid) ? 'Import (Overwrite)' : '임포트';
}
