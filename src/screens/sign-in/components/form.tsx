import { useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Form, Field } from "react-final-form";

import { AppTextField } from "@/components/inputs/text";
import { ButtonPrimary } from "@/components/buttons/styles";
import { MUILink } from "@/components/mui-link";
import { Toast } from "@/components/toast";
import { ROUTES } from "@/config/navigation";
import { useAuth } from "@/contexts/auth";
import { emailFormat } from "@/utils/validators";

export const SignInForm = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();

  const validate = (values: any = {}) => {
    const errors: any = {};
    if (!values.password) {
      errors.password = t("formError.required");
    }
    if (!values.email) {
      errors.email = t("formError.required");
    }
    if (emailFormat(values.email)) {
      errors.email = t("formError.invalidEmail");
    }
    return errors;
  };

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const signeddUser = await auth.logIn(values);
      if (signeddUser) {
        router.push({
          pathname: ROUTES.account,
        });
        setIsLoading(false);
      }
    } catch (e: any) {
      setIsLoading(false);
      Toast.error(`Try again!`, e.message);
    }
  };

  return (
    <Stack width="100%" spacing={{ xs: 3, md: 2 }}>
      <Typography variant="title1">{t("signIn.logIn")}</Typography>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, submitting, pristine }) => (
          <form onSubmit={handleSubmit}>
            <Stack width="100%" spacing={{ md: 3, xs: 2 }}>
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
              <Field name="password">
                {({ input, meta }) => (
                  <AppTextField
                    error={meta.submitFailed && meta.error}
                    variant="filled"
                    helperText={meta.submitFailed && meta.error}
                    label={t("form.labelPassword")}
                    type="password"
                    {...input}
                  />
                )}
              </Field>
              <MUILink
                href={{
                  pathname: ROUTES.forgotPassword,
                }}
              >
                <Button
                  variant="text"
                  sx={{
                    textTransform: "capitalize",
                  }}
                >
                  {"Forgot your password?"}
                </Button>
              </MUILink>
              <ButtonPrimary
                loading={isLoading}
                type="submit"
                size="large"
                sx={{
                  fontSize: { xs: 18 },
                }}
              >
                {t("signIn.continue")}
              </ButtonPrimary>
            </Stack>
          </form>
        )}
      />
    </Stack>
  );
};
