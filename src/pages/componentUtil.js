import Tooltip from "react-bootstrap/Tooltip";
import { filterStringLengh } from "../utils/data";

export const tooltipEleFunc = (inputText, limitLen = 15) => {
  if (inputText !== filterStringLengh(inputText, limitLen)) {
    return <Tooltip id={inputText}>{inputText}</Tooltip>;
  } else {
    return <></>;
  }
};
