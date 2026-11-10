/* --- COPY BUTTON --- */
const css = String.raw;

// prettier-ignore
export default css`
.respec-button-copy-paste {
  position: absolute;
  height: 28px;
  width: 40px;
  cursor: pointer;
  background-image: linear-gradient(#fcfcfc, #eee);
  border: 1px solid rgb(144, 184, 222);
  border-left: 0;
  border-radius: 0px 0px 3px 0;
  -webkit-user-select: none;
  user-select: none;
  -webkit-appearance: none;
  top: 0;
  left: 127px;
}

@media print {
  .respec-button-copy-paste {
    visibility: hidden;
  }
}
`;
