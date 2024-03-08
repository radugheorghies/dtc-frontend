import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from 'react';
import { useRouter } from "next/router";
import HomePage from '../../components/HomePage';
import { useActivateAccount } from "../../hooks/user";

const validationSchema = Yup.object({
    password: Yup.string()
        .required("* password is a required field")
        .min(8, "* password must be at least 8 characters")
        .matches(/^(?=.*[a-z])/, " * password must contain one lowercase character")
        .matches(/^(?=.*[A-Z])/, " * password must contain one uppercase character")
        .matches(/^(?=.*[0-9])/, " * password must contain one number character")
        .matches(
        /^(?=.*[!@#\$%\^&\*])/,
        " * password must contain one special case character"
        ),
    passwordConfirmation: Yup.string()
        .required("* please make sure the passwords match")
        .oneOf(
        [Yup.ref("password"), null],
        "* please make sure the passwords match"
        ),
});

const inputStyle ="h-12 border-2 border-gray-400 px-4 text-sm block text-gray-600";

function Activate() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const token = router.query.token;
  const { activateAccount } = useActivateAccount();

  const setPassword = async (newPassword) => {
    console.log("token:", token);

    const result = await activateAccount(newPassword, token);

    console.log("result:", result)

    if (result) {
      setSuccess(true);
      setErrorMsg("");
    } else {
      setErrorMsg("error activating the account");
    }
  };

  return (
    <HomePage title="Activate your account">
      <div className="flex grid grid-cols-1 flex-col lg:flex-row">
        {success ? (
          <div className="mt-10 mb-3 flex space-x-2 text-lg">
            <p className="text-center text-green-400 ">
              Password successfully changed!
            </p>
            <span className="text-center">
              {" "}
              <span
                className="text-primary cursor-pointer font-semibold"
                onClick={() => router.push("/")}
              >
                Log In
              </span>{" "}
            </span>
          </div>
        ) : (
          <>
            <div className="">
              <p className="text-left font-light mt-6">
                Please set up your password in order to activate your account.
              </p>
            </div>
            <Formik
              initialValues={{ password: "", passwordConfirmation: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                await setPassword(values.password);
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-7 mt-10 flex flex-col w-full min-w-[20rem] max-w-[30rem]">
                  <div>
                    <Field
                      type="password"
                      name="password"
                      className={`w-full ${inputStyle}`}
                      placeholder="Password"
                    />
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-third text-xs text-right text-red-700"
                    />
                  </div>
                  <div>
                    <Field
                      type="password"
                      name="passwordConfirmation"
                      className={`w-full ${inputStyle}`}
                      placeholder="Password Confirmation"
                    />
                    <ErrorMessage
                      name="passwordConfirmation"
                      component="p"
                      className="text-third text-xs text-right text-red-700"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-white bg-green-800 text-gray-100 rounded px-4 py-2 my-2
                    hover:bg-green-700"
                  >
                    Set Password
                  </button>
                  <p className="text-center text-xs text-third text-red-700">{errorMsg}</p>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </HomePage>
  );
}

export default Activate;
