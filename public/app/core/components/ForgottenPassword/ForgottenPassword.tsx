import { css } from '@emotion/css';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { GrafanaTheme2 } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { Field, Input, Button, Legend, Container, useStyles2, LinkButton, Stack } from '@grafana/ui';
import config from 'app/core/config';
import { t } from 'app/core/internationalization';

interface EmailDTO {
  userOrEmail: string;
}

const paragraphStyles = (theme: GrafanaTheme2) =>
  css({
    color: theme.colors.text.secondary,
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: theme.typography.fontWeightRegular,
    marginTop: theme.spacing(1),
    display: 'block',
  });

export const ForgottenPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const styles = useStyles2(paragraphStyles);
  const loginHref = `${config.appSubUrl}/login`;
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EmailDTO>();

  const sendEmail = async (formModel: EmailDTO) => {
    const res = await getBackendSrv().post('/api/user/password/send-reset-email', formModel);
    if (res) {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <div>
        <p>An email with a reset link has been sent to the email address. You should receive it shortly.</p>
        <Container margin="md" />
        <LinkButton variant="primary" href={loginHref}>
          Back to login
        </LinkButton>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit(sendEmail)}>
      <Legend>{t('ablestack-wall.login.reset-password', 'Reset password')}</Legend>
      <Field
        label={t('ablestack-wall.common.user', 'User')}
        description={t(
          'ablestack-wall.login.reset-password-description',
          'Enter your information to get a reset link sent to you'
        )}
        invalid={!!errors.userOrEmail}
        error={errors?.userOrEmail?.message}
      >
        <Input
          id="user-input"
          placeholder={t('ablestack-wall.login.email-or-username', 'Email or username')}
          {...register('userOrEmail', { required: 'Email or username is required' })}
        />
      </Field>
      <Stack>
        <Button type="submit">{t('ablestack-wall.login.send-reset-email', 'Send reset email')}</Button>
        <LinkButton fill="text" href={loginHref}>
          {t('ablestack-wall.login.back-to-login', 'Back to login')}
        </LinkButton>
      </Stack>

      <p className={styles}>
        {t(
          'ablestack-wall.login.contact-administrator',
          'Did you forget your username or email? Contact your Wall administrator.'
        )}
      </p>
    </form>
  );
};
