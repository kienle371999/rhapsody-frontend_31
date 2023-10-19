import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DatePicker from "@mui/lab/DatePicker";
import toast from "react-hot-toast";
import { Form, Field } from "react-final-form";
import { useRouter } from "next/router";
import { ROUTES } from "@/config/navigation";
import { ButtonBack } from "@/components/buttons/back";
import { useAuth } from "@/contexts/auth";
import { getAuthLink } from "@/services/parse/functions/auth";
import { AppTextField } from "@/components/inputs/text";
import { useTranslation } from "next-i18next";
import { SignInButtonGroupSocialNetwork } from "@/screens/sign-in/components/button-group-social-network";
import { ButtonPrimary } from "@/components/buttons/styles";
import { emailFormat, isOver18 } from "@/utils/validators";

export const SignUpForm = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const validate = (values: any = {}) => {
    const errors: any = {};
    if (!values.firstName) {
      errors.firstName = t("formError.required");
    }
    if (!values.lastName) {
      errors.lastName = t("formError.required");
    }
    if (!values.email) {
      errors.email = t("formError.required");
    }
    if (!values.password) {
      errors.password = t("formError.required");
    }
    if (!values.birthDate) {
      errors.birthDate = t("formError.required");
    }
    if (emailFormat(values.email)) {
      errors.email = t("formError.invalidEmail");
    }
    if (!isOver18(values.birthDate)) {
      errors.birthDate = t("formError.invalidAge");
    }
    return errors;
  };

  const onSubmit = async (values: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
  }) => {
    try {
      setIsLoading(true);
      const registeredUser = await auth.register(values);
      if (registeredUser) {
        router.push({
          pathname: ROUTES.signUpStep2,
        });
        setIsLoading(false);
      }
    } catch (e: any) {
      setIsLoading(false);
      toast.error(e.message);
    }
  };

  const handleRegisterWithGoogle = async () => {
    try {
      let oauth = await getAuthLink("register");
      if (oauth) {
        window.location.href = oauth;
      }
    } catch (e) {
      toast.error("oups");
    }
  };

  return (
    <Stack width="100%" spacing={{ xs: 3, md: 2 }}>
      <ButtonBack />
      <Typography variant="title1">{t("signUp.stepOneTitle")}</Typography>
      <Typography variant="p1">{t("signUp.stepOneSubtitle")}</Typography>

      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, submitting, pristine }) => (
          <form onSubmit={handleSubmit}>
            <Stack width="100%" spacing={{ xs: 3, md: 1 }}>
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
              <Field name="firstName">
                {({ input, meta }) => (
                  <AppTextField
                    error={meta.submitFailed && meta.error}
                    variant="filled"
                    helperText={meta.submitFailed && meta.error}
                    label={t("form.labelFirstName")}
                    type="text"
                    {...input}
                  />
                )}
              </Field>
              <Field name="lastName">
                {({ input, meta }) => (
                  <AppTextField
                    error={meta.submitFailed && meta.error}
                    variant="filled"
                    helperText={meta.submitFailed && meta.error}
                    label={t("form.labelLastName")}
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
              <ButtonPrimary
                loading={isLoading}
                type="submit"
                fullWidth
                size="medium"
              >
                {t("signUp.continue")}
              </ButtonPrimary>
            </Stack>
          </form>
        )}
      />
      <SignInButtonGroupSocialNetwork
        handleSocialAction={handleRegisterWithGoogle}
      />
    </Stack>
  );
};
