import React from "react";
import styles from "./NumberCount.module.css";

const numberFormatter = new Intl.NumberFormat();

interface NumberCountProps {
  children: number;
}

const NumberCount: React.FC<NumberCountProps> = ({ children }) => {
  return (
    <span className={styles.number}>{numberFormatter.format(children)}</span>
  );
};

export default NumberCount;
