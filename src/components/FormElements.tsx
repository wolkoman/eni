import Radium from "radium";
import React, { Dispatch } from "react";
import { style } from "../util/style";

export const Button = Radium(
  ({
    text,
    onClick,
    disabled = false,
  }: {
    text: string;
    disabled?: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: "relative",
        padding: "10px 20px",
        fontSize: 18,
        border: "none",
        background: style.accent1,
        color: "white",
        borderRadius: style.borderRadius,
        fontWeight: "bold",
        boxShadow: `0px 5px 0 ${style.accent1Light}`,
        top: 0,
        transition: "all .1s",
        cursor: "pointer",
        [":hover" as any]: {
          top: 3,
          boxShadow: `0px 2px 0 ${style.accent1Light}`,
        },
      }}
    >
      {text}
    </button>
  )
);
export const Label = ({ label }: { label: string }) => (
  <div
    style={{
      opacity: 0.7,
      textTransform: "uppercase",
      fontSize: 13,
      marginBottom: 5,
    }}
  >
    {label}
  </div>
);
export const Input = Radium(
  ({
    label,
    value,
    setValue,
    isPassword = false,
    disabled = false,
    centered = false,
  }: {
    label: string;
    value: string;
    setValue: Dispatch<string>;
    isPassword?: boolean;
    disabled?: boolean;
    centered?: boolean;
  }) => (
    <div style={{ padding: "15px 0" }}>
      <Label label={label} />
      <input
        disabled={disabled}
        type={isPassword ? "password" : "text"}
        style={{
          fontSize: 24,
          textAlign: centered ? "center" : "unset",
          width: "calc(100% - 10px)",
          padding: "5px 10px",
          border: `2px solid ${style.accent1}`,
          borderRadius: style.borderRadius,
          outline: "none",
        }}
        value={value}
        onChange={e =>
          setValue(((e.target as unknown) as { value: string }).value)
        }
      />
    </div>
  )
);