import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../util/config";
import { style } from "../util/style";
import Box from "./Box";
import { Button, Input, Label } from "./FormElements";

export default () => {
  const [form, setForm] = useState<{
    mail: string;
    confirmed: boolean;
    success: boolean;
    errors: string[];
  }>({
    mail: "",
    confirmed: false,
    success: false,
    errors: [],
  });
  const submit = () => {
    if (validateEmail(form.mail) && form.confirmed) {
      console.log(`${apiUrl}/newsletter-v1/subscribe/${form.mail}`);
      fetch(`${apiUrl}/newsletter-v1/subscribe/${form.mail}`)
        .then(x => x.json())
        .then(x => {
          if (x.success) {
            setForm({ ...form, success: true });
          } else {
            setForm({ ...form, errors: [x.error] });
          }
        });
    } else {
      setForm({
        ...form,
        errors: [
          validateEmail(form.mail)
            ? null
            : "Bitte geben Sie eine korrekte Mail Adresse an.",
          form.confirmed
            ? null
            : "Bitte stimmen Sie der Datenschutzerkärung zu.",
        ].filter(x => x !== null) as string[],
      });
    }
  };
  return (
    <Box label="Newsletter" padded={true} styled={true}>
      {form.success ? (
        <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 24 }}>
          Wir haben Ihnen soeben eine Bestätigungsmail gesendet.<br></br>Danke
          für die Anmeldung!
        </div>
      ) : (
        <div>
          <div style={{ paddingBottom: 15 }}>
            <Label label="ENI - Newsletter" />
            In unserem monatlichen Newsletter informieren wir kurz und prägnant
            über zukünftige, aktuelle und vergangene Geschehnisse in unseren
            drei Pfarren. Durch Angabe Ihrer E-Mail Adresse können wir auch
            Ihnen den Newsletter jeweils zum Monatsbeginn zustellen.
          </div>
          <Input
            label="E-Mail"
            value={form.mail}
            setValue={mail => setForm({ ...form, mail })}
          />
          <div
            style={{
              display: "flex",
              [style.mobile]: { flexDirection: "column" },
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <div>
                <Label label="Datenschutz" />
                <div style={{ display: "flex" }}>
                  <input
                    type="checkbox"
                    checked={form.confirmed ?? false}
                    onChange={e =>
                      setForm({
                        ...form,
                        confirmed: ((e.target as unknown) as {
                          checked: boolean;
                        }).checked,
                      })
                    }
                  ></input>
                  <div
                    onClick={() =>
                      setForm({ ...form, confirmed: !form.confirmed })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    Ich bin mit der Verarbeitung meiner E-Mail-Adresse
                    einverstanden und akzeptiere die{" "}
                    <Link to="/impressum">Datenschutzerklärung</Link>.
                  </div>
                </div>
                {form.errors.length === 0 ? null : (
                  <div style={{ marginTop: 10, color: "red" }}>
                    {form.errors.map(error => (
                      <div>{error}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={{ width: 20, height: 20 }} />
            <div style={{ alignSelf: "flex-end" }}>
              <Button text="Anmelden" onClick={submit}></Button>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};
function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
