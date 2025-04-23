/* eslint-disable react/prop-types */

import React from "react";

const FormField = ({ label, htmlFor, children, error }) => {
  const id = htmlFor || getChildId(children);
  return (
    <div style={styles.inputGroup}>
      {label && (
        <label htmlFor={id} style={styles.label}>
          {label}
        </label>
      )}
      {children}
      {!!error && <span style={styles.error}>{error.message}</span>}
    </div>
  );
};

const getChildId = (children) => {
  const child = React.Children.only(children);
  if ("id" in child.props) {
    return child.props.id;
  }
};
const styles = {
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
  },
  error: { color: "red", fontSize: "12px" },
};
export default FormField;
