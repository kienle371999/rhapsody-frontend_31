import { useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTranslation } from "next-i18next";
import { Form, Field } from "react-final-form";

import { AppTextField } from "@/components/inputs/text";
import { ButtonBack } from "@/components/buttons/back";
import { ButtonPrimary } from "@/components/buttons/styles";
import { Toast } from "@/components/toast";
import { useAuth } from "@/contexts/auth";
import { emailFormat } from "@/utils/validators";

export const ForgotPasswordForm = () => {
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const validate = (values: any = {}) => {
    const errors: any = {};
    if (!values.email) {
      errors.email = t("formError.required");
    }
    if (emailFormat(values.email)) {
      errors.email = t("formError.invalidEmail");
    }
    return errors;
  };

  const onSubmit = async (values: { email: string }) => {
    try {
      setIsLoading(true);
      await auth.resetPassword(values.email);
      Toast.success(`Forgot email`, `Reset link has been sent`);
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      Toast.error(`Try again!`, e.message);
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Stack width="100%" spacing={{ xs: 3, md: 2 }}>
            <ButtonBack />
            <Typography variant="title1">
              {t("forgotPassword.resetYourPassword")}
            </Typography>
            <Field name="email">
              {({ input, meta }) => (
                <AppTextField
                  error={meta.submitFailed && meta.error}
                  variant="filled"
                  helperText={meta.submitFailed && meta.error}
                  label={t("form.labelEmail")}
                  type="text"
                  {...input}
                />
              )}
            </Field>
            <ButtonPrimary
              loading={isLoading}
              type="submit"
              size="large"
              sx={{
                fontSize: { xs: 18 },
              }}
            >
              {t("forgotPassword.validateBtn")}
            </ButtonPrimary>
          </Stack>
        </form>
      )}
    />
  );
};
